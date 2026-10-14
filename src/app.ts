
import express from "express";
import { env } from "./config/env.js";
import { verificarConexion } from "./config/database.js";

const app = express();

app.use(express.json());

app.get("/health", (_req, res) => {
  res.status(200).json({
    status: "ok",
    message: "Task Manager API is running",
  });
});

/**
 * Comprueba la conexión con PostgreSQL
 * antes de iniciar el servidor HTTP.
 */
async function iniciarServidor(): Promise<void> {
  try {
    await verificarConexion();

    app.listen(env.port, () => {
      console.log(
        `Servidor ejecutándose en http://localhost:${env.port}`,
      );
    });
  } catch (error) {
    console.error("No se pudo conectar con PostgreSQL:", error);
    process.exitCode = 1;
  }
}

iniciarServidor();
