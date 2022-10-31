import { User } from "@prisma/client";
import { Express } from "express";

// Extending the Request type in express
declare global {
  namespace Express {
    interface Request {
      User?: User;
    }
  }
}
