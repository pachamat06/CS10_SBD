const Redis = require("ioredis");

const redis = new Redis(process.env.REDIS_URL);

redis.on("connect", () => console.log("Berhasil terhubung ke Redis Server"));
redis.on("error", (err) => console.error("Gagal terhubung ke Redis:", err.message));

module.exports = redis;