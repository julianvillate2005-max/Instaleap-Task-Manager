
import type { Request, Response, NextFunction } from "express";
import {
  registrarUsuario,
  EmailEnUsoError,
} from "../services/user.service.js";
import { validarRegistroUsuario } from "../utils/validation.js";

export async function registrar(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  if (!validarRegistroUsuario(req.body)) {
    res.status(400).json({
      mensaje: "Los datos de registro no son válidos.",
      errores: validarRegistroUsuario.errors,
    });
    return;
  }

  try {
    const usuario = await registrarUsuario(req.body);

    res.status(201).json({
      mensaje: "Usuario registrado correctamente.",
      usuario,
    });
  } catch (error) {
    if (error instanceof EmailEnUsoError) {
      res.status(409).json({
        mensaje: error.message,
      });
      return;
    }

    next(error);
  }
}
