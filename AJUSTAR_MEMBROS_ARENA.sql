ALTER TABLE "Arena" ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE "Arena" ADD COLUMN IF NOT EXISTS atualizado_em TIMESTAMPTZ DEFAULT NOW();

UPDATE "Arena" SET "dailyActiveUsers" = CASE
  WHEN slug IN ('deficit-calorico','treino-gluteo','dieta-vida-real') THEN 5
  WHEN slug IN ('lipedema','antes-depois','ansiedade-alimentacao','receitas-saudaveis','canetas') THEN 4
  WHEN slug IN ('lipedema-paradoxo','emagrecimento-35-mais','odeia-treinar','exercicios-que-ama','treino-casa','aspiracional-estetica') THEN 3
  ELSE 2
END
WHERE "isActive" = true;

SELECT slug, "dailyActiveUsers" FROM "Arena" WHERE "isActive" = true ORDER BY "dailyActiveUsers" DESC;
