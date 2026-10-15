
import { database } from "../config/database.js";

export type EstadoTarea = "pendiente" | "en curso" | "completada";

export interface Tarea {
  id: string;
  titulo: string;
  descripcion: string | null;
  fecha_vencimiento: Date | null;
  estado: EstadoTarea;
  user_id: string;
  created_at: Date;
}

export interface CrearTareaDTO {
  titulo: string;
  descripcion?: string | null;
  fecha_vencimiento?: string | null;
  estado?: EstadoTarea;
}

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
