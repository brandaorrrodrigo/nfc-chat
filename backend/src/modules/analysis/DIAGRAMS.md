# 📊 Diagramas Visuais - Pipeline Híbrido

Representações visuais da arquitetura e fluxos do sistema.

## 🏛️ Arquitetura de Componentes

```mermaid
graph TB
    subgraph "Client Layer"
        CLIENT[Cliente Web/Mobile]
    end

    subgraph "API Layer"
        API[NestJS API<br/>VideoController]
    end

    subgraph "Analysis Module"
        QUICK[QuickAnalysisService<br/>200-500ms]
        DECISION[DecisionEngineService<br/><10ms]
        DEEP[DeepAnalysisService<br/>30-60s]
    end

    subgraph "Gold Standards Module"
        GOLD[GoldStandardService]
        SIMILARITY[SimilarityCalculatorService]
    end

    subgraph "Data Layer"
        PRISMA[PrismaService]
        DB[(PostgreSQL)]
        CACHE[(Redis Cache<br/>L1, L2, L3)]
    end

    subgraph "External Services"
        RAG[RAG Service<br/>Vector Search]
        LLM[OpenAI GPT-4]
        MEDIAPIPE[MediaPipe Pose<br/>Frame Extraction]
    end

    CLIENT --> API
    API --> QUICK
    QUICK --> GOLD
    QUICK --> SIMILARITY
    QUICK --> PRISMA
    API --> DECISION
    DECISION --> DEEP
    DEEP --> RAG
    DEEP --> LLM
    GOLD --> PRISMA
    PRISMA --> DB
    PRISMA --> CACHE
    CLIENT --> MEDIAPIPE
    MEDIAPIPE --> API

    classDef quick fill:#90EE90,stroke:#333,stroke-width:2px
    classDef decision fill:#FFD700,stroke:#333,stroke-width:2px
    classDef deep fill:#FF6347,stroke:#333,stroke-width:2px
    classDef data fill:#87CEEB,stroke:#333,stroke-width:2px

    class QUICK quick
    class DECISION decision
    class DEEP deep
    class DB,CACHE,PRISMA data
```

## 🔄 Fluxo de Decisão

```mermaid
flowchart TD
    START([Upload Vídeo]) --> EXTRACT[Extrair Frames<br/>MediaPipe Pose]
    EXTRACT --> QUICK[Quick Analysis<br/>Compare com Gold Standard]

    QUICK --> SCORE{Score ≥ 7.0?}
    QUICK --> SIM{Similaridade ≥ 70%?}
    QUICK --> DEV{Desvios Críticos?}
    QUICK --> MULT{Múltiplos Desvios<br/>≥ 3?}
    QUICK --> TIER{Tier Premium?}

    TIER -->|Sim| DEEP_YES[✅ Análise Profunda<br/>RAG + LLM]
    TIER -->|Não| COUNT[Contar Triggers]

    SCORE -->|Não| TRIGGER1[+1 Trigger]
    SIM -->|Não| TRIGGER2[+1 Trigger]
    DEV -->|Sim| TRIGGER3[+1 Trigger]
    MULT -->|Sim| TRIGGER4[+1 Trigger]

    TRIGGER1 --> COUNT
    TRIGGER2 --> COUNT
    TRIGGER3 --> COUNT
    TRIGGER4 --> COUNT

    COUNT --> CHECK{Triggers ≥ 2?}
    CHECK -->|Sim| DEEP_YES
    CHECK -->|Não| QUICK_ONLY[✅ Análise Rápida<br/>Suficiente]

    SCORE -->|Sim| COUNT
    SIM -->|Sim| COUNT
    DEV -->|Não| COUNT
    MULT -->|Não| COUNT

    DEEP_YES --> RETURN_DEEP[Retornar Análise<br/>Completa]
    QUICK_ONLY --> RETURN_QUICK[Retornar Análise<br/>Rápida]

    RETURN_DEEP --> END([Cliente Recebe<br/>Resultado])
    RETURN_QUICK --> END

    classDef process fill:#90EE90,stroke:#333,stroke-width:2px
    classDef decision fill:#FFD700,stroke:#333,stroke-width:2px
    classDef result fill:#87CEEB,stroke:#333,stroke-width:2px

    class EXTRACT,QUICK,DEEP_YES process
    class SCORE,SIM,DEV,MULT,TIER,CHECK decision
    class RETURN_DEEP,RETURN_QUICK,END result
```

## 🎯 Detecção de Desvios

