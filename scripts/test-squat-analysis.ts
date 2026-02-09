/**
 * Script de teste: Avaliação completa do agachamento
 * Verifica que os ângulos corrigidos produzem valores corretos
 *
 * Executar: npx tsx scripts/test-squat-analysis.ts
 */

import { generateMockFrames, analyzeBiomechanics, classifyOnly } from '../lib/biomechanics/biomechanics-analyzer';
import { processFrame, processFrameSequence } from '../lib/biomechanics/mediapipe-processor';

const FRAMES = 30; // 1 segundo a 30fps

console.log('╔════════════════════════════════════════════════════════════╗');
console.log('║     TESTE: Avaliação Biomecânica do Agachamento          ║');
console.log('╚════════════════════════════════════════════════════════════╝\n');

// 1. Gerar frames mock realistas
const frames = generateMockFrames(FRAMES, 'squat');

console.log(`📹 ${FRAMES} frames gerados (30fps, ~1s de vídeo)\n`);

// 2. Mostrar landmarks em frames-chave
const keyFrameIndices = [0, Math.floor(FRAMES * 0.25), Math.floor(FRAMES * 0.5), Math.floor(FRAMES * 0.75), FRAMES - 1];

console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('SEÇÃO 1: Landmarks em frames-chave');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

for (const idx of keyFrameIndices) {
  const f = frames[idx];
  const lm = f.landmarks;
  const progress = idx / FRAMES;
  const depth = Math.sin(progress * Math.PI);
  console.log(`Frame ${idx + 1}/${FRAMES} (progress=${progress.toFixed(2)}, depth=${depth.toFixed(2)}):`);
  console.log(`  shoulder_L: (${lm.left_shoulder.x.toFixed(3)}, ${lm.left_shoulder.y.toFixed(3)})`);
  console.log(`  hip_L:      (${lm.left_hip.x.toFixed(3)}, ${lm.left_hip.y.toFixed(3)})`);
  console.log(`  knee_L:     (${lm.left_knee.x.toFixed(3)}, ${lm.left_knee.y.toFixed(3)})`);
  console.log(`  ankle_L:    (${lm.left_ankle.x.toFixed(3)}, ${lm.left_ankle.y.toFixed(3)})`);
  console.log(`  heel_L:     (${lm.left_heel.x.toFixed(3)}, ${lm.left_heel.y.toFixed(3)})`);
  console.log('');
}

// 3. Processar cada frame e mostrar ângulos
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('SEÇÃO 2: Ângulos por frame');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

console.log('Frame | hip_L   | hip_R   | ankle_dors | trunk   | valgus_L | valgus_R');
console.log('------+---------+---------+------------+---------+----------+---------');

for (const frame of frames) {
  const processed = processFrame(frame, 'squat');
  const getVal = (name: string) => {
    const m = processed.metrics.find(m => m.metric === name);
    return m ? `${m.value}°`.padStart(7) : '   N/A ';
  };
  const getValCm = (name: string) => {
    const m = processed.metrics.find(m => m.metric === name);
    return m ? `${m.value}cm`.padStart(7) : '   N/A ';
  };

  console.log(
    `  ${String(frame.frameNumber).padStart(3)} | ` +
    `${getVal('hip_angle_left')} | ` +
    `${getVal('hip_angle_right')} | ` +
    `${getVal('ankle_dorsiflexion_degrees').padStart(10)} | ` +
    `${getVal('trunk_inclination_degrees')} | ` +
    `${getValCm('knee_valgus_left_cm')} | ` +
    `${getValCm('knee_valgus_right_cm')}`
  );
}

// 4. Processar sequência completa
console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('SEÇÃO 3: Métricas agregadas (processFrameSequence)');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

const videoMetrics = processFrameSequence(frames, 'squat', 30);

console.log('ROM (Range of Motion):');
for (const [metric, range] of Object.entries(videoMetrics.summary.rom)) {
  console.log(`  ${metric}: min=${range.min}° max=${range.max}° (ROM=${range.max - range.min}°)`);
}

console.log('\nAssimetrias:');
for (const [metric, diff] of Object.entries(videoMetrics.summary.asymmetries)) {
  console.log(`  ${metric}: ${diff}°`);
}

