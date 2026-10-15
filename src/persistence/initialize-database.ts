
import { readFile } from "node:fs/promises";
import { database } from "../config/database.js";

/**
 * Inicializa la base de datos ejecutando el esquema SQL definido
 * en el archivo `schema.sql`.
 *
 * Lee el archivo, ejecuta las instrucciones SQL mediante la conexión
 * configurada y cierra la conexión al finalizar, incluso si ocurre
 * un error durante el proceso.
 *
 * Si la inicialización falla, registra el error y establece el código
 * de salida del proceso en `1`.
 *
 * @returns Una promesa que se resuelve cuando termina la inicialización.
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