```mermaid
flowchart LR
    subgraph "Input Frame"
        ANGLES[Ângulos Medidos<br/>knee: 90°/115°<br/>hip: 85°<br/>trunk: 45°<br/>ankle: 70°/70°]
    end

    subgraph "Gold Standard"
        GOLD_ANGLES[Ângulos Ideais<br/>knee: 90° ±5°<br/>hip: 85° ±5°<br/>trunk: 45° ±5°<br/>ankle: 70° ±5°]
    end

    subgraph "Deviation Detection"
        KNEE_CHECK{Knee:<br/>|90-115| = 25°<br/>> 20°?}
        HIP_CHECK{Hip:<br/>|85-85| = 0°<br/>> 5°?}
        TRUNK_CHECK{Trunk:<br/>|45-45| = 0°<br/>> 5°?}
        ANKLE_CHECK{Ankle:<br/>|70-70| = 0°<br/>> 5°?}
        ASYM_CHECK{Asymmetry:<br/>|90-115| = 25°<br/>> 20°?}
    end

    subgraph "Detected Deviations"
        DEV1[✅ knee_valgus<br/>severity: severe<br/>value: 25°]
        DEV2[✅ asymmetric_loading<br/>severity: severe<br/>value: 25°]
    end

    ANGLES --> KNEE_CHECK
    ANGLES --> HIP_CHECK
    ANGLES --> TRUNK_CHECK
    ANGLES --> ANKLE_CHECK
    ANGLES --> ASYM_CHECK

    GOLD_ANGLES --> KNEE_CHECK
    GOLD_ANGLES --> HIP_CHECK
    GOLD_ANGLES --> TRUNK_CHECK
    GOLD_ANGLES --> ANKLE_CHECK

    KNEE_CHECK -->|Sim| DEV1
    ASYM_CHECK -->|Sim| DEV2

    HIP_CHECK -->|Não| NONE1[❌ Sem desvio]
    TRUNK_CHECK -->|Não| NONE2[❌ Sem desvio]
    ANKLE_CHECK -->|Não| NONE3[❌ Sem desvio]

    classDef detected fill:#FF6347,stroke:#333,stroke-width:2px
    classDef ok fill:#90EE90,stroke:#333,stroke-width:2px

    class DEV1,DEV2 detected
    class NONE1,NONE2,NONE3 ok
```

## 📈 Função de Similaridade

```mermaid
graph LR
    subgraph "Zona 1: Perfeito"
        Z1[0° - tolerance<br/>similarity = 1.0]
    end

    subgraph "Zona 2: Degradação Linear"
        Z2[tolerance - 2x<br/>similarity = 1.0 → 0.7]
    end

    subgraph "Zona 3: Degradação Linear"
        Z3[2x - 3x<br/>similarity = 0.7 → 0.4]
    end

    subgraph "Zona 4: Decaimento Exponencial"
        Z4[> 3x tolerance<br/>similarity → 0]
    end

    START[Diferença<br/>Ângulo] --> CHECK1{diff ≤<br/>tolerance?}
    CHECK1 -->|Sim| Z1
    CHECK1 -->|Não| CHECK2{diff ≤<br/>2x tolerance?}
    CHECK2 -->|Sim| Z2
    CHECK2 -->|Não| CHECK3{diff ≤<br/>3x tolerance?}
    CHECK3 -->|Sim| Z3
    CHECK3 -->|Não| Z4

    Z1 --> RESULT[Similaridade<br/>0-1]
    Z2 --> RESULT
    Z3 --> RESULT
    Z4 --> RESULT

    classDef excellent fill:#90EE90,stroke:#333,stroke-width:2px
    classDef good fill:#FFD700,stroke:#333,stroke-width:2px
    classDef fair fill:#FFA500,stroke:#333,stroke-width:2px
    classDef poor fill:#FF6347,stroke:#333,stroke-width:2px

    class Z1 excellent
    class Z2 good
    class Z3 fair
    class Z4 poor
```

## 🗂️ Estrutura de Módulos

