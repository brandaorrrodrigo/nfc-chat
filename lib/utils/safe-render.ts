/**
 * Sanitiza qualquer valor para renderizacao segura no JSX.
 * Previne React Error #31 (Objects are not valid as a React child).
 *
 * Uso: {safeRender(valor)} em vez de {valor}
 */
export function safeRender(value: unknown): string {
  if (value === null || value === undefined) return '';
  if (typeof value === 'string') return value;
  if (typeof value === 'number') return String(value);
  if (typeof value === 'boolean') return String(value);
  if (typeof value === 'object') {
    const obj = value as Record<string, unknown>;
    // Formato desvio: {criterio, valor, o_que_indica, possivel_causa, corretivo_sugerido}
    if (obj.criterio) {
      const parts = [obj.criterio, obj.valor, obj.o_que_indica].filter(Boolean);
      return parts.join(' — ');
    }
    // Formato ponto positivo/negativo: {nome, descricao, item, acao}
    if (obj.nome || obj.descricao || obj.item || obj.acao) {
      const parts = [obj.nome, obj.descricao, obj.item, obj.acao].filter(Boolean);
      return parts.join(' — ');
    }
    // Formato recomendacao: {prioridade, categoria, descricao, exercicio_corretivo}
    if (obj.prioridade || obj.categoria) {
      const parts = [obj.categoria, obj.descricao].filter(Boolean);
      return parts.join(': ');
    }
    // Formato classificacao: {label, classification, classificationLabel, value}
    if (obj.label && obj.classification) {
      return `${obj.label}: ${obj.classificationLabel || obj.classification}`;
    }
    // Qualquer outro objeto
    try { return JSON.stringify(value); } catch { return '[objeto]'; }
  }
  return String(value);
}
