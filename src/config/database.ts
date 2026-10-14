
import { Pool } from "pg";
import { env } from "./env.js";

/**
 * Pool de conexiones reutilizables a PostgreSQL.
 */
export const database = new Pool({
  host: env.database.host,
  port: env.database.port,
  database: env.database.name,
  user: env.database.user,
  password: env.database.password,
});

/**
 * Comprueba que la aplicación pueda conectarse a PostgreSQL.
 */
export async function verificarConexion(): Promise<void> {
  const client = await database.connect();

  try {
    const resultado = await client.query("SELECT NOW() AS fecha_servidor");

    console.log("Conexión con PostgreSQL establecida.");
    console.log("Fecha del servidor:", resultado.rows[0].fecha_servidor);
  } finally {
    client.release();
  }
}
