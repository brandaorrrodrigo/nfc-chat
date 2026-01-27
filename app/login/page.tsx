'use client';

/**
 * PÁGINA: Hub de Login
 *
 * Escolha entre Comunidades (grátis) e App Premium
 *
 * IMPORTANTE: Header e Footer são renderizados GLOBALMENTE via providers.tsx
 * Esta página contém APENAS o conteúdo específico.
 */

import Link from 'next/link';
import { Users, Sparkles, Crown, Zap, Brain, ChefHat, Star, ArrowRight, CheckCircle } from 'lucide-react';

const testimonials = [
  { name: "Marina S.", text: "Perdi 12kg em 3 meses seguindo os cardápios da IA!" },
  { name: "Carlos R.", text: "A melhor decisão que tomei para minha saúde." },
  { name: "Ana P.", text: "Os treinos personalizados mudaram minha vida." },
];

const metrics = [
  { value: "+10.000", label: "usuários ativos" },
  { value: "+250", label: "cardápios criados" },
  { value: "24h", label: "IA ativa" },
];

export default function LoginHubPage() {
  return (
    <div className="bg-black">
      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-12 md:py-20">
        {/* Hero */}
        <div className="text-center mb-12 md:mb-16">
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
            Escolha sua <span className="text-[#00ff88]">jornada</span>
          </h1>
          <p className="text-lg text-zinc-400 max-w-2xl mx-auto mb-4">
            Duas formas de transformar sua saúde. Escolha a que melhor se encaixa no seu momento.
          </p>
          <p className="text-sm text-zinc-500 bg-zinc-900/50 inline-block px-4 py-2 rounded-full border border-zinc-800">
            Comunidades são <span className="text-[#00ff88] font-medium">gratuitas</span>. O App Premium é <span className="text-zinc-300">opcional</span>.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid md:grid-cols-2 gap-6 md:gap-8 mb-16 md:mb-24">
          {/* Card 1 - Comunidades (Gratuito) */}
          <Link
            href="/login/comunidades"
            className="group relative block p-8 rounded-2xl border border-zinc-800 bg-zinc-900/50 hover:border-[#00ff88]/50 hover:bg-zinc-900 transition-all duration-300"
          >
            <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-zinc-800 text-zinc-400 text-xs font-medium">
              GRÁTIS
            </div>

            <div className="w-16 h-16 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center mb-6 group-hover:border-[#00ff88]/50 transition-colors">
              <Users className="w-8 h-8 text-zinc-400 group-hover:text-[#00ff88] transition-colors" />
            </div>

            <h2 className="text-2xl font-bold text-white mb-3">
              Comunidades
            </h2>

            <p className="text-zinc-400 mb-6 leading-relaxed">
              Conecte-se com pessoas que compartilham seus objetivos. Participe de discussões,
              compartilhe experiências e aprenda com a comunidade.
            </p>

            <ul className="space-y-3 mb-8">
              <li className="flex items-center gap-3 text-zinc-300">
                <CheckCircle className="w-5 h-5 text-zinc-500" />
                <span>Acesso a todas as comunidades</span>
              </li>
              <li className="flex items-center gap-3 text-zinc-300">
                <CheckCircle className="w-5 h-5 text-zinc-500" />
                <span>Participação em discussões</span>
              </li>
              <li className="flex items-center gap-3 text-zinc-300">
                <CheckCircle className="w-5 h-5 text-zinc-500" />
                <span>Acompanhamento de arenas ao vivo</span>
              </li>
            </ul>

            <div className="flex items-center gap-2 text-[#00ff88] font-semibold group-hover:gap-4 transition-all">
              <span>Entrar grátis</span>
              <ArrowRight className="w-5 h-5" />
            </div>
          </Link>

          {/* Card 2 - App Premium */}
          <Link
            href="/login/app"
            className="group relative block p-8 rounded-2xl border-2 border-[#00ff88]/30 bg-gradient-to-br from-[#00ff88]/5 to-transparent hover:border-[#00ff88] hover:from-[#00ff88]/10 transition-all duration-300"
          >
            <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-[#00ff88]/20 text-[#00ff88] text-xs font-bold flex items-center gap-1">
              <Crown className="w-3 h-3" />
              PREMIUM
            </div>

            <div className="w-16 h-16 rounded-xl bg-[#00ff88]/10 border border-[#00ff88]/30 flex items-center justify-center mb-6 group-hover:bg-[#00ff88]/20 transition-colors">
              <Sparkles className="w-8 h-8 text-[#00ff88]" />
            </div>

            <h2 className="text-2xl font-bold text-white mb-3">
              App NutriFitCoach
            </h2>

            <p className="text-zinc-400 mb-6 leading-relaxed">
              Transformação completa com IA. Cardápios personalizados, treinos adaptados,
              acompanhamento nutricional e muito mais.
            </p>

            <ul className="space-y-3 mb-8">
              <li className="flex items-center gap-3 text-white">
                <Brain className="w-5 h-5 text-[#00ff88]" />
                <span>IA Nutricional 24h</span>
              </li>
              <li className="flex items-center gap-3 text-white">
                <ChefHat className="w-5 h-5 text-[#00ff88]" />
                <span>Cardápios personalizados ilimitados</span>
              </li>
              <li className="flex items-center gap-3 text-white">
                <Zap className="w-5 h-5 text-[#00ff88]" />
                <span>Treinos adaptativos + métricas</span>
              </li>
            </ul>

            <div className="flex items-center gap-2 text-black font-bold bg-[#00ff88] px-6 py-3 rounded-lg justify-center group-hover:bg-[#00ff88]/90 transition-all">
              <span>Acessar App Premium</span>
              <ArrowRight className="w-5 h-5" />
            </div>
          </Link>
        </div>

        {/* Marketing Section - Premium App */}
        <section className="border-t border-zinc-800 pt-16 md:pt-24">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#00ff88]/10 border border-[#00ff88]/30 text-[#00ff88] text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              Por que escolher o Premium?
            </div>
            <h2 className="text-2xl md:text-4xl font-bold text-white mb-4">
              Resultados reais com tecnologia de ponta
            </h2>
            <p className="text-zinc-400 max-w-2xl mx-auto">
              Nossa IA aprende com você e cria planos únicos para acelerar seus resultados.
            </p>
          </div>

          {/* Metrics */}
          <div className="grid grid-cols-3 gap-4 md:gap-8 mb-16">
            {metrics.map((metric, i) => (
              <div key={i} className="text-center p-6 rounded-xl bg-zinc-900/50 border border-zinc-800">
                <div className="text-2xl md:text-4xl font-bold text-[#00ff88] mb-2">
                  {metric.value}
                </div>
                <div className="text-sm text-zinc-500">
                  {metric.label}
                </div>
              </div>
            ))}
          </div>

          {/* Testimonials */}
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, i) => (
              <div key={i} className="p-6 rounded-xl bg-zinc-900/30 border border-zinc-800/50">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} className="w-4 h-4 text-[#00ff88] fill-[#00ff88]" />
                  ))}
                </div>
                <p className="text-zinc-300 mb-4 italic">
                  "{testimonial.text}"
                </p>
                <p className="text-sm text-zinc-500 font-medium">
                  — {testimonial.name}
                </p>
              </div>
            ))}
          </div>

          {/* Final CTA */}
          <div className="text-center mt-16">
            <Link
              href="/login/app"
              className="inline-flex items-center gap-3 px-8 py-4 bg-[#00ff88] hover:bg-[#00ff88]/90 text-black font-bold rounded-xl transition-all text-lg"
            >
              <Sparkles className="w-5 h-5" />
              Começar transformação agora
              <ArrowRight className="w-5 h-5" />
            </Link>
            <p className="text-zinc-500 text-sm mt-4">
              7 dias grátis • Cancele quando quiser
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
