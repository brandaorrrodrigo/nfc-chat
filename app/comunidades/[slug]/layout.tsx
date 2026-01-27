import type { Metadata } from 'next';

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const titulo = slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

  return {
    title: `${titulo} - Comunidade NutriFit Coach`,
    description: `Participe da comunidade ${titulo}. Discussões, perguntas e conhecimento compartilhado sobre ${titulo.toLowerCase()}.`,
    openGraph: {
      title: `${titulo} - Comunidade NutriFit`,
      description: `Forum especializado em ${titulo.toLowerCase()}. Junte-se a discussao.`,
      type: 'website',
    },
  };
}

export default function ComunidadeSlugLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