console.log('\nValores de Pico:');
for (const [metric, peak] of Object.entries(videoMetrics.summary.peakValues)) {
  console.log(`  ${metric}: ${peak.value} (frame ${peak.frameNumber})`);
}

if (videoMetrics.summary.phases.eccentric) {
  console.log('\nFases detectadas:');
  console.log(`  Excêntrica: frames ${videoMetrics.summary.phases.eccentric.startFrame}-${videoMetrics.summary.phases.eccentric.endFrame} (${videoMetrics.summary.phases.eccentric.durationMs}ms)`);
  if (videoMetrics.summary.phases.concentric) {
    console.log(`  Concêntrica: frames ${videoMetrics.summary.phases.concentric.startFrame}-${videoMetrics.summary.phases.concentric.endFrame} (${videoMetrics.summary.phases.concentric.durationMs}ms)`);
  }
}

// 5. Classificação completa
console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('SEÇÃO 4: Classificação contra template SQUAT');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

async function runClassification() {
  const result = await classifyOnly({
    exerciseName: 'Agachamento com Barra',
    frames,
    fps: 30,
  });

  console.log(`Score Geral: ${result.overallScore}/10`);
  console.log(`Categoria: ${result.categoryLabel || result.category}`);
  console.log(`Danger: ${result.summary.danger} | Warning: ${result.summary.warning} | OK: ${result.summary.acceptable + result.summary.good + result.summary.excellent}\n`);

  console.log('Detalhes:');
  console.log('─────────────────────────────────────────────────────────────');
  for (const c of result.classifications) {
    const icon = c.classification === 'danger' ? '🔴' :
                 c.classification === 'warning' ? '🟡' :
                 c.classification === 'excellent' ? '🟢' :
                 c.classification === 'good' ? '🟢' : '🔵';

    console.log(`${icon} ${(c.label || c.criterion).padEnd(25)} | ${String(c.value).padStart(6)}${c.unit || ''} | ${(c.classificationLabel || c.classification).padEnd(12)} | safety=${c.isSafetyCritical}`);
    if (c.note) console.log(`   📝 ${c.note}`);
  }

  // 6. Análise completa com diagnóstico
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('SEÇÃO 5: Diagnóstico Completo');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  const fullAnalysis = await analyzeBiomechanics({
    exerciseName: 'Agachamento com Barra',
    frames,
    fps: 30,
  });

  console.log(fullAnalysis.diagnosticSummary);

  // 7. Validações
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('SEÇÃO 6: Validações');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  const depthClass = result.classifications.find(c => c.criterion === 'depth');
  const ankleClass = result.classifications.find(c => c.criterion === 'ankle_mobility');

  const checks = [
    {
      name: 'depth NÃO deve ser 180° (posição em pé)',
      pass: !depthClass || depthClass.value < 170,
      detail: depthClass ? `valor=${depthClass.value}°` : 'não encontrado',
    },
    {
      name: 'depth deve ser < 120° (fundo do agachamento)',
      pass: depthClass ? depthClass.value < 120 : false,
      detail: depthClass ? `valor=${depthClass.value}°` : 'não encontrado',
    },
    {
      name: 'ankle NÃO deve ser 90° (posição neutra)',
      pass: !ankleClass || ankleClass.value !== 90,
      detail: ankleClass ? `valor=${ankleClass.value}°` : 'não encontrado',
    },
    {
      name: 'ankle em pé deve ser ~0° (primeiro frame)',
      pass: (() => {
        const f1 = processFrame(frames[0], 'squat');
        const ankle = f1.metrics.find(m => m.metric === 'ankle_dorsiflexion_degrees');
        return ankle ? ankle.value < 10 : false;
      })(),
      detail: (() => {
        const f1 = processFrame(frames[0], 'squat');
        const ankle = f1.metrics.find(m => m.metric === 'ankle_dorsiflexion_degrees');
        return ankle ? `frame1=${ankle.value}°` : 'não encontrado';
      })(),
    },
    {
      name: 'hip_angle usa MIN (não média)',
      pass: depthClass ? depthClass.value === videoMetrics.summary.rom['hip_angle_left']?.min : false,
      detail: depthClass ? `agregado=${depthClass.value}°, ROM min=${videoMetrics.summary.rom['hip_angle_left']?.min}°` : 'não encontrado',
    },
    {
      name: 'score geral > 0',
      pass: result.overallScore > 0,
      detail: `score=${result.overallScore}`,
    },
  ];

  let passed = 0;
  for (const check of checks) {
    const icon = check.pass ? '✅' : '❌';
    console.log(`${icon} ${check.name} — ${check.detail}`);
    if (check.pass) passed++;
  }

  console.log(`\n📊 Resultado: ${passed}/${checks.length} validações passaram`);

  // 8. Teste com Equipment Constraint
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('SEÇÃO 7: Teste com Equipment Constraint (safety_bars)');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  const constrainedResult = await classifyOnly({
    exerciseName: 'Agachamento com Barra',
    frames,
    fps: 30,
    equipmentConstraint: 'safety_bars',
  });

  console.log(`Score SEM constraint: ${result.overallScore}/10`);
  console.log(`Score COM constraint (safety_bars): ${constrainedResult.overallScore}/10`);
  console.log(`Constraint aplicado: ${constrainedResult.constraintApplied} (${constrainedResult.constraintLabel})`);
  console.log('');

  console.log('Detalhes com constraint:');
  console.log('─────────────────────────────────────────────────────────────');
  for (const c of constrainedResult.classifications) {
    const icon = c.isInformativeOnly ? '⚪' :
                 c.classification === 'danger' ? '🔴' :
                 c.classification === 'warning' ? '🟡' :
                 c.classification === 'excellent' ? '🟢' :
                 c.classification === 'good' ? '🟢' : '🔵';

    const infoTag = c.isInformativeOnly ? ' [INFO]' : '';
    console.log(`${icon} ${(c.label || c.criterion).padEnd(25)} | ${String(c.value).padStart(6)}${c.unit || ''} | ${(c.classificationLabel || c.classification).padEnd(12)} | safety=${c.isSafetyCritical}${infoTag}`);
    if (c.note) console.log(`   📝 ${c.note}`);
  }

  // Validações do constraint
  console.log('\nValidações Equipment Constraint:');
  const constraintChecks = [
    {
      name: 'depth marcado como informativo',
      pass: constrainedResult.classifications.find(c => c.criterion === 'depth')?.isInformativeOnly === true,
      detail: `isInformativeOnly=${constrainedResult.classifications.find(c => c.criterion === 'depth')?.isInformativeOnly}`,
    },
    {
      name: 'ankle_mobility marcado como informativo',
      pass: constrainedResult.classifications.find(c => c.criterion === 'ankle_mobility')?.isInformativeOnly === true,
      detail: `isInformativeOnly=${constrainedResult.classifications.find(c => c.criterion === 'ankle_mobility')?.isInformativeOnly}`,
    },
    {
      name: 'knee_valgus NÃO é informativo (segurança)',
      pass: constrainedResult.classifications.find(c => c.criterion === 'knee_valgus')?.isInformativeOnly === false,
      detail: `isInformativeOnly=${constrainedResult.classifications.find(c => c.criterion === 'knee_valgus')?.isInformativeOnly}`,
    },
    {
      name: 'trunk_control NÃO é informativo',
      pass: constrainedResult.classifications.find(c => c.criterion === 'trunk_control')?.isInformativeOnly === false,
      detail: `isInformativeOnly=${constrainedResult.classifications.find(c => c.criterion === 'trunk_control')?.isInformativeOnly}`,
    },
    {
      name: 'constraintApplied = safety_bars',
      pass: constrainedResult.constraintApplied === 'safety_bars',
      detail: `constraintApplied=${constrainedResult.constraintApplied}`,
    },
    {
      name: 'Score com constraint >= score sem (menos critérios penalizam)',
      pass: constrainedResult.overallScore >= result.overallScore,
      detail: `com=${constrainedResult.overallScore} vs sem=${result.overallScore}`,
    },
  ];

  let constraintPassed = 0;
  for (const check of constraintChecks) {
    const icon = check.pass ? '✅' : '❌';
    console.log(`${icon} ${check.name} — ${check.detail}`);
    if (check.pass) constraintPassed++;
  }

  console.log(`\n📊 Constraint: ${constraintPassed}/${constraintChecks.length} validações passaram`);
  console.log(`📊 Total: ${passed + constraintPassed}/${checks.length + constraintChecks.length} validações passaram`);
}

runClassification().catch(console.error);
