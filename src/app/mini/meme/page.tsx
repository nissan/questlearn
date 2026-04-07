import { MemeStandaloneClient } from './MemeStandaloneClient';

export default async function MemeStandalonePage({
  searchParams,
}: {
  searchParams: Promise<{ topic?: string }>;
}) {
  const params = await searchParams;
  const topic = params.topic || 'Photosynthesis';

  return <MemeStandaloneClient topic={topic} />;
}
