/**
 * PÁGINA: Redirecionamento de Tópico
 *
 * Com o novo formato de Painel Vivo, os tópicos são exibidos
 * diretamente no feed da comunidade. Esta página redireciona
 * para o painel principal.
 */

import { redirect } from 'next/navigation';

type Props = {
  params: Promise<{ slug: string; topicoSlug: string }>;
};

export default async function TopicoRedirectPage({ params }: Props) {
  const { slug } = await params;

  // Redireciona para o painel da comunidade
  redirect(`/comunidades/${slug}`);
}
