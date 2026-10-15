
import {
  crearTarea as crearTareaRepositorio,
  listarTareasPorUsuario,
  buscarTareaPorId,
  actualizarTarea as actualizarTareaRepositorio,
  eliminarTarea as eliminarTareaRepositorio,
  type CrearTareaDTO,
  type Tarea,
} from "../persistence/task.repository.js";

export class TareaNoEncontradaError extends Error {
  constructor() {
    super("La tarea no existe o no tienes permiso para acceder a ella.");
    this.name = "TareaNoEncontradaError";
  }
}

export async function crearTarea(
  userId: string,
  datos: CrearTareaDTO
): Promise<Tarea> {
  return crearTareaRepositorio(userId, datos);
}

export async function listarTareas(
  userId: string
): Promise<Tarea[]> {
  return listarTareasPorUsuario(userId);
}

export async function obtenerTarea(
  userId: string,
  tareaId: string
): Promise<Tarea> {
  const tarea = await buscarTareaPorId(userId, tareaId);

  if (!tarea) {
    throw new TareaNoEncontradaError();
  }

  return tarea;
}

export async function actualizarTarea(
  userId: string,
  tareaId: string,
  datos: CrearTareaDTO
): Promise<Tarea> {
  const tarea = await actualizarTareaRepositorio(
    userId,
    tareaId,
    datos
  );

  if (!tarea) {
    throw new TareaNoEncontradaError();
  }

  return tarea;
}

export async function eliminarTarea(
  userId: string,
  tareaId: string
): Promise<void> {
  const eliminada = await eliminarTareaRepositorio(userId, tareaId);

  if (!eliminada) {
    throw new TareaNoEncontradaError();
  }
}
