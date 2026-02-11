/**
 * Video Analysis Service - CRUD e gerenciamento da fila de analises
 */

import { getSupabase, isSupabaseConfigured } from '@/lib/supabase';

const TABLE = 'nfc_chat_video_analyses';
const VOTES_TABLE = 'nfc_chat_video_votes';

export interface VideoAnalysis {
  id: string;
  arena_slug: string;
  user_id: string;
  user_name: string;
  video_url: string;
  video_path: string;
  thumbnail_url?: string;
  duration_seconds?: number;
  movement_pattern: string;
  user_description?: string;
  fp_cost: number;
  paid_with_subscription: boolean;
  status: string;
  ai_analysis?: Record<string, unknown>;
  ai_analyzed_at?: string;
  admin_reviewer_id?: string;
  admin_notes?: string;
  admin_edited_analysis?: Record<string, unknown>;
  reviewed_at?: string;
  published_analysis?: Record<string, unknown>;
  published_at?: string;
  rejection_reason?: string;
  view_count: number;
  helpful_votes: number;
  created_at: string;
  updated_at: string;
}

export interface AnalysisListOptions {
  arenaSlug?: string;
  status?: string;
  userId?: string;
  pattern?: string;
  limit?: number;
  offset?: number;
}

/**
 * Buscar analises com filtros
 */
export async function listAnalyses(options: AnalysisListOptions): Promise<{ data: VideoAnalysis[]; error?: string }> {
  if (!isSupabaseConfigured()) return { data: [], error: 'Database not configured' };

  const { arenaSlug, status, userId, pattern, limit = 20, offset = 0 } = options;
  const supabase = getSupabase();

  let query = supabase
    .from(TABLE)
    .select('*')
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (arenaSlug) query = query.eq('arena_slug', arenaSlug);
  if (status) query = query.eq('status', status);
  if (userId) query = query.eq('user_id', userId);
  if (pattern) query = query.eq('movement_pattern', pattern);

  const { data, error } = await query;

  if (error) {
    console.error('[NFV] listAnalyses error:', error);
    return { data: [], error: error.message };
  }

  return { data: data || [] };
}

/**
 * Buscar uma analise por ID
 */
export async function getAnalysis(id: string): Promise<{ data: VideoAnalysis | null; error?: string }> {
  if (!isSupabaseConfigured()) return { data: null, error: 'Database not configured' };

  const supabase = getSupabase();
  const { data, error } = await supabase
    .from(TABLE)
    .select('*')
    .eq('id', id)
    .single();

  if (error) return { data: null, error: error.message };
  return { data };
}

/**
 * Contar analises pendentes de revisao
 */
export async function countPendingReview(): Promise<number> {
  if (!isSupabaseConfigured()) return 0;

  const supabase = getSupabase();
  const { data } = await supabase
    .from(TABLE)
    .select('id', { count: 'exact' })
    .in('status', ['AI_ANALYZED', 'PENDING_REVIEW']);

  return data?.length || 0;
}

/**
 * Aprovar analise
 */
export async function approveAnalysis(
  id: string,
  reviewerId: string,
  publishedAnalysis: Record<string, unknown>,
  adminNotes?: string,
): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseConfigured()) return { success: false, error: 'Database not configured' };

  const supabase = getSupabase();
  const now = new Date().toISOString();

  const { error } = await supabase
    .from(TABLE)
    .update({
      status: 'APPROVED',
      admin_reviewer_id: reviewerId,
      admin_notes: adminNotes || null,
      admin_edited_analysis: publishedAnalysis,
      reviewed_at: now,
      published_analysis: publishedAnalysis,
      published_at: now,
    })
    .eq('id', id);

  if (error) {
    console.error('[NFV] approveAnalysis error:', error);
    return { success: false, error: error.message };
  }

  return { success: true };
}

/**
 * Rejeitar analise
 */
export async function rejectAnalysis(
  id: string,
  reviewerId: string,
  reason: string,
): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseConfigured()) return { success: false, error: 'Database not configured' };

  const supabase = getSupabase();

  const { error } = await supabase
    .from(TABLE)
    .update({
      status: 'REJECTED',
      admin_reviewer_id: reviewerId,
      rejection_reason: reason,
      reviewed_at: new Date().toISOString(),
    })
    .eq('id', id);

  if (error) {
    console.error('[NFV] rejectAnalysis error:', error);
    return { success: false, error: error.message };
  }

  return { success: true };
}

/**
 * Solicitar revisao (devolver para ajuste)
 */
export async function requestRevision(
  id: string,
  reviewerId: string,
  notes: string,
): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseConfigured()) return { success: false, error: 'Database not configured' };

  const supabase = getSupabase();

  const { error } = await supabase
    .from(TABLE)
    .update({
      status: 'REVISION_NEEDED',
      admin_reviewer_id: reviewerId,
      admin_notes: notes,
      reviewed_at: new Date().toISOString(),
    })
    .eq('id', id);

  if (error) {
    console.error('[NFV] requestRevision error:', error);
    return { success: false, error: error.message };
  }

  return { success: true };
}

/**
 * Registrar voto de utilidade
 */
export async function voteAnalysis(
  analysisId: string,
  userId: string,
  voteType: 'helpful' | 'not_helpful',
): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseConfigured()) return { success: false, error: 'Database not configured' };

  const supabase = getSupabase();

  // Upsert voto
  const { error: voteError } = await supabase
    .from(VOTES_TABLE)
    .upsert({
      analysis_id: analysisId,
      user_id: userId,
      vote_type: voteType,
    }, {
      onConflict: 'analysis_id,user_id',
    });

  if (voteError) {
    console.error('[NFV] voteAnalysis error:', voteError);
    return { success: false, error: voteError.message };
  }

  // Recalcular helpful_votes
  const { data: helpfulCount } = await supabase
    .from(VOTES_TABLE)
    .select('id', { count: 'exact' })
    .eq('analysis_id', analysisId)
    .eq('vote_type', 'helpful');

  await supabase
    .from(TABLE)
    .update({ helpful_votes: helpfulCount?.length || 0 })
    .eq('id', analysisId);

  return { success: true };
}

/**
 * Buscar voto do usuario para uma analise
 */
export async function getUserVote(
  analysisId: string,
  userId: string,
): Promise<string | null> {
  if (!isSupabaseConfigured()) return null;

  const supabase = getSupabase();
  const { data } = await supabase
    .from(VOTES_TABLE)
    .select('vote_type')
    .eq('analysis_id', analysisId)
    .eq('user_id', userId)
    .single();

  return data?.vote_type || null;
}
