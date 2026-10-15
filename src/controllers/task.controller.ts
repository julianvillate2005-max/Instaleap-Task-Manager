
import type { Request, Response, NextFunction } from "express";
import { validarCrearTarea } from "../utils/task.validation.js";
import {
  crearTarea,
  listarTareas,
  obtenerTarea,
  actualizarTarea,
  eliminarTarea,
  TareaNoEncontradaError,
} from "../services/task.service.js";
import type { CrearTareaDTO } from "../persistence/task.repository.js";

function obtenerUsuarioAutenticado(res: Response): string {
  return res.locals.userId as string;
}


function obtenerIdTarea(req: Request): string | null {
  const id = req.params.id;

  if (typeof id !== "string" || !/^[1-9]\d*$/.test(id)) {
    return null;
  }

  return id;
}


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
    if (error instanceof TareaNoEncontradaError) {
      res.status(404).json({ mensaje: error.message });
      return;
    }

    next(error);
  }
}

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
    if (error instanceof TareaNoEncontradaError) {
      res.status(404).json({ mensaje: error.message });
      return;
    }

    next(error);
  }
}

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
    if (error instanceof TareaNoEncontradaError) {
      res.status(404).json({ mensaje: error.message });
      return;
    }

    next(error);
  }
}
