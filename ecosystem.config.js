module.exports = {
  apps: [
    {
      name: "sjm-sipp",
      script: "node_modules/next/dist/bin/next",
      args: "start",
      instances: 1, // ⬅️ WAJIB 1
      exec_mode: "fork", // ⬅️ lebih hemat daripada cluster
      autorestart: true,
      watch: false,
      max_memory_restart: "500M",
      env: {
        NODE_ENV: "production",
        PORT: 6001,
        NEXT_SERVER_ACTIONS_ENCRYPTION_KEY:
          "VS5JQq6Nsu73wVZEF4j4BFGMEzymKgD3XNZ0eL+BDCU=",
      },
    },
  ],
};
