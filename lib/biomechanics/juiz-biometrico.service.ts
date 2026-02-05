/**
 * Juiz Biométrico NFV - Service
 *
 * IA especializada em análise biométrica visual objetiva
 * Analisa padrões posturais e assimetrias usando visão computacional
 * Cria baselines e realiza comparações temporais
 *
 * IMPORTANTE: Esta IA NÃO motiva, NÃO vende, NÃO suaviza.
 * Ela ANALISA, DOCUMENTA e COMPARA com critérios técnicos.
 */

import Anthropic from '@anthropic-ai/sdk';
import { PrismaClient } from '../generated/prisma';
import * as fs from 'fs';
import * as path from 'path';
import { biometricPaywall, PaywallBlockedError } from './biometric-paywall.service';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
});

const prisma = new PrismaClient();

// ============================================
// TYPES
// ============================================

export interface BiometricImages {
  frontal?: string; // base64 ou URL
  lateral?: string; // base64 ou URL
  posterior?: string; // base64 ou URL
}

export interface BiometricAnalysisInput {
  images: BiometricImages;
  user_id: string;
  baseline_id?: string; // Se for reavaliação
  current_protocol?: string; // Treino/dieta atual
}

export interface ValidationResult {
  valid: boolean;
  missing: string[];
  issues: string[];
}

export interface PaymentInfo {
  method: 'fitpoints' | 'subscription' | 'free_quota';
  cost_fps: number;
  transaction_id?: string;
}

export interface BaselineResult {
  type: 'baseline_created' | 'validation_error' | 'paywall_blocked';
  baseline_id?: string;
  analysis?: string;
  missing?: string[];
  issues?: string[];
  payment_info?: PaymentInfo;
  paywall_reason?: string;
  required_fps?: number;
  current_balance?: number;
  shortfall?: number;
}

export interface ComparisonResult {
  type: 'comparison_created' | 'validation_error' | 'paywall_blocked';
  comparison_id?: string;
  analysis?: string;
  missing?: string[];
  issues?: string[];
  payment_info?: PaymentInfo;
  paywall_reason?: string;
  required_fps?: number;
  current_balance?: number;
  shortfall?: number;
}

// ============================================
// JUIZ BIOMÉTRICO SERVICE
// ============================================

export class JuizBiometricoService {
  private systemPrompt: string;

  constructor() {
    // Carregar system prompt do arquivo
    const promptPath = path.join(
      process.cwd(),
      'backend/src/modules/community/prompts/juiz-biometrico-prompt.md'
    );

    try {
      this.systemPrompt = fs.readFileSync(promptPath, 'utf-8');
    } catch (error) {
      console.error('⚠️ Erro ao carregar prompt do Juiz Biométrico:', error);
      // Fallback básico
      this.systemPrompt = 'Você é o Juiz Biométrico NFV, especialista em análise biométrica visual objetiva.';
    }
  }

  /**
   * Analisa imagens e cria baseline
   */
  async analyzeBaseline(input: BiometricAnalysisInput): Promise<BaselineResult> {
    console.log('🔍 Iniciando análise baseline para usuário:', input.user_id);

    // 1. Validar imagens
    const validation = this.validateImages(input.images);
    if (!validation.valid) {
      console.log('❌ Validação falhou:', validation.missing);
      return {
        type: 'validation_error',
        missing: validation.missing,
        issues: validation.issues,
      };
    }

    try {
      // 2. Verificar acesso via paywall
      console.log('💰 Verificando acesso via paywall...');
      const access = await biometricPaywall.checkBaselineAccess(input.user_id);

      if (!access.allowed) {
        console.log('🚫 Acesso bloqueado:', access.reason);
        return {
          type: 'paywall_blocked',
          paywall_reason: access.reason,
          required_fps: access.cost_fps,
          current_balance: access.current_balance,
          shortfall: access.shortfall,
        };
      }

      // 3. Processar pagamento
      console.log('💳 Processando pagamento...');
      const payment = await biometricPaywall.processBaselinePayment(input.user_id);
      console.log(`✅ Pagamento processado via ${payment.method}`);

      // 4. Preparar mensagem para Claude
      const userMessage = this.buildAnalysisMessage(
        input.images,
        input.current_protocol
      );

      console.log('📤 Enviando para Claude Vision API...');

      // 5. Chamar Claude Vision
      const response = await anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 2000,
        system: this.systemPrompt,
        messages: [
          {
            role: 'user',
            content: [
              ...this.buildImageBlocks(input.images),
              { type: 'text', text: userMessage },
            ],
          },
        ],
      });

      const analysisText =
        response.content[0].type === 'text' ? response.content[0].text : '';

      console.log('✅ Análise recebida do Claude');

      // 6. Salvar baseline no banco com informações de pagamento
      const baseline = await prisma.biometricBaseline.create({
        data: {
          user_id: input.user_id,
          analysis_text: analysisText,
          images_metadata: input.images as any,
          protocol_context: input.current_protocol,
          was_free: payment.method === 'free_quota',
          cost_fps: payment.cost_fps,
          created_at: new Date(),
        },
      });

