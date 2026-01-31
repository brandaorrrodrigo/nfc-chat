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

// ========================================
// NOVO SISTEMA v2 - Anti-Spam + Follow-Up
// ========================================

export {
  decidirEResponder,
  ANTI_SPAM_CONFIG,
} from './decision-engine';

export type {
  DecisaoCompleta,
  ContextoCompletoConversa,
  AntiSpamResult,
  MensagemRecente,
} from './decision-engine';

// Anti-Spam
export {
  checkAntiSpam,
  updateUserProbability,
} from './anti-spam';

// Follow-Up Generator
export {
  gerarFollowUpQuestion,
  formatarRespostaComFollowUp,
  detectarTopico,
  FOLLOW_UP_TEMPLATES,
} from './follow-up-generator';

export type {
  FollowUpContext,
} from './follow-up-generator';

// Intervention Tracker
export {
  saveIntervention,
  markInterventionAnswered,
  getLastUnansweredIntervention,
  checkIgnoredQuestions,
  detectResponseToIntervention,
} from './intervention-tracker';

export type {
  InterventionRecord,
  SavedIntervention,
} from './intervention-tracker';

// ========================================
// SISTEMA DE MODERACAO v3 - Acolhimento
// ========================================

// User Detector
export {
  isNewUser,
  getUserStats,
  getUserLevel,
  shouldWelcomeUser,
  findSimilarUsers,
} from './user-detector';

export type {
  UserStats,
  UserLevel,
} from './user-detector';

// Sentiment Detector
export {
  detectSentiment,
  extractMainTopic,
  analyzeContent,
  getMisinformationCorrection,
  classifyMessageType,
} from './sentiment-detector';

export type {
  SentimentAnalysis,
  TopicAnalysis,
  ContentAnalysis,
} from './sentiment-detector';

// Response Templates
export {
  AI_RESPONSE_TEMPLATES,
  generateResponse,
  calculateFPReward,
} from './response-templates';

export type {
  TemplateContext,
} from './response-templates';

// AI Moderator
export {
  moderateMessage,
  celebrateStreak,
  celebrateFPMilestone,
  DEFAULT_MODERATION_CONFIG,
} from './moderator';

export type {
  ModerationInput,
  ModerationResult,
  ModerationConfig,
} from './moderator';
