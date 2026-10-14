import { database } from "../config/database.js";

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