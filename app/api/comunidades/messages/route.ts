/**
 * API: Mensagens das Comunidades
 *
 * GET - Busca mensagens de uma comunidade
 * POST - Cria nova mensagem
 *
 * Persistência real no Supabase
 */

export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-config';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

// Interface da mensagem no banco
interface DBMessage {
  id: string;
  comunidade_slug: string;
  user_id: string;
  user_name: string;
  user_avatar: string | null;
  content: string;
  created_at: string;
  parent_id: string | null;
  // Campos de edição/exclusão
  is_edited?: boolean;
  edited_at?: string | null;
  is_deleted?: boolean;
  deleted_at?: string | null;
}

/**
 * GET /api/comunidades/messages?slug=xxx
 * Busca todas as mensagens de uma comunidade
 */
export async function GET(request: NextRequest) {
  try {
    // Verificar se Supabase está configurado
    if (!isSupabaseConfigured() || !supabase) {
      return NextResponse.json(
        { mensagens: [], warning: 'Database not configured' },
        { status: 200 }
      );
    }

    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');

    if (!slug) {
      return NextResponse.json(
        { error: 'Slug da comunidade é obrigatório' },
        { status: 400 }
      );
    }

    // Buscar mensagens do Supabase (excluir deletadas)
    const { data, error } = await supabase
      .from('nfc_chat_messages')
      .select('*')
      .eq('comunidade_slug', slug)
      .or('is_deleted.is.null,is_deleted.eq.false') // Filtrar mensagens não deletadas
      .order('created_at', { ascending: true })
      .limit(500);

    if (error) {
      console.error('Erro Supabase:', error);

      // Se a tabela não existe, retorna array vazio
      if (error.code === '42P01' || error.message?.includes('does not exist')) {
        return NextResponse.json({ mensagens: [], needsSetup: true });
      }

      throw error;
    }

    // Transformar para o formato esperado pelo frontend
    const mensagens = (data || []).map((row: DBMessage) => ({
      id: row.id,
      conteudo: row.content,
      autor: {
        id: row.user_id,
        nome: row.user_name,
        avatar: row.user_avatar || '/avatars/default.png',
        isIA: false,
      },
      timestamp: new Date(row.created_at).toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
      }),
      // Campos para edição
      createdAt: row.created_at,
      isEdited: row.is_edited || false,
      editedAt: row.edited_at || null,
      respostas: [],
      reacoes: [],
    }));

    return NextResponse.json({ mensagens });
  } catch (error: any) {
    console.error('Erro ao buscar mensagens:', error);

    return NextResponse.json(
      { error: 'Erro ao buscar mensagens', details: error.message },
      { status: 500 }
    );
  }
}

/**
 * POST /api/comunidades/messages
 * Cria nova mensagem
 */
export async function POST(request: NextRequest) {
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

    const body = await request.json();
    const { slug, content, parentId } = body;

    if (!slug || !content) {
      return NextResponse.json(
        { error: 'Slug e conteúdo são obrigatórios' },
        { status: 400 }
      );
    }

    // Limpar conteúdo
    const cleanContent = content.trim();
    if (cleanContent.length === 0 || cleanContent.length > 2000) {
      return NextResponse.json(
        { error: 'Conteúdo deve ter entre 1 e 2000 caracteres' },
        { status: 400 }
      );
    }

    // Gerar ID único
    const messageId = `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Inserir no Supabase
    const { data, error } = await supabase
      .from('nfc_chat_messages')
      .insert({
        id: messageId,
        comunidade_slug: slug,
        user_id: session.user.id || session.user.email,
        user_name: session.user.name || 'Usuário',
        user_avatar: session.user.image || null,
        content: cleanContent,
        parent_id: parentId || null,
      })
      .select()
      .single();

    if (error) {
      console.error('Erro Supabase ao inserir:', error);

      // Se a tabela não existe, dar instrução
      if (error.code === '42P01' || error.message?.includes('does not exist')) {
        return NextResponse.json(
          {
            error: 'Tabela não existe. Execute o SQL de setup no Supabase.',
            setupSQL: SETUP_SQL,
          },
          { status: 500 }
        );
      }

      throw error;
    }

    // Retornar no formato esperado pelo frontend
    const mensagem = {
      id: data.id,
      conteudo: data.content,
      autor: {
        id: data.user_id,
        nome: data.user_name,
        avatar: data.user_avatar || '/avatars/default.png',
        isIA: false,
      },
      timestamp: new Date(data.created_at).toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
      }),
      // Campos para edição
      createdAt: data.created_at,
      isEdited: false,
      editedAt: null,
      respostas: [],
      reacoes: [],
    };

    return NextResponse.json({ mensagem, success: true });
  } catch (error: any) {
    console.error('Erro ao criar mensagem:', error);

    return NextResponse.json(
      { error: 'Erro ao criar mensagem', details: error.message },
      { status: 500 }
    );
  }
}

// SQL para criar a tabela (para referência)
const SETUP_SQL = `
-- Execute no Supabase SQL Editor:

-- Tabela de mensagens das comunidades (prefixo nfc_chat_)
CREATE TABLE IF NOT EXISTS nfc_chat_messages (
  id TEXT PRIMARY KEY,
  comunidade_slug TEXT NOT NULL,
  user_id TEXT NOT NULL,
  user_name TEXT NOT NULL,
  user_avatar TEXT,
  content TEXT NOT NULL,
  parent_id TEXT REFERENCES nfc_chat_messages(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  -- Campos de edição
  is_edited BOOLEAN DEFAULT FALSE,
  edited_at TIMESTAMPTZ,
  original_content TEXT,
  -- Campos de exclusão (soft delete)
  is_deleted BOOLEAN DEFAULT FALSE,
  deleted_at TIMESTAMPTZ
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_nfc_chat_messages_slug ON nfc_chat_messages(comunidade_slug);
CREATE INDEX IF NOT EXISTS idx_nfc_chat_messages_user ON nfc_chat_messages(user_id);
CREATE INDEX IF NOT EXISTS idx_nfc_chat_messages_created ON nfc_chat_messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_nfc_chat_messages_deleted ON nfc_chat_messages(is_deleted) WHERE is_deleted = FALSE;

-- Habilitar RLS
ALTER TABLE nfc_chat_messages ENABLE ROW LEVEL SECURITY;

-- Policy: leitura pública
CREATE POLICY "Leitura publica" ON nfc_chat_messages FOR SELECT USING (true);

-- Policy: inserção para todos (a API valida autenticação)
CREATE POLICY "Insercao permitida" ON nfc_chat_messages FOR INSERT WITH CHECK (true);

-- Policy: atualização para todos (a API valida autenticação)
CREATE POLICY "Update permitido" ON nfc_chat_messages FOR UPDATE USING (true);
`;
