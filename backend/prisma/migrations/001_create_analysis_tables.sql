-- ═══════════════════════════════════════════════════════════
-- NutriFitCoach - Schema de Análise Biomecânica
-- Migration: 001_create_analysis_tables
-- ═══════════════════════════════════════════════════════════

-- USUÁRIOS
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255),
    subscription_tier VARCHAR(50) DEFAULT 'free',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_subscription ON users(subscription_tier);

-- PERFIS DE USUÁRIO
CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    height_cm FLOAT,
    weight_kg FLOAT,
    age INTEGER,
    gender VARCHAR(20),
    injury_history JSONB,
    training_age_years FLOAT,
    training_level VARCHAR(50),
    goals JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ANÁLISES DE VÍDEO
CREATE TABLE IF NOT EXISTS video_analyses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    video_path VARCHAR(500) NOT NULL,
    video_url VARCHAR(500),
    video_duration INTEGER,
    exercise_id VARCHAR(100) NOT NULL,
    exercise_name VARCHAR(255),
    analysis_tier VARCHAR(20),
    processing_time_ms INTEGER,
    cache_hit BOOLEAN DEFAULT FALSE,
    status VARCHAR(50) DEFAULT 'pending',
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX IF NOT EXISTS idx_video_analyses_user ON video_analyses(user_id);
CREATE INDEX IF NOT EXISTS idx_video_analyses_exercise ON video_analyses(exercise_id);
CREATE INDEX IF NOT EXISTS idx_video_analyses_status ON video_analyses(status);
CREATE INDEX IF NOT EXISTS idx_video_analyses_created ON video_analyses(created_at);

-- QUICK ANALYSIS RESULTS
CREATE TABLE IF NOT EXISTS quick_analysis_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    video_analysis_id UUID UNIQUE NOT NULL REFERENCES video_analyses(id) ON DELETE CASCADE,
    overall_score FLOAT NOT NULL,
    classification VARCHAR(50) NOT NULL,
    similarity_to_gold FLOAT NOT NULL,
    frames_data JSONB NOT NULL,
    deviations_detected JSONB NOT NULL,
    processing_time_ms INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_quick_score ON quick_analysis_results(overall_score);
CREATE INDEX IF NOT EXISTS idx_quick_classification ON quick_analysis_results(classification);

-- DEEP ANALYSIS RESULTS
CREATE TABLE IF NOT EXISTS deep_analysis_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    video_analysis_id UUID UNIQUE NOT NULL REFERENCES video_analyses(id) ON DELETE CASCADE,
    scientific_context JSONB NOT NULL,
    rag_sources_used JSONB NOT NULL,
    llm_narrative TEXT NOT NULL,
    llm_model_used VARCHAR(100) NOT NULL,
    llm_tokens_used INTEGER,
    personalized_cues JSONB,
    risk_assessment JSONB,
    action_plan JSONB,
    processing_time_ms INTEGER NOT NULL,
    rag_retrieval_time INTEGER,
    llm_generation_time INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- CORRECTIVE PROTOCOLS
