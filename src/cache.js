import Redis from "ioredis";

const localConnString = "redis://default:redispw@localhost:32768";

const prodConnString = process.env.REDIS_URL;

const isProd = process.env.NODE_ENV === "production";

let connStr = isProd ? prodConnString : localConnString;
console.log({ connStr });

const redis = new Redis(connStr);

export const cacheIt = async (key, fn) => {
  let value = await redis.get(key);
  if (value) {
    value = JSON.parse(value);
    return value;
  }

  value = await Promise.resolve(fn());
  redis.set(key, JSON.stringify(value));
  return value;
};
