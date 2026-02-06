import { Injectable, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import * as avatarCatalog from './avatar-catalog.json';

export interface AvatarAssignmentCriteria {
  sexo?: 'M' | 'F';
  idade?: number;
  biotipo?: 'ectomorfo' | 'mesomorfo' | 'endomorfo';
  objetivo?: string;
}

export interface Avatar {
  id: string;
  sexo: string;
  idade_range: string;
  biotipo: string;
  estilo: string;
  skin_tone: string;
  hair_color: string;
  img: string;
  initials_color: string;
  tags: string[];
}

@Injectable()
export class AvatarService {
  private readonly logger = new Logger(AvatarService.name);
  private avatars: Avatar[];
  private fallbackColors: string[];
  private prisma: PrismaClient;

  constructor() {
    this.avatars = (avatarCatalog as any).avatars;
    this.fallbackColors = (avatarCatalog as any).fallback_colors;
    this.prisma = new PrismaClient();
  }

  /**
   * Atribui avatar inteligente baseado em critérios
   * Sistema de filtros em cascata:
   * 1. Filtra por sexo (se fornecido)
   * 2. Filtra por idade (se fornecido)
   * 3. Filtra por biotipo (se fornecido)
   * 4. Filtra por objetivo/tags (se fornecido)
   * 5. Escolhe aleatoriamente entre os candidatos restantes
   */
  assignAvatar(criteria: AvatarAssignmentCriteria = {}): Avatar {
    let candidates = [...this.avatars];

    // Filtrar por sexo
    if (criteria.sexo) {
      const filtered = candidates.filter(a => a.sexo === criteria.sexo);
      if (filtered.length > 0) {
        candidates = filtered;
        this.logger.debug(`Filtrado por sexo ${criteria.sexo}: ${candidates.length} candidatos`);
      }
    }

    // Filtrar por idade
    if (criteria.idade) {
      const filtered = candidates.filter(a => {
        const [min, max] = a.idade_range.split('-').map(Number);
        return criteria.idade! >= min && criteria.idade! <= max;
      });
      if (filtered.length > 0) {
        candidates = filtered;
        this.logger.debug(`Filtrado por idade ${criteria.idade}: ${candidates.length} candidatos`);
      }
    }

    // Filtrar por biotipo
    if (criteria.biotipo) {
      const filtered = candidates.filter(a => a.biotipo === criteria.biotipo);
      if (filtered.length > 0) {
        candidates = filtered;
        this.logger.debug(`Filtrado por biotipo ${criteria.biotipo}: ${candidates.length} candidatos`);
      }
    }

    // Filtrar por objetivo (tags)
    if (criteria.objetivo) {
      const objetivo = criteria.objetivo.toLowerCase();
      const filtered = candidates.filter(a =>
        a.tags.some(tag => objetivo.includes(tag) || tag.includes(objetivo))
      );
      if (filtered.length > 0) {
        candidates = filtered;
        this.logger.debug(`Filtrado por objetivo "${criteria.objetivo}": ${candidates.length} candidatos`);
      }
    }

    // Escolher aleatoriamente entre candidatos
    const selected = candidates[Math.floor(Math.random() * candidates.length)];

    this.logger.log(`✓ Avatar selecionado: ${selected.id} (de ${candidates.length} candidatos)`);

    return selected;
  }

  /**
   * Atribui avatar completamente aleatório
   */
  assignRandomAvatar(): Avatar {
    const selected = this.avatars[Math.floor(Math.random() * this.avatars.length)];
    this.logger.log(`✓ Avatar aleatório selecionado: ${selected.id}`);
    return selected;
  }

  /**
   * Busca avatar por ID
   */
  getAvatarById(id: string): Avatar | null {
    return this.avatars.find(a => a.id === id) || null;
  }

  /**
   * Retorna todos os avatares disponíveis
   */
  getAllAvatars(): Avatar[] {
    return this.avatars;
  }

  /**
   * Gera cor de iniciais baseada em nome (fallback)
   * Hash determinístico para sempre gerar a mesma cor para o mesmo nome
   */
  getInitialsColor(name: string): string {
    const hash = name.split('').reduce((acc, char) => {
      return acc + char.charCodeAt(0);
    }, 0);

    const color = this.fallbackColors[hash % this.fallbackColors.length];
    return color;
  }

  /**
   * Extrai iniciais do nome (2 letras)
   * - Se nome tem apenas 1 palavra: primeiras 2 letras
   * - Se nome tem 2+ palavras: primeira letra do primeiro + primeira letra do último
   */
  getInitials(name: string): string {
    const parts = name.trim().split(/\s+/);

    if (parts.length === 1) {
      return parts[0].substring(0, 2).toUpperCase();
    }

    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }

  /**
   * MIGRATION: Atribui avatares para chats/posts existentes
   * Percorre todos os registros sem avatar e atribui baseado no perfil
   */
  async migrateExistingPosts(): Promise<{ migrated: number; errors: number }> {
    this.logger.log('🔄 Iniciando migração de avatares para posts...');

    // Buscar todos os posts sem avatar
    const postsWithoutAvatar = await this.prisma.post.findMany({
      where: {
        OR: [
          { avatarId: null },
          { avatarId: '' }
        ]
      },
      select: {
        id: true,
        userId: true,
        user: {
          select: {
            name: true
          }
        }
      }
    });

    this.logger.log(`📊 Encontrados ${postsWithoutAvatar.length} posts sem avatar`);

    let migrated = 0;
    let errors = 0;

    for (const post of postsWithoutAvatar) {
      try {
        // Por enquanto, atribuir avatar aleatório
        // TODO: Extrair critérios do perfil do usuário se disponível
        const avatar = this.assignRandomAvatar();

        // Atualizar no banco
        await this.prisma.post.update({
          where: { id: post.id },
          data: {
            avatarId: avatar.id,
            avatarImg: avatar.img,
            avatarInitialsColor: avatar.initials_color
          }
        });

        migrated++;

        if (migrated % 100 === 0) {
          this.logger.log(`📝 Migrados ${migrated}/${postsWithoutAvatar.length}`);
        }

      } catch (error) {
        this.logger.error(`❌ Erro ao migrar post ${post.id}: ${error.message}`);
        errors++;
      }
    }

    this.logger.log(`✅ Migração completa: ${migrated} posts atualizados, ${errors} erros`);

    return { migrated, errors };
  }

  /**
   * Estatísticas de uso de avatares
   */
  async getAvatarStats(): Promise<any[]> {
    const usage = await this.prisma.post.groupBy({
      by: ['avatarId'],
      _count: true
    });

    return usage
      .map(u => ({
        avatar_id: u.avatarId,
        count: u._count,
        avatar: this.getAvatarById(u.avatarId || '')
      }))
      .sort((a, b) => b.count - a.count);
  }

  /**
   * Limpar recursos
   */
  async onModuleDestroy() {
    await this.prisma.$disconnect();
  }
}
