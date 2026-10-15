import type { Request, Response, NextFunction } from "express";
import {
  registrarUsuario,
  iniciarSesion,
  EmailEnUsoError,
  CredencialesInvalidasError,
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


export async function login(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { email, password } = req.body;

    if (
      typeof email !== "string" ||
      typeof password !== "string"
    ) {
      res.status(400).json({
        mensaje: "Debes proporcionar un correo y una contraseña válidos.",
      });
      return;
    }

    const resultado = await iniciarSesion({ email, password });

    res.status(200).json({
      mensaje: "Inicio de sesión exitoso.",
      usuario: resultado.usuario,
      token: resultado.token,
    });
  } catch (error) {
    if (error instanceof CredencialesInvalidasError) {
      res.status(401).json({
        mensaje: error.message,
      });
      return;
    }

    next(error);
  }
}