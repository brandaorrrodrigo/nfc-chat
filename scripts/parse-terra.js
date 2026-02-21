const chunks = [];
process.stdin.on('data', c => chunks.push(c));
process.stdin.on('end', () => {
  const d = JSON.parse(chunks.join(''));
  const a = d.analysis || d;
  const score = a.overall_score ?? a.score ?? d.diagnostic?.score ?? '?';
  const motor = a.motor_score ?? d.diagnostic?.motor_score ?? '?';
  const stab = a.stabilizer_score ?? d.diagnostic?.stabilizer_score ?? '?';
  console.log('TERRA -- Score:', score, '| Motor:', motor, '| Stab:', stab);
  const sa = a.stabilizer_analysis || [];
  for (const s of sa) {
    const v = s.variation;
    console.log(' ', s.label, v.value, v.unit, '[' + v.classification + ']', v.classificationLabel);
  }
  if (sa.length === 0) {
    console.log(JSON.stringify(d, null, 2).slice(0, 1000));
  }
});
