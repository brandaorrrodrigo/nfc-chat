-- =============================================
-- INSERT DAS 15 ARENAS FALTANTES
-- Executar no Supabase Studio > SQL Editor
-- =============================================

INSERT INTO "Arena" (id, slug, name, description, icon, color, category, categoria, "aiPersona", "aiInterventionRate", "aiFrustrationThreshold", "aiCooldown", "totalPosts", status, "isActive", "isPaused", "allowImages", "allowLinks", "allowVideos", "arenaType", "criadaPor", "requiresSubscription", "totalComments", "dailyActiveUsers", "createdAt", "updatedAt")
VALUES
('arena_receitas_saudaveis', 'receitas-saudaveis', 'Receitas Saudáveis', 'Compartilhe receitas fit e receba análise nutricional automática da IA: calorias, proteínas, carboidratos e gorduras por porção.', 'Utensils', '#10b981', 'nutrition', 'RECEITAS_ALIMENTACAO', 'BALANCED', 50, 120, 5, 127, 'WARM', true, false, true, true, false, 'GENERAL', 'ADMIN', false, 0, 12, NOW(), NOW()),

('arena_dieta_vida_real', 'dieta-vida-real', 'Dieta na Vida Real', 'Espaço para falar da dificuldade real de seguir dietas, mesmo quando elas são bem elaboradas.', 'Utensils', '#84cc16', 'nutrition', 'NUTRICAO_DIETAS', 'MOTIVATIONAL', 50, 120, 5, 4521, 'HOT', true, false, true, true, false, 'GENERAL', 'ADMIN', false, 0, 187, NOW(), NOW()),

('arena_deficit_calorico', 'deficit-calorico', 'Déficit Calórico na Vida Real', 'Nem sempre o déficit funciona como nos cálculos. Aqui falamos do que acontece na prática, no corpo e na rotina.', 'TrendingDown', '#f97316', 'nutrition', 'NUTRICAO_DIETAS', 'SCIENTIFIC', 50, 120, 5, 2341, 'HOT', true, false, true, true, false, 'GENERAL', 'ADMIN', false, 0, 89, NOW(), NOW()),

('arena_exercicios_que_ama', 'exercicios-que-ama', 'Exercícios que Ama', 'Compartilhe exercícios que você AMA fazer e receba análise biomecânica da IA: músculos ativados, padrão de movimento e variações.', 'Dumbbell', '#6366f1', 'fitness', 'TREINO_EXERCICIOS', 'SCIENTIFIC', 60, 90, 5, 184, 'WARM', true, false, true, true, false, 'GENERAL', 'ADMIN', false, 0, 18, NOW(), NOW()),

('arena_treino_gluteo', 'treino-gluteo', 'Treino de Glúteo', 'Treino de glúteo com foco em resultado: genética, dor, carga, repetição, constância e evolução real.', 'Dumbbell', '#ec4899', 'fitness', 'TREINO_EXERCICIOS', 'SCIENTIFIC', 60, 90, 5, 3156, 'HOT', true, false, true, true, false, 'GENERAL', 'ADMIN', false, 0, 124, NOW(), NOW()),

('arena_odeia_treinar', 'odeia-treinar', 'Exercício para Quem Odeia Treinar', 'Para quem quer resultado, mas não se identifica com academia tradicional.', 'Heart', '#f43f5e', 'fitness', 'TREINO_EXERCICIOS', 'MOTIVATIONAL', 60, 90, 5, 1432, 'WARM', true, false, true, true, false, 'GENERAL', 'ADMIN', false, 0, 56, NOW(), NOW()),

('arena_treino_casa', 'treino-casa', 'Treino em Casa', 'Exercícios livres e com poucos acessórios. Baseado na metodologia Bret: ~100%% dos exercícios podem ser feitos em casa.', 'Home', '#8b5cf6', 'fitness', 'TREINO_EXERCICIOS', 'BALANCED', 50, 120, 5, 2156, 'WARM', true, false, true, true, false, 'GENERAL', 'ADMIN', false, 0, 78, NOW(), NOW()),

