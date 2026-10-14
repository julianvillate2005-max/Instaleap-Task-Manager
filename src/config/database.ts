
import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

/**
 * Pool de conexiones reutilizables a PostgreSQL.
 * Evita abrir una conexión nueva para cada consulta.
 */
export const database = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT) || 5432,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
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
