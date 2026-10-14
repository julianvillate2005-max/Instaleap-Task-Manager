import { readFile } from "node:fs/promises";
import { database } from "../config/database.js";

/**
 * Ejecuta el esquema SQL utilizando la conexión configurada
 * por la aplicación.
 */
async function inicializarBaseDeDatos(): Promise<void> {
  try {
    const rutaEsquema = new URL("./schema.sql", import.meta.url);
    const esquema = await readFile(rutaEsquema, "utf8");

    await database.query(esquema);

    console.log("Esquema de base de datos ejecutado correctamente.");
  } catch (error) {
    console.error("No se pudo inicializar la base de datos:", error);
    process.exitCode = 1;
  } finally {
    await database.end();
  }
}

await inicializarBaseDeDatos();