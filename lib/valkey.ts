import Redis from 'ioredis';

let client: Redis | null = null;

export function getValkey(): Redis {
  if (!client) {
    const url = process.env.VALKEY_URL || process.env.REDIS_URL || 'redis://localhost:6379';
    client = new Redis(url, {
      maxRetriesPerRequest: 3,
      lazyConnect: true,
    });
    client.on('error', (err) => {
      console.error('Valkey connection error:', err);
    });
  }
  return client;
}

export async function cacheGet(key: string): Promise<string | null> {
  try {
    return await getValkey().get(key);
  } catch {
    return null;
  }
}

export async function cacheSet(key: string, value: string, ttlSeconds = 86400): Promise<void> {
  try {
    await getValkey().setex(key, ttlSeconds, value);
  } catch (err) {
    console.error('Cache set error:', err);
  }
}
