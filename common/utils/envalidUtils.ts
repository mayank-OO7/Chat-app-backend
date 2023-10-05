import { cleanEnv, port, str } from "envalid";

export const env = cleanEnv(process.env, {
  PORT: port(),
  DB_STRING: str(),
});
