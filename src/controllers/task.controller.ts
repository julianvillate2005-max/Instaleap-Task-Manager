
import type { Request, Response, NextFunction } from "express";
import { validarCrearTarea } from "../utils/task.validation.js";
import {
  crearTarea,
  listarTareas,
  obtenerTarea,
  actualizarTarea,
  eliminarTarea,
} from "../services/task.service.js";
import type { CrearTareaDTO } from "../persistence/task.repository.js";

/**
 * Obtiene el identificador del usuario autenticado desde los datos
 * almacenados en la respuesta por el middleware de autenticación.
 *
 * @param res - Objeto de respuesta de Express.
 * @returns Identificador del usuario autenticado.
 */
function obtenerUsuarioAutenticado(res: Response): string {
  return res.locals.userId as string;
}

/**
 * Extrae y valida el identificador de una tarea desde los parámetros
 * de la solicitud.
 *
 * @param req - Solicitud HTTP de Express.
 * @returns El identificador si es un entero positivo representado como texto;
 * de lo contrario, null.
 */
function obtenerIdTarea(req: Request): string | null {
  const id = req.params.id;

  if (typeof id !== "string" || !/^[1-9]\d*$/.test(id)) {
    return null;
  }

  return id;
}

/**
 * Valida el identificador de la tarea y envía una respuesta HTTP 400
 * cuando el formato del identificador no es válido.
 *
 * @param req - Solicitud HTTP de Express.
 * @param res - Objeto de respuesta de Express.
 * @returns El identificador válido o null si la validación falla.
 */
function validarIdTarea(
  req: Request,
  res: Response
): string | null {
  const id = obtenerIdTarea(req);

  if (id === null) {
    res.status(400).json({
      mensaje: "El identificador de la tarea no es válido.",
    });

    return null;
  }

  return id;
}

/**
 * Crea una tarea para el usuario autenticado después de validar los datos.
 *
 * @param req - Solicitud que contiene los datos de la tarea en el cuerpo.
 * @param res - Objeto de respuesta de Express.
 * @param next - Función para delegar errores al middleware correspondiente.
 * @returns Una promesa que se resuelve sin devolver un valor.
 * @throws Los errores capturados se delegan a next para su tratamiento.
 */
export async function crear(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (!validarCrearTarea(req.body)) {
      res.status(400).json({
        mensaje: "Los datos de la tarea no son válidos.",
      });
      return;
    }

    const usuarioId = obtenerUsuarioAutenticado(res);
    const tarea = await crearTarea(usuarioId, req.body);

    res.status(201).json({
      mensaje: "Tarea creada correctamente.",
      tarea,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Lista las tareas asociadas al usuario autenticado.
 *
 * @param _req - Solicitud HTTP de Express, no utilizada en este controlador.
 * @param res - Objeto de respuesta de Express.
 * @param next - Función para delegar errores al middleware correspondiente.
 * @returns Una promesa que se resuelve sin devolver un valor.
 * @throws Los errores capturados se delegan a next para su tratamiento.
 */
export async function listar(
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const tareas = await listarTareas(
      obtenerUsuarioAutenticado(res)
    );

    res.status(200).json({ tareas });
  } catch (error) {
    next(error);
  }
}

/**
 * Obtiene una tarea por su identificador para el usuario autenticado.
 *
 * @param req - Solicitud HTTP que contiene el identificador en los parámetros.
 * @param res - Objeto de respuesta de Express.
 * @param next - Función para delegar errores al middleware correspondiente.
 * @returns Una promesa que se resuelve sin devolver un valor.
 * @throws Los errores capturados se delegan a next para su tratamiento.
 */
export async function obtenerPorId(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const tareaId = validarIdTarea(req, res);

    if (tareaId === null) {
      return;
    }

    const tarea = await obtenerTarea(
      obtenerUsuarioAutenticado(res),
      tareaId
    );

    res.status(200).json({ tarea });
  } catch (error) {
    next(error);
  }
}

/**
 * Actualiza una tarea del usuario autenticado después de validar
 * el identificador y los datos recibidos.
 *
 * @param req - Solicitud HTTP con el identificador y los datos de la tarea.
 * @param res - Objeto de respuesta de Express.
 * @param next - Función para delegar errores al middleware correspondiente.
 * @returns Una promesa que se resuelve sin devolver un valor.
 * @throws Los errores capturados se delegan a next para su tratamiento.
 */
export async function actualizar(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const tareaId = validarIdTarea(req, res);

    if (tareaId === null) {
      return;
    }

    if (!validarCrearTarea(req.body)) {
      res.status(400).json({
        mensaje: "Los datos de la tarea no son válidos.",
      });
      return;
    }

    const tarea = await actualizarTarea(
      obtenerUsuarioAutenticado(res),
      tareaId,
      req.body as CrearTareaDTO
    );

    res.status(200).json({
      mensaje: "Tarea actualizada correctamente.",
      tarea,
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Elimina una tarea perteneciente al usuario autenticado.
 *
 * @param req - Solicitud HTTP que contiene el identificador de la tarea.
 * @param res - Objeto de respuesta de Express.
 * @param next - Función para delegar errores al middleware correspondiente.
 * @returns Una promesa que se resuelve sin devolver un valor.
 * @throws Los errores capturados se delegan a next para su tratamiento.
 */
export async function eliminar(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const tareaId = validarIdTarea(req, res);

    if (tareaId === null) {
      return;
    }

    await eliminarTarea(
      obtenerUsuarioAutenticado(res),
      tareaId
    );

    res.status(200).json({
      mensaje: "Tarea eliminada correctamente.",
    });
  } catch (error) {
    next(error);
  }
}