CREATE TABLE IF NOT EXISTS corrective_protocols (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    video_analysis_id UUID NOT NULL REFERENCES video_analyses(id) ON DELETE CASCADE,
    deviation_type VARCHAR(100) NOT NULL,
    deviation_severity VARCHAR(50) NOT NULL,
    protocol_id VARCHAR(200) NOT NULL,
    protocol_version VARCHAR(20) NOT NULL,
    protocol_data JSONB NOT NULL,
    user_modifications JSONB,
    completion_status VARCHAR(50) DEFAULT 'not_started',
    current_phase INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_protocols_analysis ON corrective_protocols(video_analysis_id);
CREATE INDEX IF NOT EXISTS idx_protocols_deviation ON corrective_protocols(deviation_type);
CREATE INDEX IF NOT EXISTS idx_protocols_status ON corrective_protocols(completion_status);

-- GOLD STANDARDS
CREATE TABLE IF NOT EXISTS gold_standards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    exercise_id VARCHAR(100) UNIQUE NOT NULL,
    exercise_name VARCHAR(255) NOT NULL,
    version VARCHAR(20) NOT NULL,
    phases_data JSONB NOT NULL,
    similarity_weights JSONB NOT NULL,
    common_compensations JSONB NOT NULL,
    created_by VARCHAR(255),
    validated_by VARCHAR(255),
    validation_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_gold_exercise ON gold_standards(exercise_id);

-- JOB TRACKING
CREATE TABLE IF NOT EXISTS job_tracking (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_id VARCHAR(100) UNIQUE NOT NULL,
    queue_name VARCHAR(100) NOT NULL,
    video_analysis_id UUID,
    user_id VARCHAR(255) NOT NULL,
    status VARCHAR(50) NOT NULL,
    progress INTEGER DEFAULT 0,
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    failed_at TIMESTAMP WITH TIME ZONE,
    duration_ms INTEGER,
    error_message TEXT,
    error_stack TEXT,
    attempts INTEGER DEFAULT 0,
    result JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_job_tracking_job ON job_tracking(job_id);
CREATE INDEX IF NOT EXISTS idx_job_tracking_user ON job_tracking(user_id);
CREATE INDEX IF NOT EXISTS idx_job_tracking_status ON job_tracking(status);
CREATE INDEX IF NOT EXISTS idx_job_tracking_created ON job_tracking(created_at);

-- ANALYSIS METRICS
CREATE TABLE IF NOT EXISTS analysis_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    video_analysis_id UUID NOT NULL,
    extraction_time_ms INTEGER,
    mediapipe_time_ms INTEGER,
    quick_analysis_time_ms INTEGER NOT NULL,
    deep_analysis_time_ms INTEGER,
    protocols_time_ms INTEGER,
    total_time_ms INTEGER NOT NULL,
    cache_hit_l1 BOOLEAN DEFAULT FALSE,
    cache_hit_l2 BOOLEAN DEFAULT FALSE,
    cache_hit_l3 BOOLEAN DEFAULT FALSE,
    deep_analysis_triggered BOOLEAN NOT NULL,
    decision_triggers JSONB NOT NULL,
    frames_extracted INTEGER,
    frames_analyzed INTEGER NOT NULL,
    rag_docs_retrieved INTEGER,
    llm_tokens_used INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_metrics_analysis ON analysis_metrics(video_analysis_id);
CREATE INDEX IF NOT EXISTS idx_metrics_created ON analysis_metrics(created_at);

-- ═══════════════════════════════════════════════════════════
-- RLS (Row Level Security) - Supabase
-- ═══════════════════════════════════════════════════════════

-- Habilitar RLS nas tabelas
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE video_analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE quick_analysis_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE deep_analysis_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE corrective_protocols ENABLE ROW LEVEL SECURITY;

-- Policies: Usuários só veem seus próprios dados
CREATE POLICY users_select_own ON users
    FOR SELECT USING (auth.uid()::text = id::text);

CREATE POLICY user_profiles_all_own ON user_profiles
    FOR ALL USING (auth.uid()::text = user_id::text);

CREATE POLICY video_analyses_all_own ON video_analyses
    FOR ALL USING (auth.uid()::text = user_id::text);

CREATE POLICY quick_results_select_own ON quick_analysis_results
    FOR SELECT USING (
        auth.uid()::text IN (
            SELECT user_id::text FROM video_analyses
            WHERE id = video_analysis_id
        )
    );

CREATE POLICY deep_results_select_own ON deep_analysis_results
    FOR SELECT USING (
        auth.uid()::text IN (
            SELECT user_id::text FROM video_analyses
            WHERE id = video_analysis_id
        )
    );

CREATE POLICY protocols_select_own ON corrective_protocols
    FOR SELECT USING (
        auth.uid()::text IN (
            SELECT user_id::text FROM video_analyses
            WHERE id = video_analysis_id
        )
    );

-- Gold standards: público (read-only)
ALTER TABLE gold_standards ENABLE ROW LEVEL SECURITY;
CREATE POLICY gold_standards_public_read ON gold_standards
    FOR SELECT USING (true);

-- ═══════════════════════════════════════════════════════════
-- TRIGGERS (Updated_at automático)
-- ═══════════════════════════════════════════════════════════

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_video_analyses_updated_at BEFORE UPDATE ON video_analyses
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_quick_results_updated_at BEFORE UPDATE ON quick_analysis_results
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_deep_results_updated_at BEFORE UPDATE ON deep_analysis_results
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_protocols_updated_at BEFORE UPDATE ON corrective_protocols
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_gold_standards_updated_at BEFORE UPDATE ON gold_standards
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_job_tracking_updated_at BEFORE UPDATE ON job_tracking
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ═══════════════════════════════════════════════════════════
-- COMENTÁRIOS E DOCUMENTAÇÃO
-- ═══════════════════════════════════════════════════════════

COMMENT ON TABLE video_analyses IS 'Análises de vídeo processadas pelo sistema híbrido';
COMMENT ON TABLE quick_analysis_results IS 'Resultados da análise rápida (comparação com gold standard)';
COMMENT ON TABLE deep_analysis_results IS 'Resultados da análise profunda (RAG + LLM)';
COMMENT ON TABLE corrective_protocols IS 'Protocolos corretivos prescritos baseado em desvios detectados';
COMMENT ON TABLE gold_standards IS 'Padrões ouro de execução para cada exercício';
COMMENT ON TABLE job_tracking IS 'Tracking de jobs do BullMQ';
COMMENT ON TABLE analysis_metrics IS 'Métricas de performance das análises';
