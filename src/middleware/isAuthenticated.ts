import { User } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { findUserByEmail } from "../services/user.services";

export const isAuthenticated = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let user: User | null = null;
    if (!req.body.id_token) {
      res.status(400).json({ status: "FAIL", message: "no access token!" });
    } else {
      const token = req.body.id_token;
      const payload = jwt.decode(token) as JwtPayload;
      if (payload.email) {
        console.log(payload.email);
        user = await findUserByEmail(payload.email); // in case of oauth
      }
      if (user) {
        req.User = user;
      }
      next();
    }
  } catch (err: any) {
    res.status(400).json({ status: "FAIL", message: `${err.name}` });
  }
};
