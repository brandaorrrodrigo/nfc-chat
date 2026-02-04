/**
 * Video Gating - Verifica permissao para upload de video
 *
 * Fluxo:
 * 1. Check assinatura App -> bypass FP (gratis)
 * 2. Check saldo FP >= 25 -> custo FP
 * 3. Saldo insuficiente -> bloqueia + upsell
 */

import { getSupabase, isSupabaseConfigured } from '@/lib/supabase';
import { NFV_CONFIG } from './nfv-config';

export interface GatingResult {
  allowed: boolean;
  reason: 'subscription' | 'fp_sufficient' | 'fp_insufficient' | 'not_authenticated';
  fpCost: number;
  fpBalance: number;
  hasSubscription: boolean;
}

/**
 * Verifica se usuario pode fazer upload de video
 * @param sessionPremium - flag is_premium vinda da sessão NextAuth (opcional)
 */
export async function checkVideoUploadPermission(
  userId: string | null,
  arenaSlug: string,
  sessionPremium?: boolean
): Promise<GatingResult> {
  if (!userId) {
    return {
      allowed: false,
      reason: 'not_authenticated',
      fpCost: NFV_CONFIG.FP_VIDEO_UPLOAD_COST,
      fpBalance: 0,
      hasSubscription: false,
    };
  }

  // Check assinatura: sessão NextAuth OU metadados do banco
  const hasSubscription = sessionPremium === true || await checkAppSubscription(userId);
  if (hasSubscription) {
    return {
      allowed: true,
      reason: 'subscription',
      fpCost: 0,
      fpBalance: await getUserFPBalance(userId),
      hasSubscription: true,
    };
  }

  // Check saldo FP
  const fpBalance = await getUserFPBalance(userId);
  const fpCost = NFV_CONFIG.FP_VIDEO_UPLOAD_COST;

  if (fpBalance >= fpCost) {
    return {
      allowed: true,
      reason: 'fp_sufficient',
      fpCost,
      fpBalance,
      hasSubscription: false,
    };
  }

  return {
    allowed: false,
    reason: 'fp_insufficient',
    fpCost,
    fpBalance,
    hasSubscription: false,
  };
}

/**
 * Verifica assinatura do app (via Supabase)
 */
async function checkAppSubscription(userId: string): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;

  try {
    const supabase = getSupabase();
    const { data } = await supabase
      .from('nfc_chat_user_fp')
      .select('metadata')
      .eq('user_id', userId)
      .single();

    // Verifica se tem flag de assinatura ativa nos metadados
    if (data?.metadata && typeof data.metadata === 'object') {
      const meta = data.metadata as Record<string, unknown>;
      return meta.app_subscription === true;
    }

    return false;
  } catch {
    return false;
  }
}

/**
 * Retorna saldo FP do usuario
 */
async function getUserFPBalance(userId: string): Promise<number> {
  if (!isSupabaseConfigured()) return 0;

  try {
    const supabase = getSupabase();
    const { data } = await supabase
      .from('nfc_chat_user_fp')
      .select('balance')
      .eq('user_id', userId)
      .single();

    return data?.balance || 0;
  } catch {
    return 0;
  }
}
