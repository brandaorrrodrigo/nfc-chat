/**
 * IA Module - Exportacoes Publicas
 *
 * Centraliza todas as funcoes de IA para uso no projeto.
 */

// Configuracao e constantes
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

// Motor de decisao
export {
  decidirIntervencao,
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
