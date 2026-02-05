# Protocolos Corretivos - Sistema NutriFitCoach

## Visão Geral

Este diretório contém protocolos corretivos detalhados baseados em evidências científicas para os 5 desvios biomecânicos mais comuns em exercícios de força.

## Estrutura

Cada desvio possui 3 níveis de severidade:
- **mild.json**: Protocolo para casos leves (2-4 semanas)
- **moderate.json**: Protocolo para casos moderados (4-8 semanas)
- **severe.json**: Protocolo para casos severos (8-16 semanas)

## Desvios Catalogados

### 1. Knee-Valgus (Valgo de Joelho)
- **Mild**: < 10° de adução femoral, inconsistente
- **Moderate**: 10-20° de adução, consistente, possível dor leve
- **Severe**: > 20° de adução, dor significativa, risco alto de lesão

### 2. Butt-Wink (Retroversão Pélvica)
- **Mild**: < 10° retroversão nos últimos graus de flexão
- **Moderate**: 10-20° retroversão, começa acima de paralelo
- **Severe**: > 20° retroversão, perda completa de lordose lombar

### 3. Forward-Lean (Inclinação Anterior Excessiva)
- **Mild**: Torso 10-15° além do ótimo para antropometria
- **Moderate**: Torso > 15° forward, compensação clara
- **Severe**: Torso quase horizontal, perda de controle

### 4. Heel-Rise (Elevação de Calcanhares)
- **Mild**: Calcanhares levantam < 2cm, inconsistente
- **Moderate**: 2-4cm elevação, consistente
- **Severe**: > 4cm ou incapacidade de manter calcanhares no chão

### 5. Asymmetric-Loading (Carga Assimétrica)
- **Mild**: Diferença < 10% entre lados, visual sutil
- **Moderate**: 10-20% diferença, compensação clara
- **Severe**: > 20% diferença, possível assimetria estrutural

## Estrutura dos Protocolos JSON

Cada arquivo JSON contém:

```json
{
  "protocol_id": "identificador_único",
  "deviation": "nome-do-desvio",
  "severity": "mild|moderate|severe",
  "version": "1.0.0",
  "overview": {
    "description": "...",
    "typical_presentation": "...",
    "primary_causes": [],
    "expected_duration": "...",
    "success_rate": "..."
  },
  "goals_hierarchy": [],
  "phases": [
    {
      "phase_number": 1,
      "name": "...",
      "duration_typical": "...",
      "frequency": "...",
      "focus": "...",
      "advancement_criteria": {},
      "exercises": []
    }
  ],
  "return_to_exercise_criteria": {},
  "contraindications": {},
  "red_flags": {},
  "scientific_references": [],
  "personalization_rules": {}
}
```

## Uso Programático

### Carregar Protocolo
```javascript
const protocol = require('./knee-valgus/mild.json');
console.log(protocol.expected_duration);
// "2-4 semanas com prática consistente (3-4x/semana)"
```

### Acessar Exercícios da Fase
```javascript
const phase1Exercises = protocol.phases[0].exercises;
phase1Exercises.forEach(ex => {
  console.log(`${ex.name}: ${ex.sets}x${ex.reps}`);
});
```

### Verificar Critérios de Avanço
```javascript
function canAdvancePhase(userTests, phase) {
  const criteria = phase.advancement_criteria;
  const passedTests = userTests.filter(test => test.passed).length;
  
  if (criteria.all_criteria_required) {
    return passedTests === criteria.objective_measures.length;
  } else {
    return passedTests >= criteria.minimum_criteria;
  }
}
```

## Personalização

Cada protocolo inclui regras de personalização baseadas em:
- **training_age**: beginner (<1 ano), intermediate (1-3 anos), advanced (>3 anos)
- **injury_history**: knee_previous, hip_previous, ankle_previous, lower_back_previous
- **anthropometry**: long_femurs, limited_ankle_mobility, Q_angle_elevated

### Exemplo de Aplicação
```javascript
function personalizeProtocol(protocol, userProfile) {
  if (userProfile.training_age === 'beginner') {
    protocol.phases.forEach(phase => {
      phase.exercises.forEach(ex => {
        if (ex.personalization_rules?.training_age_beginner) {
          Object.assign(ex, ex.personalization_rules.training_age_beginner);
        }
      });
    });
  }
  return protocol;
}
```

## Referências Científicas

Todos os protocolos são baseados em literatura científica revisada por pares. Principais fontes:

1. **Distefano et al. (2009)** - Ativação de glúteo médio
2. **Myer et al. (2008, 2014)** - Prevenção de lesões e controle neuromuscular
3. **McGill (2015)** - Biomecânica e saúde lombar
4. **Contreras et al. (2013)** - EMG de exercícios de glúteo
5. **Hewett et al. (2005)** - Fatores de risco de lesão de LCA
6. **Ishøi et al. (2016)** - Copenhagen plank e força de quadril

## Integração com Sistema Híbrido

Estes protocolos são projetados para integração com:
- **Quick Analysis**: Detecta desvio e severidade
- **Decision Engine**: Seleciona protocolo apropriado
- **Progress Tracking**: Monitora avanço através das fases
- **Video Analysis**: Valida critérios objetivos de avanço

## Avisos e Disclaimers

⚠️ **IMPORTANTE**:
- Protocolos severe requerem clearance médico antes de iniciar
- Qualquer dor aguda > 5/10 requer parada imediata
- Red flags (dor irradiada, dormência, instabilidade) exigem avaliação médica
- Estes protocolos são educacionais e não substituem supervisão profissional

## Contribuições e Atualizações

- **Versão Atual**: 1.0.0
- **Última Atualização**: 2025-01-15
- **Próxima Revisão**: Baseada em feedback e nova literatura

Para sugerir modificações ou reportar erros, consultar equipe de desenvolvimento.

## Licença

© 2025 NutriFitCoach. Todos os direitos reservados.
Uso exclusivo para plataforma NutriFitCoach.

