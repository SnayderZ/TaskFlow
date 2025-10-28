import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
  userId?: number;
}

export function authMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ error: "Falta token de autorización" });

  const [type, token] = header.split(" ");
  if (type !== "Bearer" || !token) return res.status(401).json({ error: "Token inválido" });

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET as string) as { id: number };
    req.userId = payload.id;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Token no válido o expirado" });
  }
}
