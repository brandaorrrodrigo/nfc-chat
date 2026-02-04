#!/usr/bin/env node
/**
 * Script para fazer seed das comunidades via API REST do Supabase
 * Não requer conexão direta ao PostgreSQL (porta 5432)
 * Funciona mesmo com firewall restritivo
 */

import 'dotenv/config'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('❌ Erro: SUPABASE_URL e SUPABASE_ANON_KEY não estão configuradas')
  process.exit(1)
}


async function seedCommunities() {
  console.log('🌱 Iniciando seed via API REST do Supabase...')
  console.log(`📍 URL: ${SUPABASE_URL}`)

  try {
    // ========================================
    // Comunidades a serem criadas
    // ========================================
    const communities = [
      {
        name: 'Receitas Saudáveis',
        slug: 'receitas-saudaveis',
        description: 'Compartilhe receitas fit e receba análise nutricional automática',
        visibility: 'publica',
        icon: 'Utensils',
        color: '#10b981'
      },
      {
        name: 'Dieta na Vida Real',
        slug: 'dieta-vida-real',
        description: 'Espaço para falar da dificuldade real de seguir dietas',
        visibility: 'publica',
        icon: 'Utensils',
        color: '#84cc16'
      },
      {
        name: 'Déficit Calórico na Vida Real',
        slug: 'deficit-calorico',
        description: 'O que realmente acontece na prática com o déficit calórico',
        visibility: 'publica',
        icon: 'TrendingDown',
        color: '#f97316'
      },
      {
        name: 'Exercícios que Ama',
        slug: 'exercicios-que-ama',
        description: 'Compartilhe exercícios que você AMA fazer',
        visibility: 'publica',
        icon: 'Dumbbell',
        color: '#6366f1'
      },
      {
        name: 'Treino de Glúteo',
        slug: 'treino-gluteo',
        description: 'Foco em treinos e exercícios para glúteos',
        visibility: 'publica',
        icon: 'Dumbbell',
        color: '#ec4899'
      },
      {
        name: 'Exercício para Quem Odeia Treinar',
        slug: 'odeia-treinar',
        description: 'Para quem acha que não gosta de exercício... até encontrar o seu',
        visibility: 'publica',
        icon: 'Zap',
        color: '#f59e0b'
      },
      {
        name: 'Treino em Casa',
        slug: 'treino-casa',
        description: 'Exercícios que você pode fazer em casa, sem equipamento',
        visibility: 'publica',
        icon: 'Home',
        color: '#8b5cf6'
      },
      {
        name: 'Performance & Biohacking',
        slug: 'performance-biohacking',
        description: 'Potencialize seu desempenho físico e mental',
        visibility: 'publica',
        icon: 'Zap',
        color: '#06b6d4'
      },
      {
        name: 'Sinal Vermelho',
        slug: 'sinal-vermelho',
        description: 'Saúde das mulheres e ciclo menstrual',
        visibility: 'publica',
        icon: 'Heart',
        color: '#ef4444'
      },
      {
        name: 'Lipedema — Paradoxo do Cardio',
        slug: 'lipedema-paradoxo',
        description: 'Entenda o lipedema e por que cardio nem sempre funciona',
        visibility: 'publica',
        icon: 'AlertCircle',
        color: '#f87171'
      },
      {
        name: 'Protocolo Lipedema',
        slug: 'lipedema',
        description: 'Protocolo completo para tratamento do lipedema',
        visibility: 'publica',
        icon: 'Activity',
        color: '#fb7185'
      },
      {
        name: 'Canetas Emagrecedoras',
        slug: 'canetas',
        description: 'Discussão sobre medicações e canetas para emagrecimento',
        visibility: 'publica',
        icon: 'Pill',
        color: '#a78bfa'
      },
      {
        name: 'Ansiedade, Compulsão e Alimentação',
        slug: 'ansiedade-alimentacao',
        description: 'Conexão entre emoções, ansiedade e alimentação',
        visibility: 'publica',
        icon: 'Brain',
        color: '#60a5fa'
      },
      {
        name: 'Emagrecimento Feminino 35+',
        slug: 'emagrecimento-35-mais',
        description: 'Desafios específicos do emagrecimento feminino após 35 anos',
        visibility: 'publica',
        icon: 'Users',
        color: '#fbbf24'
      },
      {
        name: 'Antes e Depois — Processo Real',
        slug: 'antes-depois',
        description: 'Compartilhe sua jornada real, com os desafios do caminho',
        visibility: 'publica',
        icon: 'TrendingUp',
        color: '#10b981'
      },
      {
        name: 'Aspiracional & Estética',
        slug: 'aspiracional-estetica',
        description: 'Discussão sobre objetivos estéticos e autoestima',
        visibility: 'publica',
        icon: 'Sparkles',
        color: '#fbbf24'
      }
    ]

    let successCount = 0
    let errorCount = 0

    for (const community of communities) {
      try {
        const response = await fetch(`${SUPABASE_URL}/rest/v1/comunidade`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': SUPABASE_KEY,
            'Authorization': `Bearer ${SUPABASE_KEY}`
          },
          body: JSON.stringify({
            ...community,
            criador_id: 'system',
            total_membros: 0,
            total_topicos: 0,
            total_mensagens: 0,
            tags: [],
            requer_aprovacao: false,
            arquivada_em: null
          })
        })

        if (response.ok) {
          console.log(`✅ ${community.name}`)
          successCount++
        } else {
          const error = await response.text()
          console.log(`⚠️  ${community.name}: ${response.status}`)
          errorCount++
        }
      } catch (error) {
        console.error(`❌ ${community.name}: ${error}`)
        errorCount++
      }
    }

    console.log(`\n📊 Resultado: ${successCount} criadas, ${errorCount} erros`)

    if (successCount > 0) {
      console.log('✅ Seed completado com sucesso!')
    } else {
      console.log('❌ Nenhuma comunidade foi criada')
      process.exit(1)
    }
  } catch (error) {
    console.error('❌ Erro fatal:', error)
    process.exit(1)
  }
}

seedCommunities()