('arena_performance_biohacking', 'performance-biohacking', 'Performance & Biohacking', 'Protocolos de elite, farmacologia avançada e estratégias de redução de danos. Ciência aplicada sem filtro.', 'Zap', '#7c3aed', 'fitness', 'TREINO_EXERCICIOS', 'SCIENTIFIC', 40, 120, 10, 892, 'HOT', true, false, true, true, false, 'GENERAL', 'ADMIN', false, 0, 34, NOW(), NOW()),

('arena_lipedema_paradoxo', 'lipedema-paradoxo', 'Lipedema — Paradoxo do Cardio', 'Por que HIIT pode piorar o lipedema? Discussão técnica sobre HIF-1α, NF-κB, macrófagos M1 e o protocolo AEJ + compressão.', 'Activity', '#06b6d4', 'health', 'SAUDE_CONDICOES_CLINICAS', 'SCIENTIFIC', 40, 120, 10, 634, 'HOT', true, false, true, true, false, 'GENERAL', 'ADMIN', false, 0, 28, NOW(), NOW()),

('arena_protocolo_lipedema', 'lipedema', 'Protocolo Lipedema', 'Espaço para mulheres que convivem com lipedema compartilharem sintomas, estratégias, frustrações e avanços reais no dia a dia.', 'Activity', '#0ea5e9', 'health', 'SAUDE_CONDICOES_CLINICAS', 'MOTIVATIONAL', 50, 120, 5, 1247, 'WARM', true, false, true, true, false, 'GENERAL', 'ADMIN', false, 0, 47, NOW(), NOW()),

('arena_canetas', 'canetas', 'Canetas Emagrecedoras', 'Relatos reais sobre uso de Ozempic, Wegovy, Mounjaro: efeitos colaterais, expectativas e adaptações no estilo de vida.', 'Syringe', '#14b8a6', 'health', 'SAUDE_CONDICOES_CLINICAS', 'SCIENTIFIC', 50, 120, 5, 1856, 'WARM', true, false, true, true, false, 'GENERAL', 'ADMIN', false, 0, 73, NOW(), NOW()),

('arena_ansiedade_alimentacao', 'ansiedade-alimentacao', 'Ansiedade, Compulsão e Alimentação', 'Discussões abertas sobre relação emocional com a comida, sem julgamento.', 'Brain', '#a855f7', 'health', 'SAUDE_CONDICOES_CLINICAS', 'MOTIVATIONAL', 60, 90, 5, 2087, 'HOT', true, false, true, true, false, 'GENERAL', 'ADMIN', false, 0, 91, NOW(), NOW()),

('arena_emagrecimento_35', 'emagrecimento-35-mais', 'Emagrecimento Feminino 35+', 'Mudanças hormonais, metabolismo e a realidade do corpo após os 30-40 anos.', 'Sparkles', '#f59e0b', 'health', 'SAUDE_CONDICOES_CLINICAS', 'BALANCED', 50, 120, 5, 1678, 'WARM', true, false, true, true, false, 'GENERAL', 'ADMIN', false, 0, 62, NOW(), NOW()),

('arena_antes_depois', 'antes-depois', 'Antes e Depois — Processo Real', 'Mais do que fotos, histórias. O foco é o processo, não só o resultado.', 'Camera', '#06b6d4', 'community', 'COMUNIDADES_LIVRES', 'MOTIVATIONAL', 30, 120, 10, 2934, 'HOT', true, false, true, true, false, 'GENERAL', 'ADMIN', false, 0, 108, NOW(), NOW()),

('arena_aspiracional_estetica', 'aspiracional-estetica', 'Aspiracional & Estética', 'Sonhos estéticos com base científica e responsabilidade. IA educadora sobre procedimentos com preparo físico, nutricional e psicológico.', 'Sparkles', '#d946ef', 'lifestyle', 'COMUNIDADES_LIVRES', 'SCIENTIFIC', 60, 90, 5, 156, 'WARM', true, false, true, true, false, 'GENERAL', 'ADMIN', false, 0, 14, NOW(), NOW())

ON CONFLICT (slug) DO NOTHING;

-- VERIFICAR TOTAL
SELECT COUNT(*) as total_arenas FROM "Arena" WHERE "isActive" = true;
