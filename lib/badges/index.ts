/**
 * Badge System - Exports
 */

export {
  ALL_BADGES,
  STREAK_BADGES,
  MESSAGE_BADGES,
  ENGAGEMENT_BADGES,
  NUTRITION_BADGES,
  FITNESS_BADGES,
  SPECIAL_BADGES,
  getBadgeById,
  getBadgesByCategory,
  getBadgesByRarity,
} from './badge-definitions';

export type {
  BadgeCategory,
  BadgeRarity,
  BadgeDefinition,
} from './badge-definitions';

export {
  getUserBadges,
  saveBadgeUnlock,
  getUserStatsForBadges,
  checkAndUnlockBadges,
  getBadgesWithStatus,
} from './badge-checker';

export type {
  UserBadge,
  UserStats,
  BadgeCheckResult,
} from './badge-checker';
