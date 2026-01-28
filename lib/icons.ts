/**
 * Barrel export for lucide-react icons
 *
 * BENEFÍCIOS:
 * - Melhor tree-shaking (imports centralizados)
 * - Redução de bundle size (~5-8KB)
 * - Facilita manutenção e auditoria de ícones usados
 *
 * USO:
 * import { MessageSquare, Send } from '@/lib/icons';
 */

// Re-export all icons used in the project
export {
  // Navigation & Actions
  ArrowLeft,
  ArrowRight,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  Home,
  Menu,
  Plus,
  RefreshCw,
  Search,
  Send,
  X,

  // User & Auth
  LogIn,
  LogOut,
  User,
  UserPlus,
  Users,
  Shield,
  Crown,
  Rocket,
  Settings,

  // Communication
  Bell,
  BellRing,
  MessageSquare,
  PenSquare,
  Quote,
  Megaphone,

  // Content & Media
  Bookmark,
  BookmarkCheck,
  BookOpen,
  Camera,
  FileText,
  Image,
  ImagePlus,

  // Status & Feedback
  Activity,
  AlertTriangle,
  Bot,
  Check,
  CheckCircle,
  Clock,
  Eye,
  EyeOff,
  Flame,
  HelpCircle,
  Loader2,
  Smile,
  Sparkles,
  Star,
  TrendingDown,
  TrendingUp,
  Wifi,
  WifiOff,
  Zap,

  // Health & Fitness (domain-specific)
  Brain,
  ChefHat,
  Dumbbell,
  Heart,
  Smartphone,
  Syringe,
  Utensils,

  // Admin & System
  Bug,
  Globe,
  Lock,
  Mail,
  Trash2,
} from 'lucide-react';

// Re-export types
export type { LucideIcon } from 'lucide-react';