```mermaid
graph TD
    subgraph "AnalysisModule"
        ANALYSIS_MOD[analysis.module.ts]
        QUICK_SVC[quick-analysis.service.ts]
        DECISION_SVC[decision-engine.service.ts]
        ANALYSIS_DTO[dto/]
        ANALYSIS_INT[interfaces/]
        ANALYSIS_TEST[__tests__/]
    end

    subgraph "GoldStandardsModule"
        GOLD_MOD[gold-standards.module.ts]
        GOLD_SVC[gold-standard.service.ts]
        SIM_SVC[similarity-calculator.service.ts]
        GOLD_TEST[__tests__/]
    end

    subgraph "PrismaModule"
        PRISMA_MOD[prisma.module.ts]
        PRISMA_SVC[prisma.service.ts]
    end

    ANALYSIS_MOD --> QUICK_SVC
    ANALYSIS_MOD --> DECISION_SVC
    QUICK_SVC --> ANALYSIS_DTO
    QUICK_SVC --> ANALYSIS_INT
    QUICK_SVC --> GOLD_SVC
    QUICK_SVC --> SIM_SVC
    QUICK_SVC --> PRISMA_SVC

    DECISION_SVC --> ANALYSIS_DTO

    GOLD_MOD --> GOLD_SVC
    GOLD_MOD --> SIM_SVC
    GOLD_SVC --> PRISMA_SVC

    PRISMA_MOD --> PRISMA_SVC

    ANALYSIS_TEST -.tests.-> QUICK_SVC
    ANALYSIS_TEST -.tests.-> DECISION_SVC
    GOLD_TEST -.tests.-> SIM_SVC

    classDef module fill:#87CEEB,stroke:#333,stroke-width:2px
    classDef service fill:#90EE90,stroke:#333,stroke-width:2px
    classDef support fill:#FFD700,stroke:#333,stroke-width:2px

    class ANALYSIS_MOD,GOLD_MOD,PRISMA_MOD module
    class QUICK_SVC,DECISION_SVC,GOLD_SVC,SIM_SVC,PRISMA_SVC service
    class ANALYSIS_DTO,ANALYSIS_INT,ANALYSIS_TEST,GOLD_TEST support
```

## 💾 Modelo de Dados

```mermaid
erDiagram
    USERS ||--o{ VIDEO_ANALYSES : uploads
    VIDEO_ANALYSES ||--|| QUICK_ANALYSIS_RESULTS : has
    VIDEO_ANALYSES ||--o| DEEP_ANALYSIS_RESULTS : may_have
    GOLD_STANDARDS ||--o{ QUICK_ANALYSIS_RESULTS : references

    USERS {
        string id PK
        string email
        string subscription_tier
        datetime created_at
    }

    VIDEO_ANALYSES {
        string id PK
        string user_id FK
        string video_path
        string exercise_id
        string status
        datetime created_at
    }

    QUICK_ANALYSIS_RESULTS {
        string id PK
        string video_analysis_id FK
        float overall_score
        string classification
        float similarity_to_gold
        json frames_data
        json deviations_detected
        int processing_time_ms
        datetime created_at
    }

    DEEP_ANALYSIS_RESULTS {
        string id PK
        string video_analysis_id FK
        string quick_analysis_id FK
        json corrective_protocols
        text detailed_feedback
        json llm_response
        int processing_time_ms
        datetime created_at
    }

    GOLD_STANDARDS {
        string id PK
        string exercise_id
        string version
        json phases_data
        json similarity_weights
        json common_compensations
        datetime created_at
    }
```

## ⚡ Performance Timeline

```mermaid
gantt
    title Pipeline Híbrido - Timeline de Processamento
    dateFormat X
    axisFormat %L ms

    section Client
    Upload Video           :a1, 0, 100ms

    section Backend
    Extract Frames (MP)    :a2, 100, 300ms
    Quick Analysis         :a3, 400, 350ms
    Decision Engine        :a4, 750, 5ms

    section Quick Path
    Return Quick Result    :crit, a5, 755, 50ms

    section Deep Path
    RAG Search            :a6, 755, 15000ms
    LLM Generation        :a7, 15755, 20000ms
    Save Deep Result      :a8, 35755, 100ms
    Return Deep Result    :crit, a9, 35855, 50ms
```

## 🎨 Classificação de Scores

```mermaid
graph LR
    START[Score 0-10] --> CLASSIFY

    subgraph "Classificação"
        CLASSIFY{Score}
        CLASSIFY -->|≥ 8.0| EXCEL[EXCELENTE<br/>🌟🌟🌟🌟🌟]
        CLASSIFY -->|7.0-7.9| BOM[BOM<br/>🌟🌟🌟🌟]
        CLASSIFY -->|5.0-6.9| REG[REGULAR<br/>🌟🌟🌟]
        CLASSIFY -->|3.0-4.9| RUIM[RUIM<br/>🌟🌟]
        CLASSIFY -->|< 3.0| CRIT[CRÍTICO<br/>🌟]
    end

    subgraph "Ação Recomendada"
        EXCEL --> ACTION1[✅ Continuar treino<br/>sem modificações]
        BOM --> ACTION2[ℹ️ Pequenos ajustes<br/>podem melhorar]
        REG --> ACTION3[⚠️ Atenção necessária<br/>correções recomendadas]
        RUIM --> ACTION4[🚨 Modificações urgentes<br/>análise profunda]
        CRIT --> ACTION5[🔴 PARAR treino<br/>consultar profissional]
    end

    classDef excellent fill:#90EE90,stroke:#333,stroke-width:3px
    classDef good fill:#98FB98,stroke:#333,stroke-width:2px
    classDef regular fill:#FFD700,stroke:#333,stroke-width:2px
    classDef poor fill:#FFA500,stroke:#333,stroke-width:2px
    classDef critical fill:#FF6347,stroke:#333,stroke-width:3px

    class EXCEL,ACTION1 excellent
    class BOM,ACTION2 good
    class REG,ACTION3 regular
    class RUIM,ACTION4 poor
    class CRIT,ACTION5 critical
```

