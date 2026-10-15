
import { database } from "../config/database.js";

/**
 * Verifica la existencia de las tablas `users` y `tasks`
 * en el esquema público de la base de datos.
 *
 * Consulta `information_schema.tables` y muestra por consola
 * las tablas encontradas.
 *
 * Si ocurre un error durante la consulta, registra el error
 * y establece el código de salida del proceso en `1`.
 * Finalmente, cierra la conexión con la base de datos.
 *
 * @returns Una promesa que se resuelve cuando finaliza la verificación.
 */
async function verificarTablas(): Promise<void> {
  try {
    const resultado = await database.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
        AND table_name IN ('users', 'tasks')
      ORDER BY table_name;
    `);

    console.table(resultado.rows);
  } catch (error) {
    console.error("Error al verificar las tablas:", error);
    process.exitCode = 1;
  } finally {
    await database.end();
  }
}

await verificarTablas();
