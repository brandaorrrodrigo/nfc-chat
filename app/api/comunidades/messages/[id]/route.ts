/**
 * API: Edição e Exclusão de Mensagens
 * Path: /api/comunidades/messages/[id]
 *
 * PATCH - Editar mensagem (limite: 15 minutos após criação)
 * DELETE - Excluir mensagem (soft delete)
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-config';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

// Limite de tempo para edição (em minutos)
const EDIT_TIME_LIMIT_MINUTES = 15;

interface RouteParams {
  params: { id: string };
}

/**
 * PATCH /api/comunidades/messages/[id]
 * Edita uma mensagem existente
 */
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    // Verificar se Supabase está configurado
    if (!isSupabaseConfigured() || !supabase) {
      return NextResponse.json(
        { error: 'Database not configured', success: false },
        { status: 503 }
      );
    }

    // Verificar autenticação
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Não autenticado' },
        { status: 401 }
      );
    }

    const messageId = params.id;
    const body = await request.json();
    const { content } = body;

    // Validar conteúdo
    if (!content || typeof content !== 'string') {
      return NextResponse.json(
        { error: 'Conteúdo é obrigatório' },
        { status: 400 }
      );
    }

    const cleanContent = content.trim();
    if (cleanContent.length === 0 || cleanContent.length > 2000) {
      return NextResponse.json(
        { error: 'Conteúdo deve ter entre 1 e 2000 caracteres' },
        { status: 400 }
      );
    }

    // Buscar mensagem existente
    const { data: existingMessage, error: fetchError } = await supabase
      .from('nfc_chat_messages')
      .select('*')
      .eq('id', messageId)
      .single();

    if (fetchError || !existingMessage) {
      return NextResponse.json(
        { error: 'Mensagem não encontrada' },
        { status: 404 }
      );
    }

    // Verificar se é o autor
    const userId = session.user.id || session.user.email;
    if (existingMessage.user_id !== userId) {
      return NextResponse.json(
        { error: 'Você só pode editar suas próprias mensagens' },
        { status: 403 }
      );
    }

    // Verificar se já foi deletada
    if (existingMessage.is_deleted) {
      return NextResponse.json(
        { error: 'Mensagem foi excluída' },
        { status: 400 }
      );
    }

    // Verificar limite de tempo (15 minutos)
    const createdAt = new Date(existingMessage.created_at);
    const now = new Date();
    const minutesSinceCreation = (now.getTime() - createdAt.getTime()) / 1000 / 60;

    if (minutesSinceCreation > EDIT_TIME_LIMIT_MINUTES) {
      return NextResponse.json(
        {
          error: `Tempo limite de edição excedido (${EDIT_TIME_LIMIT_MINUTES} minutos)`,
          minutesSinceCreation: Math.floor(minutesSinceCreation),
        },
        { status: 400 }
      );
    }

    // Verificar se conteúdo mudou
    if (cleanContent === existingMessage.content) {
      return NextResponse.json(
        { error: 'Conteúdo não foi alterado' },
        { status: 400 }
      );
    }

    // Preparar dados de atualização
    const updateData: Record<string, any> = {
      content: cleanContent,
      is_edited: true,
      edited_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // Salvar conteúdo original na primeira edição
    if (!existingMessage.original_content) {
      updateData.original_content = existingMessage.content;
    }

    // Atualizar no banco
    const { data: updatedMessage, error: updateError } = await supabase
      .from('nfc_chat_messages')
      .update(updateData)
      .eq('id', messageId)
      .select()
      .single();

    if (updateError) {
      console.error('Erro ao atualizar mensagem:', updateError);
      throw updateError;
    }

    return NextResponse.json({
      success: true,
      message: {
        id: updatedMessage.id,
        content: updatedMessage.content,
        is_edited: updatedMessage.is_edited,
        edited_at: updatedMessage.edited_at,
      },
    });
  } catch (error: any) {
    console.error('[PATCH Message Error]', error);
    return NextResponse.json(
      { error: 'Erro ao editar mensagem', details: error.message },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/comunidades/messages/[id]
 * Exclui uma mensagem (soft delete)
 *
 * ANTI-EXPLOIT: Remove FP ganho pela mensagem deletada
 */
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    // Verificar se Supabase está configurado
    if (!isSupabaseConfigured() || !supabase) {
      return NextResponse.json(
        { error: 'Database not configured', success: false },
        { status: 503 }
      );
    }

    // Verificar autenticação
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Não autenticado' },
        { status: 401 }
      );
    }

    const messageId = params.id;

    // Buscar mensagem existente
    const { data: existingMessage, error: fetchError } = await supabase
      .from('nfc_chat_messages')
      .select('*')
      .eq('id', messageId)
      .single();

    if (fetchError || !existingMessage) {
      return NextResponse.json(
        { error: 'Mensagem não encontrada' },
        { status: 404 }
      );
    }

    // Verificar se é o autor
    const userId = session.user.id || session.user.email;
    if (existingMessage.user_id !== userId) {
      return NextResponse.json(
        { error: 'Você só pode excluir suas próprias mensagens' },
        { status: 403 }
      );
    }

    // Verificar se já foi deletada
    if (existingMessage.is_deleted) {
      return NextResponse.json(
        { error: 'Mensagem já foi excluída' },
        { status: 400 }
      );
    }

    // ==========================================
    // ANTI-EXPLOIT: Remover FP ganho pela mensagem
    // ==========================================

    // Buscar transações de FP relacionadas a esta mensagem
    // Nota: Busca por ambas as chaves possíveis no metadata (messageId e message_id)
    const { data: fpTransactions, error: fpQueryError } = await supabase
      .from('nfc_chat_fp_transactions')
      .select('*')
      .eq('user_id', userId)
      .eq('type', 'earn')
      .gte('created_at', existingMessage.created_at); // Só transações após criação da mensagem

    console.log(`[DELETE Message] Buscando transações de FP para mensagem ${messageId}...`);

    let fpToRemove = 0;
    const validTransactions: any[] = [];

    // Filtrar manualmente transações relacionadas a esta mensagem
    if (fpTransactions && fpTransactions.length > 0) {
      for (const tx of fpTransactions) {
        const metadata = tx.metadata || {};
        const txMessageId = metadata.messageId || metadata.message_id;

        if (txMessageId === messageId) {
          validTransactions.push(tx);
          fpToRemove += tx.amount;
        }
      }

      console.log(`[DELETE Message] Encontradas ${validTransactions.length} transações totalizando ${fpToRemove} FP`);

      if (validTransactions.length > 0 && fpToRemove > 0) {
        // Buscar saldo atual do usuário
        const { data: userFP, error: userFPError } = await supabase
          .from('nfc_chat_user_fp')
          .select('*')
          .eq('user_id', userId)
          .single();

        if (userFPError) {
          console.error('[DELETE Message] Erro ao buscar saldo do usuário:', userFPError);
        }

        if (userFP) {
          const newBalance = Math.max(0, userFP.balance - fpToRemove);
          const newTotalEarned = Math.max(0, userFP.total_earned - fpToRemove);

          console.log(`[DELETE Message] Saldo anterior: ${userFP.balance} FP → Novo saldo: ${newBalance} FP`);

          // Atualizar saldo
          const { error: updateError } = await supabase
            .from('nfc_chat_user_fp')
            .update({
              balance: newBalance,
              total_earned: newTotalEarned,
              fp_earned_today: Math.max(0, (userFP.fp_earned_today || 0) - fpToRemove),
              updated_at: new Date().toISOString(),
            })
            .eq('user_id', userId);

          if (updateError) {
            console.error('[DELETE Message] Erro ao atualizar saldo:', updateError);
          }

          // Registrar transação de remoção
          const { error: insertError } = await supabase
            .from('nfc_chat_fp_transactions')
            .insert({
              user_id: userId,
              amount: -fpToRemove,
              type: 'spend',
              action: 'admin_adjust',
              description: 'FP removido por deletar mensagem',
              metadata: {
                reason: 'message_deleted',
                message_id: messageId,
                deleted_at: new Date().toISOString(),
                original_transactions: validTransactions.map(tx => tx.id),
              },
            });

          if (insertError) {
            console.error('[DELETE Message] Erro ao registrar transação de remoção:', insertError);
          }
        }
      }
    } else {
      console.log('[DELETE Message] Nenhuma transação de FP encontrada para esta mensagem');
    }

    // Soft delete
    const { error: deleteError } = await supabase
      .from('nfc_chat_messages')
      .update({
        is_deleted: true,
        deleted_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', messageId);

    if (deleteError) {
      console.error('Erro ao excluir mensagem:', deleteError);
      throw deleteError;
    }

    return NextResponse.json({
      success: true,
      messageId,
      fpRemoved: fpToRemove,
      message: fpToRemove > 0
        ? `Mensagem deletada. ${fpToRemove} FP foi removido do seu saldo.`
        : 'Mensagem deletada.',
    });
  } catch (error: any) {
    console.error('[DELETE Message Error]', error);
    return NextResponse.json(
      { error: 'Erro ao excluir mensagem', details: error.message },
      { status: 500 }
    );
  }
}
