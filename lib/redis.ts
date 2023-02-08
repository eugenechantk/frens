import { Redis } from '@upstash/redis'

let _redis: Redis

function createRedis() {
  if (!_redis) {
    _redis = new Redis({
      url: process.env.NEXT_PUBLIC_UPSTASH_REDIS_REST_URL!,
      token: process.env.NEXT_PUBLIC_UPSTASH_REDIS_REST_TOKEN!,
    })
  }
  return _redis
}

export const redis = createRedis();