
import type { Request, Response, NextFunction } from "express";
import {
  registrarUsuario,
  iniciarSesion,
} from "../services/user.service.js";
import { validarRegistroUsuario } from "../utils/validation.js";

/**
 * Registra un usuario nuevo después de validar los datos recibidos.
 *
 * @param req - Solicitud HTTP que contiene los datos de registro.
 * @param res - Objeto de respuesta de Express.
 * @param next - Función que delega los errores al middleware correspondiente.
 * @returns Una promesa que se resuelve sin devolver un valor.
 */
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
    next(error);
  }
}

/**
 * Autentica a un usuario con su correo electrónico y contraseña.
 * Si las credenciales son válidas, devuelve los datos del usuario
 * y el token JWT generado por el servicio de autenticación.
 *
 * @param req - Solicitud HTTP que contiene el correo y la contraseña.
 * @param res - Objeto de respuesta de Express.
 * @param next - Función que delega los errores al middleware correspondiente.
 * @returns Una promesa que se resuelve sin devolver un valor.
 */
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
    next(error);
  }
}
