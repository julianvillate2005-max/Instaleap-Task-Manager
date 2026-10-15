
import { database } from "../config/database.js";

export interface Usuario {
  id: string;
  nombre: string;
  email: string;
  password_hash: string;
}

export async function buscarUsuarioPorEmail(
  email: string
): Promise<Usuario | null> {
  const resultado = await database.query<Usuario>(
    `SELECT id, nombre, email, password_hash
     FROM users
     WHERE email = $1`,
    [email]
  );

  return resultado.rows[0] ?? null;
}


export async function crearUsuario(
  nombre: string,
  email: string,
  passwordHash: string
): Promise<Usuario> {
  const resultado = await database.query<Usuario>(
    `INSERT INTO users (nombre, email, password_hash)
     VALUES ($1, $2, $3)
     RETURNING id, nombre, email, password_hash`,
    [nombre, email, passwordHash]
  );

  return resultado.rows[0]!;
}
