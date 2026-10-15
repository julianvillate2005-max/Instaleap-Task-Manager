
import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "../../config/env.js";


/**
 * Middleware de Express que autentica las solicitudes mediante un token JWT.
 *
 * Comprueba que exista un encabezado Authorization con el esquema Bearer,
 * verifica el token y almacena el identificador del usuario en res.locals.
 * Si la autenticación es válida, permite continuar con next().
 *
 * @param req - Solicitud HTTP que contiene el encabezado Authorization.
 * @param res - Respuesta de Express utilizada para almacenar el usuario autenticado
 * o devolver una respuesta HTTP 401 cuando el token no es válido.
 * @param next - Función que permite continuar con el siguiente middleware
 * o controlador.
 * @returns No devuelve un valor; continúa la cadena de middleware o responde
 * con un error de autenticación.
 */

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
