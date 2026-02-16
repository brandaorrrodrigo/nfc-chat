import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';

@ValidatorConstraint({ name: 'IsWithinLimits', async: true })
@Injectable()
export class IsWithinLimitsConstraint implements ValidatorConstraintInterface {

  constructor(private prisma: PrismaService) {}

  async validate(userId: string, args: ValidationArguments): Promise<boolean> {
    try {
      // Buscar usuário
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
        select: {
          subscription_tier: true,
          createdAt: true
        }
      });

      if (!user) return false;

      // Plano premium_plus tem análises ilimitadas
      if (user.subscription_tier === 'premium_plus') return true;

      // Verificar quantidade de análises no mês atual
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
      const limits = {
        free: 3,
        premium: 10,
        premium_plus: Infinity
      };

      const limit = limits[user.subscription_tier as keyof typeof limits] || limits.free;

      // Verificar se está dentro do limite
      return analysesThisMonth < limit;

    } catch (error) {
      console.error('Error checking user limits:', error);
      return false;
    }
  }

  defaultMessage(args: ValidationArguments): string {
    return 'Limite mensal de análises atingido. Faça upgrade do seu plano para continuar.';
  }
}

export function IsWithinLimits(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsWithinLimitsConstraint,
    });
  };
}
