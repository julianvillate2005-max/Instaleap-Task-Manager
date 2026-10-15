
import {
  crearTarea as crearTareaRepositorio,
  listarTareasPorUsuario,
  buscarTareaPorId,
  actualizarTarea as actualizarTareaRepositorio,
  eliminarTarea as eliminarTareaRepositorio,
  type CrearTareaDTO,
  type Tarea,
} from "../persistence/task.repository.js";

/**
 * Error que indica que una tarea no existe o no pertenece al usuario
 * que intenta acceder a ella.
 */
export class TareaNoEncontradaError extends Error {
  /**
   * Crea el error con un mensaje que no revela si la tarea
   * existe para otro usuario.
   */
  constructor() {
    super("La tarea no existe o no tienes permiso para acceder a ella.");
    this.name = "TareaNoEncontradaError";
  }
}

/**
 * Crea una tarea asociada al usuario indicado.
 *
 * @param userId - Identificador del usuario propietario de la tarea.
 * @param datos - Datos necesarios para crear la tarea.
 * @returns Una promesa con la tarea creada.
 */
export async function crearTarea(
  userId: string,
  datos: CrearTareaDTO
): Promise<Tarea> {
  return crearTareaRepositorio(userId, datos);
}

/**
 * Obtiene todas las tareas pertenecientes a un usuario.
 *
 * @param userId - Identificador del usuario propietario de las tareas.
 * @returns Una promesa con la lista de tareas del usuario.
 */
export async function listarTareas(
  userId: string
): Promise<Tarea[]> {
  return listarTareasPorUsuario(userId);
}

/**
 * Busca una tarea por su identificador y verifica su pertenencia
 * al usuario indicado.
 *
 * @param userId - Identificador del usuario que solicita la tarea.
 * @param tareaId - Identificador de la tarea que se desea consultar.
 * @returns Una promesa con la tarea encontrada.
 * @throws {TareaNoEncontradaError} Si la tarea no existe o no es accesible para el usuario.
 */
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

/**
 * Actualiza los datos de una tarea del usuario indicado.
 *
 * @param userId - Identificador del usuario propietario de la tarea.
 * @param tareaId - Identificador de la tarea que se desea actualizar.
 * @param datos - Datos que se utilizarán para actualizar la tarea.
 * @returns Una promesa con la tarea actualizada.
 * @throws {TareaNoEncontradaError} Si la tarea no existe o no es accesible para el usuario.
 */
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

/**
 * Elimina una tarea perteneciente al usuario indicado.
 *
 * @param userId - Identificador del usuario propietario de la tarea.
 * @param tareaId - Identificador de la tarea que se desea eliminar.
 * @returns Una promesa que se resuelve sin devolver un valor.
 * @throws {TareaNoEncontradaError} Si la tarea no existe o no es accesible para el usuario.
 */
export async function eliminarTarea(
  userId: string,
  tareaId: string
): Promise<void> {
  const eliminada = await eliminarTareaRepositorio(userId, tareaId);

  if (!eliminada) {
    throw new TareaNoEncontradaError();
  }
}
