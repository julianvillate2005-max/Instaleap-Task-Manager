
import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "../../config/env.js";

export function autenticarToken(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const authorization = req.get("Authorization");

  if (!authorization || !authorization.startsWith("Bearer ")) {
    res.status(401).json({
      mensaje: "Debes proporcionar un token de autenticación.",
    });
    return;
  }

  const token = authorization.slice("Bearer ".length).trim();

  if (!token) {
    res.status(401).json({
      mensaje: "El token de autenticación está vacío.",
    });
    return;
  }

  try {
    const payload = jwt.verify(token, env.jwtSecret);

    if (
      typeof payload === "string" ||
      typeof payload.sub !== "string"
    ) {
      res.status(401).json({
        mensaje: "El token no contiene un usuario válido.",
      });
      return;
    }

    res.locals.userId = payload.sub;
    next();
  } catch {
    res.status(401).json({
      mensaje: "El token es inválido o ha expirado.",
    });
  }
}
