
import { database } from "../config/database.js";

/**
 * Estados permitidos para una tarea.
 */
export type EstadoTarea = "pendiente" | "en curso" | "completada";

/**
 * Representa una tarea almacenada en la base de datos.
 */
export interface Tarea {
  /** Identificador único de la tarea. */
  id: string;
  /** Título de la tarea. */
  titulo: string;
  /** Descripción de la tarea, si está disponible. */
  descripcion: string | null;
  /** Fecha límite de la tarea, si está definida. */
  fecha_vencimiento: Date | null;
  /** Estado actual de la tarea. */
  estado: EstadoTarea;
  /** Identificador del usuario propietario de la tarea. */
  user_id: string;
  /** Fecha de creación de la tarea. */
  created_at: Date;
}

/**
 * Datos aceptados para crear o actualizar una tarea.
 */
export interface CrearTareaDTO {
  /** Título de la tarea. */
  titulo: string;
  /** Descripción opcional de la tarea. */
  descripcion?: string | null;
  /** Fecha de vencimiento opcional en formato de texto. */
  fecha_vencimiento?: string | null;
  /** Estado opcional; por defecto se utiliza "pendiente". */
  estado?: EstadoTarea;
}

/**
 * Crea una tarea y la asocia al usuario indicado.
 *
 * @param userId - Identificador del usuario propietario.
 * @param datos - Datos de la tarea que se va a crear.
 * @returns Una promesa con la tarea creada.
 * @throws {Error} Si la consulta no devuelve la tarea creada.
 */
export async function crearTarea(
  userId: string,
  datos: CrearTareaDTO
): Promise<Tarea> {
  const resultado = await database.query<Tarea>(
    `INSERT INTO tasks
       (titulo, descripcion, fecha_vencimiento, estado, user_id)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id, titulo, descripcion, fecha_vencimiento,
               estado, user_id, created_at`,
    [
      datos.titulo,
      datos.descripcion ?? null,
      datos.fecha_vencimiento ?? null,
      datos.estado ?? "pendiente",
      userId,
    ]
  );

  const tarea = resultado.rows[0];

  if (!tarea) {
    throw new Error("No fue posible crear la tarea.");
  }

  return tarea;
}

/**
 * Recupera las tareas de un usuario, ordenadas desde la más reciente.
 *
 * @param userId - Identificador del usuario propietario.
 * @returns Una promesa con las tareas encontradas; puede ser una lista vacía.
 */
export async function listarTareasPorUsuario(
  userId: string
): Promise<Tarea[]> {
  const resultado = await database.query<Tarea>(
    `SELECT id, titulo, descripcion, fecha_vencimiento,
            estado, user_id, created_at
     FROM tasks
     WHERE user_id = $1
     ORDER BY created_at DESC`,
    [userId]
  );

  return resultado.rows;
}

/**
 * Busca una tarea que pertenezca al usuario indicado.
 *
 * @param userId - Identificador del usuario propietario.
 * @param tareaId - Identificador de la tarea que se desea consultar.
 * @returns Una promesa con la tarea encontrada o null si no existe
 * o no pertenece al usuario.
 */
export async function buscarTareaPorId(
  userId: string,
  tareaId: string
): Promise<Tarea | null> {
  const resultado = await database.query<Tarea>(
    `SELECT id, titulo, descripcion, fecha_vencimiento,
            estado, user_id, created_at
     FROM tasks
     WHERE id = $1 AND user_id = $2`,
    [tareaId, userId]
  );

  return resultado.rows[0] ?? null;
}

/**
 * Actualiza los datos de una tarea perteneciente al usuario indicado.
 *
 * @param userId - Identificador del usuario propietario.
 * @param tareaId - Identificador de la tarea que se actualizará.
 * @param datos - Nuevos datos de la tarea.
 * @returns Una promesa con la tarea actualizada o null si no existe
 * o no pertenece al usuario.
 */
export async function actualizarTarea(
  userId: string,
  tareaId: string,
  datos: CrearTareaDTO
): Promise<Tarea | null> {
  const resultado = await database.query<Tarea>(
    `UPDATE tasks
     SET titulo = $1,
         descripcion = $2,
         fecha_vencimiento = $3,
         estado = $4
     WHERE id = $5 AND user_id = $6
     RETURNING id, titulo, descripcion, fecha_vencimiento,
               estado, user_id, created_at`,
    [
      datos.titulo,
      datos.descripcion ?? null,
      datos.fecha_vencimiento ?? null,
      datos.estado ?? "pendiente",
      tareaId,
      userId,
    ]
  );

  return resultado.rows[0] ?? null;
}

/**
 * Elimina una tarea únicamente si pertenece al usuario indicado.
 *
 * @param userId - Identificador del usuario propietario.
 * @param tareaId - Identificador de la tarea que se desea eliminar.
 * @returns Una promesa que indica si se eliminó exactamente una tarea.
 */
export async function eliminarTarea(
  userId: string,
  tareaId: string
): Promise<boolean> {
  const resultado = await database.query(
    `DELETE FROM tasks
     WHERE id = $1 AND user_id = $2`,
    [tareaId, userId]
  );

  return resultado.rowCount === 1;
}
