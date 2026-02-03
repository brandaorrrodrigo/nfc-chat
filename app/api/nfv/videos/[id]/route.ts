/**
 * API Route: NFV Video Individual
 * GET - Buscar video por ID
 * PATCH - Atualizar video
 * DELETE - Remover video
 */

import { NextRequest, NextResponse } from 'next/server';
import { getSupabase, isSupabaseConfigured } from '@/lib/supabase';

const TABLE = 'nfc_chat_video_analyses';

// GET - Buscar video por ID
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!isSupabaseConfigured()) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
    }

    const { id } = await params;
    const supabase = getSupabase();

    const { data, error } = await supabase
      .from(TABLE)
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      return NextResponse.json({ error: 'Video nao encontrado' }, { status: 404 });
    }

    // Incrementar view count
    await supabase
      .from(TABLE)
      .update({ view_count: (data.view_count || 0) + 1 })
      .eq('id', id);

    return NextResponse.json({ analysis: data });
  } catch (error) {
    console.error('[NFV] GET by ID error:', error);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}

// PATCH - Atualizar video
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!isSupabaseConfigured()) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
    }

    const { id } = await params;
    const body = await req.json();
    const supabase = getSupabase();

    // Campos permitidos para update
    const allowedFields = [
      'user_description', 'status', 'ai_analysis', 'ai_analyzed_at',
      'ai_confidence', 'admin_reviewer_id', 'admin_notes',
      'admin_edited_analysis', 'reviewed_at', 'published_analysis',
      'published_at', 'rejection_reason',
    ];

    const updateData: Record<string, unknown> = {};
    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updateData[field] = body[field];
      }
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: 'Nenhum campo para atualizar' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from(TABLE)
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('[NFV] PATCH error:', error);
      return NextResponse.json({ error: 'Erro ao atualizar' }, { status: 500 });
    }

    return NextResponse.json({ success: true, analysis: data });
  } catch (error) {
    console.error('[NFV] PATCH error:', error);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}

// DELETE - Remover video
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!isSupabaseConfigured()) {
      return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
    }

    const { id } = await params;
    const supabase = getSupabase();

    // Buscar dados para remover do storage
    const { data: analysis } = await supabase
      .from(TABLE)
      .select('video_path, user_id')
      .eq('id', id)
      .single();

    if (!analysis) {
      return NextResponse.json({ error: 'Video nao encontrado' }, { status: 404 });
    }

    // Remover do storage
    if (analysis.video_path) {
      await supabase.storage
        .from('nfc-videos')
        .remove([analysis.video_path]);
    }

    // Remover registro
    const { error } = await supabase
      .from(TABLE)
      .delete()
      .eq('id', id);

    if (error) {
      console.error('[NFV] DELETE error:', error);
      return NextResponse.json({ error: 'Erro ao remover' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[NFV] DELETE error:', error);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}
