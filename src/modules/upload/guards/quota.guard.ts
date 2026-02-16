import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  BadRequestException
} from '@nestjs/common';
import { PrismaService } from '../../biomechanical/prisma.service';

@Injectable()
export class QuotaGuard implements CanActivate {

  constructor(private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const userId = request.body.userId || request.query.userId;

    if (!userId) {
      throw new BadRequestException('userId é obrigatório');
    }

    // Buscar usuário e verificar limites
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        subscription_tier: true,
        createdAt: true
      }
    });

    if (!user) {
      throw new BadRequestException('Usuário não encontrado');
    }

    // Contar análises no mês atual
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const analysesThisMonth = await this.prisma.videoAnalysis.count({
      where: {
        userId: userId,
        createdAt: {
          gte: startOfMonth
        }
      }
    });

    // Limites por plano
    const limits: Record<string, number> = {
      free: 3,
      premium: 10,
      premium_plus: Infinity
    };

    const limit = limits[user.subscription_tier] || limits.free;

    if (analysesThisMonth >= limit) {
      throw new ForbiddenException(
        `Limite mensal de análises atingido (${limit} análises). Faça upgrade do seu plano para continuar.`
      );
    }

    return true;
  }
}