      console.log(`✅ Baseline criado: ${baseline.id}`);

      return {
        type: 'baseline_created',
        baseline_id: baseline.id,
        analysis: analysisText,
        payment_info: {
          method: payment.method,
          cost_fps: payment.cost_fps,
          transaction_id: payment.transaction_id,
        },
      };
    } catch (error) {
      if (error instanceof PaywallBlockedError) {
        console.log('🚫 Paywall bloqueado:', error.reason);
        return {
          type: 'paywall_blocked',
          paywall_reason: error.reason,
          required_fps: error.cost_fps,
          shortfall: error.shortfall,
        };
      }

      console.error('❌ Erro ao criar baseline:', error);
      throw error;
    }
  }

  /**
   * Reavaliação comparativa
   */
  async analyzeComparison(
    input: BiometricAnalysisInput
  ): Promise<ComparisonResult> {
    if (!input.baseline_id) {
      throw new Error('baseline_id é obrigatório para comparação');
    }

    console.log('🔄 Iniciando reavaliação comparativa...');
    console.log('📌 Baseline:', input.baseline_id);

    // 1. Buscar baseline
    const baseline = await prisma.biometricBaseline.findUnique({
      where: { id: input.baseline_id },
    });

    if (!baseline) {
      throw new Error('Baseline not found');
    }

    console.log('✅ Baseline encontrado:', baseline.created_at);

    // 2. Validar novas imagens
    const validation = this.validateImages(input.images);
    if (!validation.valid) {
      return {
        type: 'validation_error',
        missing: validation.missing,
        issues: validation.issues,
      };
    }

    try {
      // 3. Verificar acesso via paywall
      console.log('💰 Verificando acesso via paywall...');
      const access = await biometricPaywall.checkComparisonAccess(input.user_id);

      if (!access.allowed) {
        console.log('🚫 Acesso bloqueado:', access.reason);
        return {
          type: 'paywall_blocked',
          paywall_reason: access.reason,
          required_fps: access.cost_fps,
          current_balance: access.current_balance,
          shortfall: access.shortfall,
        };
      }

      // 4. Preparar mensagem comparativa
      const userMessage = this.buildComparisonMessage(
        baseline,
        input.current_protocol
      );

      console.log('📤 Enviando comparação para Claude Vision API...');

      // 5. Chamar Claude
      const response = await anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 2500,
        system: this.systemPrompt,
        messages: [
          {
            role: 'user',
            content: [
              ...this.buildImageBlocks(input.images),
              { type: 'text', text: userMessage },
            ],
          },
        ],
      });

      const comparisonText =
        response.content[0].type === 'text' ? response.content[0].text : '';

      console.log('✅ Comparação recebida do Claude');

      // 6. Criar ID temporário para a comparação (necessário para processar pagamento)
      const tempComparisonId = `comparison-${Date.now()}`;

      // 7. Processar pagamento
      console.log('💳 Processando pagamento...');
      const payment = await biometricPaywall.processComparisonPayment(
        input.user_id,
        tempComparisonId
      );
      console.log(`✅ Pagamento processado via ${payment.method}`);

      // 8. Salvar comparação com informações de pagamento
      const comparison = await prisma.biometricComparison.create({
        data: {
          baseline_id: baseline.id,
          user_id: input.user_id,
          analysis_text: comparisonText,
          images_metadata: input.images as any,
          protocol_context: input.current_protocol,
          cost_fps: payment.cost_fps,
          payment_method: payment.method,
          transaction_id: payment.transaction_id,
          created_at: new Date(),
        },
      });

      console.log(`✅ Comparação criada: ${comparison.id}`);

      return {
        type: 'comparison_created',
        comparison_id: comparison.id,
        analysis: comparisonText,
        payment_info: {
          method: payment.method,
          cost_fps: payment.cost_fps,
          transaction_id: payment.transaction_id,
        },
      };
    } catch (error) {
      if (error instanceof PaywallBlockedError) {
        console.log('🚫 Paywall bloqueado:', error.reason);
        return {
          type: 'paywall_blocked',
          paywall_reason: error.reason,
          required_fps: error.cost_fps,
          shortfall: error.shortfall,
        };
      }

      console.error('❌ Erro ao criar comparação:', error);
      throw error;
    }
  }

  /**
   * Busca baseline do usuário (mais recente)
   */
  async getUserBaseline(user_id: string) {
    return await prisma.biometricBaseline.findFirst({
      where: { user_id },
      orderBy: { created_at: 'desc' },
      include: {
        comparisons: {
          orderBy: { created_at: 'desc' },
          take: 5,
        },
      },
    });
  }

  /**
   * Lista todas as avaliações do usuário
   */
  async getUserEvaluations(user_id: string) {
    const baselines = await prisma.biometricBaseline.findMany({
      where: { user_id },
      orderBy: { created_at: 'desc' },
      include: {
        comparisons: {
          orderBy: { created_at: 'desc' },
        },
      },
    });

    return baselines;
  }

  /**
   * Gera mensagem de boas-vindas
   */
  getWelcomeMessage(): string {
    return `👁️ **Bem-vindo à Arena de Avaliação Biométrica NFV**

Aqui você não recebe motivação genérica ou dicas vagas.

Aqui você recebe **análise técnica corporal objetiva**.

**Como funciona:**

1️⃣ **Você envia 3 fotos** (frente, lado, costas)
2️⃣ **Eu analiso padrões posturais e assimetrias**
3️⃣ **Documento um BASELINE biométrico**
4️⃣ **Futuras fotos são comparadas com esse marco zero**

**Você descobre:**
- Se sua estratégia atual está MELHORANDO o corpo
- Se está PIORANDO
- Ou se está ESTAGNADA

Sem achismos. Com evidência visual.

**Pronto para iniciar?**

Envie suas 3 fotos (frente, lado, costas) seguindo as orientações técnicas:
- Corpo inteiro visível (cabeça aos pés)
- Roupa justa (permite ver contornos corporais)
- Postura natural relaxada
- Fundo neutro e iluminação adequada`;
  }

  // ============================================
  // MÉTODOS PRIVADOS
  // ============================================

  private validateImages(images: BiometricImages): ValidationResult {
    const missing: string[] = [];
    const issues: string[] = [];

    if (!images.frontal) missing.push('Foto frontal (frente)');
    if (!images.lateral) missing.push('Foto lateral (perfil)');
    if (!images.posterior) missing.push('Foto posterior (costas)');

    // Validação básica de formato base64
    const validateBase64 = (data: string | undefined, name: string) => {
      if (!data) return;
      if (!data.startsWith('data:image') && !data.startsWith('http')) {
        issues.push(`${name} não está em formato válido (base64 ou URL)`);
      }
    };

    validateBase64(images.frontal, 'Foto frontal');
    validateBase64(images.lateral, 'Foto lateral');
    validateBase64(images.posterior, 'Foto posterior');

    return {
      valid: missing.length === 0 && issues.length === 0,
      missing,
      issues,
    };
  }

  private buildImageBlocks(images: BiometricImages): any[] {
    const blocks: any[] = [];

    const addImageBlock = (imageData: string | undefined, label: string) => {
      if (!imageData) return;

      // Se for URL, converter para o formato esperado
      if (imageData.startsWith('http')) {
        blocks.push({
          type: 'image',
          source: {
            type: 'url',
            url: imageData,
          },
        });
      } else {
        // Assumir base64
        const base64Data = imageData.replace(/^data:image\/\w+;base64,/, '');
        const mediaType = imageData.match(/^data:(image\/\w+);base64,/)?.[1] || 'image/jpeg';

        blocks.push({
          type: 'image',
          source: {
            type: 'base64',
            media_type: mediaType,
            data: base64Data,
          },
        });
      }
    };

    if (images.frontal) {
      blocks.push({ type: 'text', text: '📸 **IMAGEM FRONTAL (Frente):**' });
      addImageBlock(images.frontal, 'frontal');
    }

    if (images.lateral) {
      blocks.push({ type: 'text', text: '📸 **IMAGEM LATERAL (Perfil):**' });
      addImageBlock(images.lateral, 'lateral');
    }

    if (images.posterior) {
      blocks.push({ type: 'text', text: '📸 **IMAGEM POSTERIOR (Costas):**' });
      addImageBlock(images.posterior, 'posterior');
    }

    return blocks;
  }

  private buildAnalysisMessage(
    images: BiometricImages,
    protocol?: string
  ): string {
    return `
SOLICITAÇÃO: ANÁLISE BIOMÉTRICA BASELINE

Imagens enviadas:
- Frontal: ${images.frontal ? '✅ Sim' : '❌ Não'}
- Lateral: ${images.lateral ? '✅ Sim' : '❌ Não'}
- Posterior: ${images.posterior ? '✅ Sim' : '❌ Não'}

Protocolo atual do usuário:
${protocol || 'Não informado'}

Execute análise biométrica completa seguindo seu protocolo técnico.
Documente este como MARCO ZERO para futuras comparações.

Use o formato de resposta obrigatório especificado no seu system prompt.
    `.trim();
  }

  private buildComparisonMessage(
    baseline: any,
    current_protocol?: string
  ): string {
    const baselineDate = new Date(baseline.created_at).toLocaleDateString('pt-BR');

    return `
REAVALIAÇÃO BIOMÉTRICA

BASELINE ORIGINAL (${baselineDate}):
${baseline.analysis_text}

PROTOCOLO NO BASELINE:
${baseline.protocol_context || 'Não informado'}

PROTOCOLO ATUAL:
${current_protocol || 'Não informado'}

NOVAS IMAGENS:
[Imagens anexadas acima]

Analise as novas imagens comparando com o baseline acima.
Use o protocolo de REAVALIAÇÃO do seu sistema.
Seja OBJETIVO: aponte melhorias, pioras e manutenções com clareza.

Use o formato de resposta comparativa obrigatório especificado no seu system prompt.
    `.trim();
  }
}

// ============================================
// EXPORT SINGLETON
// ============================================

export const juizBiometrico = new JuizBiometricoService();
