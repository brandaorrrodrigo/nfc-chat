/**
 * Sistema de Respostas Automáticas da IA
 * Detecta perguntas sem resposta e responde automaticamente
 */

import { supabase } from '../supabase';
import { askRAG } from '../rag/rag-service';
import { shouldAIIntervene } from '../ai/llm';

export interface UnansweredQuestion {
  id: string;
  content: string;
  arenaSlug: string;
  arenaTitle: string;
  authorId: string;
  authorName: string;
  createdAt: string;
  timeSincePost: number; // em minutos
}

export interface AIResponse {
  messageId: string;
  content: string;
  confidence: number;
  sources: any[];
}

/**
 * Busca perguntas sem resposta há mais de X minutos
 */
export async function findUnansweredQuestions(
  minMinutesSincePost: number = 30
): Promise<UnansweredQuestion[]> {
  try {
    console.log(`🔍 Finding unanswered questions (>${minMinutesSincePost} min old)...`);

    // Calcular timestamp mínimo
    const minTime = new Date(Date.now() - minMinutesSincePost * 60 * 1000);

    // Buscar mensagens com ponto de interrogação e sem respostas
    const { data: messages, error } = await supabase
      .from('nfc_chat_messages')
      .select('*')
      .ilike('content', '%?%') // Contém '?'
      .lt('created_at', minTime.toISOString())
      .is('parent_id', null) // Apenas posts raiz
      .or('is_deleted.is.null,is_deleted.eq.false')
      .order('created_at', { ascending: true })
      .limit(20);

    if (error) {
      console.error('Error fetching messages:', error);
      return [];
    }

    if (!messages || messages.length === 0) {
      console.log('  No unanswered questions found');
      return [];
    }

    // Filtrar mensagens que realmente não têm respostas
    const unanswered: UnansweredQuestion[] = [];

    for (const msg of messages) {
      // Verificar se tem respostas
      const { data: replies } = await supabase
        .from('nfc_chat_messages')
        .select('id')
        .eq('parent_id', msg.id)
        .limit(1);

      // Se não tem replies, é pergunta sem resposta
      if (!replies || replies.length === 0) {
        const timeSincePost = (Date.now() - new Date(msg.created_at).getTime()) / 1000 / 60;

        unanswered.push({
          id: msg.id,
          content: msg.content,
          arenaSlug: msg.comunidade_slug,
          arenaTitle: msg.comunidade_slug, // TODO: buscar título real
          authorId: msg.user_id,
          authorName: msg.user_name,
          createdAt: msg.created_at,
          timeSincePost,
        });
      }
    }

    console.log(`✅ Found ${unanswered.length} unanswered questions`);

    return unanswered;
  } catch (error: any) {
    console.error('❌ Error finding unanswered questions:', error);
    return [];
  }
}

/**
 * Gera resposta para uma pergunta usando RAG
 */
export async function generateAIResponseForQuestion(
  question: UnansweredQuestion
): Promise<AIResponse | null> {
  try {
    console.log(`🤖 Generating AI response for: "${question.content.substring(0, 50)}..."`);

    // Usar RAG para gerar resposta
    const ragResult = await askRAG({
      question: question.content,
      arenaContext: question.arenaTitle,
      persona: 'BALANCED',
      maxResults: 5,
      minScore: 0.3,
    });

    // Validar qualidade da resposta
    if (ragResult.confidenceScore < 0.4) {
      console.log('  Response confidence too low, skipping');
      return null;
    }

    // Adicionar disclaimer de IA
    const content = `${ragResult.answer}\n\n---\n🤖 *Resposta gerada por IA. Para dúvidas específicas ou condições de saúde, consulte um profissional.*`;

    return {
      messageId: question.id,
      content,
      confidence: ragResult.confidenceScore,
      sources: ragResult.sources,
    };
  } catch (error: any) {
    console.error('❌ Error generating AI response:', error);
    return null;
  }
}

/**
 * Posta resposta da IA no banco
 */