## 🔁 Cache Strategy

```mermaid
graph TD
    REQUEST[Request de Análise] --> CHECK_L1{Cache L1<br/>Análise Idêntica<br/>TTL: 24h}

    CHECK_L1 -->|Hit 15-20%| RETURN_L1[✅ Retornar do Cache<br/>~5ms]
    CHECK_L1 -->|Miss| CHECK_L2{Cache L2<br/>Gold Standard<br/>TTL: 7 dias}

    CHECK_L2 -->|Hit 85-90%| COMPUTE[Computar Análise<br/>~350ms]
    CHECK_L2 -->|Miss| FETCH_DB[(Buscar Gold Standard<br/>do Database)]

    FETCH_DB --> SAVE_L2[Salvar em L2]
    SAVE_L2 --> COMPUTE

    COMPUTE --> DECISION[Decision Engine]

    DECISION -->|Deep| CHECK_L3{Cache L3<br/>RAG Context<br/>TTL: 30 dias}
    CHECK_L3 -->|Hit 70-80%| RAG_CACHED[✅ Usar Context<br/>Cached]
    CHECK_L3 -->|Miss| RAG_FETCH[Buscar Protocolos<br/>do RAG]

    RAG_FETCH --> SAVE_L3[Salvar em L3]
    SAVE_L3 --> LLM[LLM Generation]
    RAG_CACHED --> LLM

    LLM --> RETURN_DEEP[Retornar Deep<br/>Analysis]

    DECISION -->|Quick| RETURN_QUICK[Retornar Quick<br/>Analysis]

    classDef cache fill:#87CEEB,stroke:#333,stroke-width:2px
    classDef compute fill:#90EE90,stroke:#333,stroke-width:2px
    classDef db fill:#FFD700,stroke:#333,stroke-width:2px

    class CHECK_L1,CHECK_L2,CHECK_L3,RETURN_L1,RAG_CACHED cache
    class COMPUTE,DECISION,LLM compute
    class FETCH_DB,SAVE_L2,SAVE_L3,RAG_FETCH db
```

## 📊 Agregação de Desvios

```mermaid
graph TD
    subgraph "Frames Individuais"
        F1[Frame 1<br/>knee_valgus: 8°<br/>severity: mild]
        F2[Frame 2<br/>knee_valgus: 12°<br/>severity: moderate]
        F3[Frame 3<br/>knee_valgus: 15°<br/>severity: moderate]
        F4[Frame 4<br/>butt_wink: 6°<br/>severity: mild]
    end

    subgraph "Agregação"
        AGG[Agrupar por Tipo]
        AGG --> GROUP1[knee_valgus<br/>frames: 1, 2, 3]
        AGG --> GROUP2[butt_wink<br/>frames: 4]
    end

    subgraph "Estatísticas"
        GROUP1 --> STATS1[Severity: moderate<br/>max severity<br/>───────<br/>Percentage: 50%<br/>3/6 frames<br/>───────<br/>Avg Value: 11.67°<br/>mean<br/>───────<br/>Trend: increasing<br/>8→12→15]

        GROUP2 --> STATS2[Severity: mild<br/>───────<br/>Percentage: 16.67%<br/>1/6 frames<br/>───────<br/>Avg Value: 6°<br/>───────<br/>Trend: stable]
    end

    F1 --> AGG
    F2 --> AGG
    F3 --> AGG
    F4 --> AGG

    classDef frame fill:#87CEEB,stroke:#333,stroke-width:1px
    classDef group fill:#FFD700,stroke:#333,stroke-width:2px
    classDef stats fill:#90EE90,stroke:#333,stroke-width:2px

    class F1,F2,F3,F4 frame
    class GROUP1,GROUP2 group
    class STATS1,STATS2 stats
```

---

## 🎓 Como Ler os Diagramas

### Cores
- 🟢 **Verde:** Processos/serviços principais
- 🟡 **Amarelo:** Decisões/lógica de negócio
- 🔵 **Azul:** Dados/cache/storage
- 🔴 **Vermelho:** Análise profunda/operações custosas

### Símbolos
- `()` : Início/Fim
- `[]` : Processo/Ação
- `{}` : Decisão
- `()` : Banco de dados
- `--` : Cache/opcional

### Fluxo
- `→` : Fluxo normal
- `-.->` : Dependência de teste
- `==>` : Fluxo crítico

---

**Diagramas criados com:** Mermaid
**Última atualização:** 2025-02-05
