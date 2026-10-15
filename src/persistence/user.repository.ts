
import { database } from "../config/database.js";

/**
 * Representa un usuario almacenado en la base de datos.
 */
export interface Usuario {
  /** Identificador único del usuario. */
  id: string;
  /** Nombre del usuario. */
  nombre: string;
  /** Correo electrónico registrado. */
  email: string;
  /** Hash de la contraseña almacenado para la autenticación. */
  password_hash: string;
}

/**
 * Busca un usuario mediante su correo electrónico.
 *
 * @param email - Correo electrónico que se desea consultar.
 * @returns Una promesa con el usuario encontrado o null si no existe.
 */
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

/**
 * Crea un usuario y almacena el hash de su contraseña.
 *
 * @param nombre - Nombre del usuario.
 * @param email - Correo electrónico del usuario.
 * @param passwordHash - Hash de la contraseña, calculado antes de llamar al repositorio.
 * @returns Una promesa con el usuario creado.
 */
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
