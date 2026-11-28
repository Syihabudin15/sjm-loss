const allowedGroups = (process.env.WA_GROUP_ALLOWED || "")
  .split(",")
  .map((group) => group.trim())
  .filter(Boolean);

export const config = {
  port: Number(process.env.WA_PORT || 6002),
  appPort: process.env.PORT || process.env.APP_PORT || 6001,
  secret: process.env.WA_WORKER_SECRET || "",
  authDir: "./wa-worker/auth_session",
  allowedGroups,
  phoneNumber: process.env.WA_PHONE_NUMBER,
};
