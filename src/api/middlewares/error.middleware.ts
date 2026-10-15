
import type { ErrorRequestHandler } from "express";
import { EmailEnUsoError, CredencialesInvalidasError } from "../../services/user.service.js";
import { TareaNoEncontradaError } from "../../services/task.service.js";

export const manejarErrores: ErrorRequestHandler = (
  error: unknown,
  _req,
  res,
  _next
): void => {
  // JSON mal formado.
  if (
    error instanceof SyntaxError &&
    "status" in error &&
    error.status === 400
  ) {
    res.status(400).json({
      mensaje: "El cuerpo de la solicitud contiene JSON inválido.",
    });
    return;
  }

  // Correo electrónico ya registrado.
  if (error instanceof EmailEnUsoError) {
    res.status(409).json({
      mensaje: error.message,
    });
    return;
  }

  // Credenciales incorrectas.
  if (error instanceof CredencialesInvalidasError) {
    res.status(401).json({
      mensaje: error.message,
    });
    return;
  }

  // Tarea inexistente o perteneciente a otro usuario.
  if (error instanceof TareaNoEncontradaError) {
    res.status(404).json({
      mensaje: error.message,
    });
    return;
  }

  // Registrar el error internamente sin exponer detalles al cliente.
  console.error("Error no controlado en la API:", error);

  res.status(500).json({
    mensaje: "Ocurrió un error interno en el servidor.",
  });
};
