import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Serviço para geração dinâmica de avatares SVG com iniciais
 * Usado como fallback quando não há imagem de avatar disponível
 */
@Injectable()
export class AvatarGeneratorService {

  /**
   * Gera avatar SVG com iniciais
   * @param initials - Iniciais do usuário (1-2 letras)
   * @param bgColor - Cor de fundo em hexadecimal (#RRGGBB)
   * @param size - Tamanho do SVG em pixels (padrão: 200)
   * @returns String contendo o SVG completo
   */
  generateInitialsSVG(
    initials: string,
    bgColor: string,
    size: number = 200
  ): string {
    const svg = `
      <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
        <rect width="${size}" height="${size}" fill="${bgColor}" rx="${size / 10}"/>
        <text
          x="50%"
          y="50%"
          text-anchor="middle"
          dy=".35em"
          font-family="Inter, Arial, sans-serif"
          font-size="${size * 0.4}"
          font-weight="600"
          fill="white"
        >
          ${initials}
        </text>
      </svg>
    `.trim();

    return svg;
  }

  /**
   * Salva SVG em arquivo no sistema de arquivos
   * @param avatarId - ID único do avatar
   * @param initials - Iniciais do usuário
   * @param bgColor - Cor de fundo
   * @returns Caminho relativo do arquivo salvo
   */
  async saveSVGToFile(
    avatarId: string,
    initials: string,
    bgColor: string
  ): Promise<string> {
    const svg = this.generateInitialsSVG(initials, bgColor);

    const dir = path.join(process.cwd(), 'public', 'avatars', 'generated');
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    const filePath = path.join(dir, `${avatarId}.svg`);
    fs.writeFileSync(filePath, svg);

    return `/avatars/generated/${avatarId}.svg`;
  }

  /**
   * Gera SVG como base64 data URL
   * Útil para uso inline sem necessidade de arquivo
   * @param initials - Iniciais do usuário
   * @param bgColor - Cor de fundo
   * @returns Data URL completo para uso em src de img
   */
  generateDataURL(initials: string, bgColor: string): string {
    const svg = this.generateInitialsSVG(initials, bgColor);
    const base64 = Buffer.from(svg).toString('base64');
    return `data:image/svg+xml;base64,${base64}`;
  }

  /**
   * Gera múltiplos avatares SVG em lote
   * Útil para pré-gerar avatares para usuários comuns
   * @param users - Array de usuários com { id, name, color }
   * @returns Array de caminhos dos arquivos gerados
   */
  async generateBatch(
    users: Array<{ id: string; name: string; color: string }>
  ): Promise<string[]> {
    const paths: string[] = [];

    for (const user of users) {
      const initials = this.extractInitials(user.name);
      const path = await this.saveSVGToFile(user.id, initials, user.color);
      paths.push(path);
    }

    return paths;
  }

  /**
   * Extrai iniciais de um nome
   * Lógica idêntica ao AvatarService.getInitials()
   * @param name - Nome completo
   * @returns Iniciais (2 letras)
   */
  private extractInitials(name: string): string {
    const parts = name.trim().split(/\s+/);

    if (parts.length === 1) {
      return parts[0].substring(0, 2).toUpperCase();
    }

    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
}
