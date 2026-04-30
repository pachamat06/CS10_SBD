const Redis = require("ioredis");

const redis = new Redis({
    host: "127.0.0.1",
    port: 6379,
    });

    redis.on("connect", () => {
    console.log("Berhasil terhubung ke Redis Server");
    });

    redis.on("error", (err) => {
    console.error("Gagal terhubung ke Redis:", err.message);
    });

    module.exports = redis;