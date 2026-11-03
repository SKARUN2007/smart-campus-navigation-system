import { redirect } from 'next/navigation';

export default async function MapPage({
  searchParams,
}: {
  searchParams: Promise<{ query?: string; destination?: string; category?: string }>;
}) {
  const params = await searchParams;
  const search = new URLSearchParams();
  if (params.query) search.set('query', params.query);
  if (params.destination) search.set('destination', params.destination);
  if (params.category) search.set('category', params.category);

  const queryStr = search.toString();
  redirect(queryStr ? `/explore?${queryStr}` : '/explore');
}
