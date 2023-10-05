import { JwtPayload } from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      jwt: JwtPayload | string;
      token: string;
    }
  }
}

declare module "";
