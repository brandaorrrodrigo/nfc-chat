/**
 * API: Edição e Exclusão de Mensagens
 * Path: /api/comunidades/messages/[id]
 *
 * PATCH - Editar mensagem (limite: 15 minutos após criação)
 * DELETE - Excluir mensagem (soft delete) com desconto de FP
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-config';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

// Limite de tempo para edição (em minutos)
const EDIT_TIME_LIMIT_MINUTES = 15;

interface RouteParams {
  params: Promise<{ id: string }>;
}

// Logger estruturado
function log(level: 'info' | 'error' | 'warn', operation: string, data: any) {
  const timestamp = new Date().toISOString();
  const logData = {
    timestamp,
    level: level.toUpperCase(),
    operation,
    ...data,
  };

  if (level === 'error') {
    console.error(JSON.stringify(logData));
  } else {
    console.log(JSON.stringify(logData));
  }
}

// Validação de ID de mensagem
function validateMessageId(id: string): { valid: boolean; error?: string } {
  if (!id || typeof id !== 'string') {
    return { valid: false, error: 'ID inválido' };
  }

  if (id.trim().length === 0) {
    return { valid: false, error: 'ID vazio' };
  }

  // Formato esperado: msg_timestamp_random ou UUID
  const msgPattern = /^msg_\d+_[a-z0-9]+$/;
  const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

  if (!msgPattern.test(id) && !uuidPattern.test(id)) {
    return { valid: false, error: 'Formato de ID inválido' };
  }

  return { valid: true };
}

/**
 * PATCH /api/comunidades/messages/[id]
 * Edita uma mensagem existente
 */
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  const startTime = Date.now();

  try {
    // AWAIT params (Next.js 14+ requirement)
    const resolvedParams = await params;
    const messageId = resolvedParams.id;

    log('info', 'PATCH_START', { messageId });

    // Validar ID
    const validation = validateMessageId(messageId);
    if (!validation.valid) {
      log('warn', 'PATCH_INVALID_ID', { messageId, error: validation.error });
      return NextResponse.json(
        { error: validation.error, success: false },
        { status: 400 }
      );
    }

    // Verificar se Supabase está configurado
    if (!isSupabaseConfigured() || !supabase) {
      log('error', 'PATCH_DB_NOT_CONFIGURED', { messageId });
      return NextResponse.json(
        { error: 'Database not configured', success: false },
        { status: 503 }
      );
    }

    // Verificar autenticação
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      log('warn', 'PATCH_UNAUTHORIZED', { messageId });
      return NextResponse.json(
        { error: 'Não autenticado' },
        { status: 401 }
      );
    }

    const userId = session.user.id || session.user.email;
    const body = await request.json();
    const { content } = body;

    // Validar conteúdo
    if (!content || typeof content !== 'string') {
      log('warn', 'PATCH_INVALID_CONTENT', { messageId, userId });
      return NextResponse.json(
        { error: 'Conteúdo é obrigatório' },
        { status: 400 }
      );
    }

    const cleanContent = content.trim();
    if (cleanContent.length === 0 || cleanContent.length > 2000) {
      log('warn', 'PATCH_CONTENT_LENGTH', {
        messageId,
        userId,
        length: cleanContent.length
      });
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
      .maybeSingle();

    if (fetchError || !existingMessage) {
      log('warn', 'PATCH_MESSAGE_NOT_FOUND', {
        messageId,
        userId,
        error: fetchError?.message
      });
      return NextResponse.json(
        { error: 'Mensagem não encontrada' },
        { status: 404 }
      );
    }

    // Verificar se é o autor
    if (existingMessage.user_id !== userId) {
      log('warn', 'PATCH_FORBIDDEN', {
        messageId,
        userId,
        ownerId: existingMessage.user_id
      });
      return NextResponse.json(
        { error: 'Você só pode editar suas próprias mensagens' },
        { status: 403 }
      );
    }

    // Verificar se já foi deletada
    if (existingMessage.is_deleted) {
      log('warn', 'PATCH_ALREADY_DELETED', { messageId, userId });
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
      log('warn', 'PATCH_TIME_LIMIT_EXCEEDED', {
        messageId,
        userId,
        minutesSinceCreation: Math.floor(minutesSinceCreation)
      });
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
      log('warn', 'PATCH_NO_CHANGES', { messageId, userId });
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
      log('error', 'PATCH_UPDATE_FAILED', {
        messageId,
        userId,
        error: updateError.message
      });
      throw updateError;
    }

    const duration = Date.now() - startTime;
    log('info', 'PATCH_SUCCESS', { messageId, userId, duration });

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
    const duration = Date.now() - startTime;
    log('error', 'PATCH_EXCEPTION', {
      error: error.message,
      stack: error.stack,
      duration
    });

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
  const startTime = Date.now();

  try {
    // ✅ CRITICAL FIX: AWAIT params (Next.js 14+ requirement)
    const resolvedParams = await params;
    const messageId = resolvedParams.id;

    log('info', 'DELETE_START', { messageId });

    // ✅ CRITICAL FIX: Validar formato do ID
    const validation = validateMessageId(messageId);
    if (!validation.valid) {
      log('warn', 'DELETE_INVALID_ID', { messageId, error: validation.error });
      return NextResponse.json(
        { error: validation.error, success: false },
        { status: 400 }
      );
    }

    // Verificar se Supabase está configurado
    if (!isSupabaseConfigured() || !supabase) {
      log('error', 'DELETE_DB_NOT_CONFIGURED', { messageId });
      return NextResponse.json(
        { error: 'Database not configured', success: false },
        { status: 503 }
      );
    }

    // Verificar autenticação (defensivo)
    let session;
    try {
      session = await getServerSession(authOptions);
    } catch (authError: any) {
      log('error', 'DELETE_AUTH_ERROR', { messageId, error: authError.message });
      return NextResponse.json(
        { error: 'Erro de autenticação', details: authError.message },
        { status: 401 }
      );
    }

    if (!session?.user) {
      log('warn', 'DELETE_UNAUTHORIZED', { messageId });
      return NextResponse.json(
        { error: 'Não autenticado' },
        { status: 401 }
      );
    }

    const userId = session.user.id || session.user.email;
    log('info', 'DELETE_AUTHENTICATED', { messageId, userId });

    // Buscar mensagem existente (usar maybeSingle para não errar em "not found")
    log('info', 'DELETE_FETCHING_MESSAGE', { messageId });
    const { data: existingMessage, error: fetchError } = await supabase
      .from('nfc_chat_messages')
      .select('*')
      .eq('id', messageId)
      .maybeSingle();

    if (fetchError) {
      log('error', 'DELETE_FETCH_ERROR', {
        messageId,
        userId,
        error: fetchError.message,
        code: fetchError.code
      });

      return NextResponse.json(
        { error: 'Erro ao buscar mensagem', details: fetchError.message },
        { status: 500 }
      );
    }

    if (!existingMessage) {
      log('warn', 'DELETE_MESSAGE_NOT_FOUND', { messageId, userId });
      return NextResponse.json(
        { error: 'Mensagem não encontrada' },
        { status: 404 }
      );
    }

    log('info', 'DELETE_MESSAGE_FOUND', {
      messageId,
      userId,
      ownerId: existingMessage.user_id
    });

    // Verificar se é o autor
    if (existingMessage.user_id !== userId) {
      log('warn', 'DELETE_FORBIDDEN', {
        messageId,
        userId,
        ownerId: existingMessage.user_id
      });
      return NextResponse.json(
        { error: 'Você só pode excluir suas próprias mensagens' },
        { status: 403 }
      );
    }

    // Verificar se já foi deletada
    if (existingMessage.is_deleted) {
      log('warn', 'DELETE_ALREADY_DELETED', { messageId, userId });
      return NextResponse.json(
        { error: 'Mensagem já foi excluída' },
        { status: 400 }
      );
    }

    // ==========================================
    // ✅ FIX: Melhor tratamento de FP
    // ==========================================

    let fpToRemove = 0;
    let fpOperationSuccess = true;

    try {
      log('info', 'DELETE_FP_START', { messageId, userId });

      // Buscar transações de FP relacionadas a esta mensagem
      const { data: fpTransactions, error: fpQueryError } = await supabase
        .from('nfc_chat_fp_transactions')
        .select('*')
        .eq('user_id', userId)
        .eq('type', 'earn')
        .gte('created_at', existingMessage.created_at);

      if (fpQueryError) {
        log('error', 'DELETE_FP_QUERY_ERROR', {
          messageId,
          userId,
          error: fpQueryError.message
        });
        fpOperationSuccess = false;
      } else {
        log('info', 'DELETE_FP_TRANSACTIONS_FOUND', {
          messageId,
          userId,
          totalTransactions: fpTransactions?.length || 0
        });

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

          log('info', 'DELETE_FP_CALCULATED', {
            messageId,
            userId,
            validTransactions: validTransactions.length,
            fpToRemove
          });

          if (validTransactions.length > 0 && fpToRemove > 0) {
            // Buscar saldo atual do usuário
            const { data: userFP, error: userFPError } = await supabase
              .from('nfc_chat_user_fp')
              .select('*')
              .eq('user_id', userId)
              .single();

            if (userFPError) {
              log('error', 'DELETE_FP_USER_FETCH_ERROR', {
                messageId,
                userId,
                error: userFPError.message
              });
              fpOperationSuccess = false;
            } else if (userFP) {
              const newBalance = Math.max(0, userFP.balance - fpToRemove);
              const newTotalEarned = Math.max(0, userFP.total_earned - fpToRemove);

              log('info', 'DELETE_FP_UPDATING_BALANCE', {
                messageId,
                userId,
                oldBalance: userFP.balance,
                newBalance,
                fpToRemove
              });

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
                log('error', 'DELETE_FP_UPDATE_ERROR', {
                  messageId,
                  userId,
                  error: updateError.message
                });
                fpOperationSuccess = false;
              } else {
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
                  log('error', 'DELETE_FP_INSERT_ERROR', {
                    messageId,
                    userId,
                    error: insertError.message
                  });
                  fpOperationSuccess = false;
                } else {
                  log('info', 'DELETE_FP_SUCCESS', {
                    messageId,
                    userId,
                    fpToRemove,
                    newBalance
                  });
                }
              }
            }
          } else {
            log('info', 'DELETE_FP_NONE_TO_REMOVE', { messageId, userId });
          }
        } else {
          log('info', 'DELETE_FP_NO_TRANSACTIONS', { messageId, userId });
        }
      }
    } catch (fpError: any) {
      log('error', 'DELETE_FP_EXCEPTION', {
        messageId,
        userId,
        error: fpError.message,
        stack: fpError.stack
      });
      fpOperationSuccess = false;
    }

    // ✅ FIX: Soft delete sempre acontece, mesmo se FP falhar
    log('info', 'DELETE_SOFT_DELETE_START', { messageId, userId });
    const { error: deleteError } = await supabase
      .from('nfc_chat_messages')
      .update({
        is_deleted: true,
        deleted_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', messageId);

    if (deleteError) {
      log('error', 'DELETE_SOFT_DELETE_ERROR', {
        messageId,
        userId,
        error: deleteError.message,
        code: deleteError.code
      });
      throw deleteError;
    }

    const duration = Date.now() - startTime;
    log('info', 'DELETE_SUCCESS', {
      messageId,
      userId,
      fpToRemove,
      fpOperationSuccess,
      duration
    });

    return NextResponse.json({
      success: true,
      messageId,
      fpRemoved: fpToRemove,
      fpOperationSuccess,
      message: fpToRemove > 0
        ? `Mensagem deletada. ${fpToRemove} FP foi removido do seu saldo.`
        : 'Mensagem deletada.',
    });
  } catch (error: any) {
    const duration = Date.now() - startTime;
    log('error', 'DELETE_EXCEPTION', {
      error: error.message,
      stack: error.stack,
      code: error.code,
      duration
    });

    return NextResponse.json(
      {
        error: 'Erro ao excluir mensagem',
        details: error.message,
        code: error.code
      },
      { status: 500 }
    );
  }
}
