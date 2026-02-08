/**
 * API endpoint para listar vídeos analisados
 * GET /api/biomechanics/list-videos
 */

import { NextRequest, NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase';

// Mark this route as dynamic to prevent build-time compilation
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const supabase = getSupabase();
    const searchParams = request.nextUrl.searchParams;
    const community = searchParams.get('community');

    let query = supabase
      .from('nfc_chat_video_analyses')
      .select('id, user_name, movement_pattern, created_at, status, ai_analysis, arena_slug')
      .order('created_at', { ascending: false });

    // Filter by community/arena if provided
    if (community) {
      query = query.eq('arena_slug', community);
    }

    const { data, error } = await query.limit(100);

    if (error) {
      throw new Error(error.message);
    }

    // Format videos for frontend
    const videos = (data || []).map((video: any) => {
      let overall_score: number | undefined;

      if (video.ai_analysis) {
        try {
          const analysis = typeof video.ai_analysis === 'string'
            ? JSON.parse(video.ai_analysis)
            : video.ai_analysis;
          overall_score = analysis.overall_score || analysis.score;
        } catch (e) {
          // If parsing fails, score remains undefined
        }
      }

      return {
        id: video.id,
        user_name: video.user_name,
        movement_pattern: video.movement_pattern,
        created_at: video.created_at,
        status: video.status,
        overall_score,
        exercise_type: video.movement_pattern,
      };
    });

    return NextResponse.json({
      success: true,
      videos,
      total: videos.length,
    });

  } catch (error: any) {
    console.error('Error fetching videos:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to fetch videos',
      },
      { status: 500 }
    );
  }
}
