import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError";

declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        roles: string[];
      };
    }
  }
}

export function authenticateUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const token = req.header("Autorização")?.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .json({ message: "É necessário efetuar a autenticação" });
  }

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
      roles: string[];
    };
    req.user = decodedToken;
    next();
  } catch (error) {
    res.status(401).json({ message: "Token inválido" });
  }
}

export function checkRole(role: string) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user?.roles.includes(role)) {
      return res.status(403).json({ message: "Acesso recusado" });
    }
    next();
  };
}