export async function postAIResponse(
  parentMessageId: string,
  response: AIResponse,
  arenaSlug: string
): Promise<boolean> {
  try {
    console.log(`📝 Posting AI response to message ${parentMessageId}...`);

    const responseId = `msg_ai_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Inserir resposta no banco
    const { error } = await supabase.from('nfc_chat_messages').insert({
      id: responseId,
      comunidade_slug: arenaSlug,
      user_id: 'ai_assistant',
      user_name: '🤖 NFC Assistant',
      user_avatar: null,
      content: response.content,
      parent_id: parentMessageId,
    });

    if (error) {
      console.error('Error posting AI response:', error);
      return false;
    }

    console.log(`✅ AI response posted: ${responseId}`);

    return true;
  } catch (error: any) {
    console.error('❌ Error posting AI response:', error);
    return false;
  }
}

/**
 * Processa perguntas sem resposta e gera respostas da IA
 */
export async function processUnansweredQuestions(
  options: {
    minMinutesSincePost?: number;
    maxResponses?: number;
    interventionRate?: number; // 0-100
  } = {}
): Promise<{
  processed: number;
  responded: number;
  skipped: number;
}> {
  const {
    minMinutesSincePost = 30,
    maxResponses = 5,
    interventionRate = 50,
  } = options;

  console.log(`\n🚀 Processing unanswered questions...`);

  const stats = {
    processed: 0,
    responded: 0,
    skipped: 0,
  };

  try {
    // Buscar perguntas sem resposta
    const unanswered = await findUnansweredQuestions(minMinutesSincePost);

    if (unanswered.length === 0) {
      console.log('  No unanswered questions to process');
      return stats;
    }

    // Processar até maxResponses
    const toProcess = unanswered.slice(0, maxResponses);

    for (const question of toProcess) {
      stats.processed++;

      // Verificar se deve intervir (baseado em probabilidade)
      const shouldIntervene = Math.random() * 100 < interventionRate;

      if (!shouldIntervene) {
        console.log(`  Skipping (intervention rate): ${question.id}`);
        stats.skipped++;
        continue;
      }

      // Gerar resposta
      const aiResponse = await generateAIResponseForQuestion(question);

      if (!aiResponse) {
        console.log(`  Skipping (low confidence): ${question.id}`);
        stats.skipped++;
        continue;
      }

      // Postar resposta
      const posted = await postAIResponse(
        question.id,
        aiResponse,
        question.arenaSlug
      );

      if (posted) {
        stats.responded++;
      } else {
        stats.skipped++;
      }

      // Delay para não sobrecarregar
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }

    console.log(`\n✅ Processing complete:`);
    console.log(`   Processed: ${stats.processed}`);
    console.log(`   Responded: ${stats.responded}`);
    console.log(`   Skipped: ${stats.skipped}`);

    return stats;
  } catch (error: any) {
    console.error('❌ Error processing unanswered questions:', error);
    return stats;
  }
}

/**
 * Verifica se pergunta é adequada para resposta automática
 */
export function isQuestionSuitableForAI(content: string): boolean {
  const lowerContent = content.toLowerCase();

  // Requer resposta pessoal
  const personalKeywords = [
    'meu caso',
    'minha situação',
    'eu tenho',
    'devo fazer',
    'posso tomar',
  ];

  if (personalKeywords.some((kw) => lowerContent.includes(kw))) {
    return false;
  }

  // Requer diagnóstico médico
  const medicalKeywords = ['diagnosticar', 'prescrever', 'remediar', 'sintomas'];

  if (medicalKeywords.some((kw) => lowerContent.includes(kw))) {
    return false;
  }

  // Pergunta muito curta
  if (content.length < 20) {
    return false;
  }

  // Pergunta muito específica/técnica (contém números muito específicos)
  const hasVerySpecificNumbers = /\d{4,}/.test(content);
  if (hasVerySpecificNumbers) {
    return false;
  }

  return true;
}
