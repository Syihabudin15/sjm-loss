module.exports = {
  apps: [
    {
      name: "sjm-sipp",
      script: "node_modules/next/dist/bin/next",
      args: "start",
      instances: 2, // ⬅️ WAJIB 1
      exec_mode: "cluster", // ⬅️ lebih hemat daripada cluster
      autorestart: true,
      watch: false,
      max_memory_restart: "768M",
      env: {
        NODE_ENV: "production",
        PORT: 6001,
        NEXT_SERVER_ACTIONS_ENCRYPTION_KEY:
          "VS5JQq6Nsu73wVZEF4j4BFGMEzymKgD3XNZ0eL+BDCU=",
        WA_PORT: 6002,
        WA_WORKER_SECRET: "wa-secret",
      },
    },
    {
      name: "sjm-wa-worker",
      script: "wa-worker/index.mjs",
      instances: 1,
      exec_mode: "fork",
      autorestart: true,
      watch: false,
      max_memory_restart: "300M",
      env: {
        PORT: 6001,
        NODE_ENV: "production",
        WA_PORT: 6002,
        WA_WORKER_SECRET: "wa-secret",
        WA_DEFAULT_ID: "120363432282929126@g.us",
        WA_GROUP_ALLOWED: "120363432282929126@g.us,120363406964279192@g.us",
      },
    },
    {
      name: "sjm-cron-worker",
      script: "cron-worker/index.mjs",
      instances: 1,
      exec_mode: "fork",
      autorestart: true,
      watch: false,
      max_memory_restart: "300M",
      env: {
        NODE_ENV: "production",
        TZ: "Asia/Jakarta",
      },
    },
  ],
};
