import { Redis } from '@upstash/redis'

const redis = new Redis({
  url: 'https://valid-mouse-8559.upstash.io',
  token: 'ASFvAAImcDI3YzFjZGRkYWE4MjM0NDU0ODcxNDkzODE5ZGU4YzZjMXAyODU1OQ',
  cache: "no-store",
})

export default redis;
