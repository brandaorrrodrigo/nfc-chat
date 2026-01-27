/**
 * IA Module - Exportacoes Publicas
 *
 * ARQUITETURA EM CAMADAS:
 *
 * CAMADA 1 - OBSERVADORA
 * - Le mensagens, detecta padroes
 * - NAO responde automaticamente
 *
 * CAMADA 2 - FACILITADORA
 * - Decide QUANDO intervir
 * - Resumos, destaques, perguntas
 *
 * CAMADA 3 - PONTE BLOG
 * - Temas tecnicos -> artigos
 *
 * CAMADA 4 - PONTE APP
 * - Frustracao/acompanhamento -> app (sem CTA)
 */

// ========================================
// CAMADA 1: OBSERVADORA
// ========================================

export {
  analisarMensagem,
  detectarEmpateDiscussao,
  identificarUsuariosDestaque,
  calcularSentimentoGeral,
  gerarObservacao,
} from './observer';

export type {
  MensagemObservada,
  PadraoDetectado,
  UsuarioDestaque,
  ObservacaoComunidade,
} from './observer';

// ========================================
// CAMADA 2: FACILITADORA
// ========================================

export {
  decidirIntervencao,
  gerarIntervencao,
  CONFIG_FACILITADORA,
} from './facilitator';

export type {
  TipoIntervencao,
  DecisaoFacilitadora,
  IntervencaoIA,
} from './facilitator';

// ========================================
// CONFIGURACAO GERAL
// ========================================

export {
  diasDesdelancamento,
  getFaseAtual,
  getPerguntaDoDia,
  contemTopicoTecnico,
  contemFrustracao,
  buscarArtigoRelevante,
  TOPICOS_TECNICOS,
  SINAIS_FRUSTRACAO,
  ARTIGOS_BLOG,
  TEMPLATES_IA,
  CONFIG_INTERVENCAO,
} from '@/app/comunidades/config/ia-facilitadora';

export type {
  FaseComunidade,
  ArtigoBlog,
} from '@/app/comunidades/config/ia-facilitadora';

// ========================================
// LEGACY (manter compatibilidade)
// ========================================

export {
  decidirIntervencao as decidirIntervencaoLegacy,
  gerarResposta,
  getRespostaContextual,
  RESPOSTAS_CONTEXTUAIS,
} from './decision-engine';

export type {
  TipoResposta,
  DecisaoIA,
  ContextoConversa,
  MensagemConversa,
  RespostaIA,
} from './decision-engine';
