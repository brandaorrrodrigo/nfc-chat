import type { Metadata } from 'next';

type Props = {
  params: Promise<{ slug: string; topicoSlug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, topicoSlug } = await params;
  const comunidade = slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  const topico = topicoSlug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

  return {
    title: `${topico} - ${comunidade} | NutriFit Coach`,
    description: `Discussao sobre ${topico.toLowerCase()} na comunidade ${comunidade}. Leia e participe.`,
    openGraph: {
      title: `${topico} - ${comunidade}`,
      description: `Topico na comunidade ${comunidade} do NutriFit Coach.`,
      type: 'article',
    },
  };
}

export default function TopicoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
