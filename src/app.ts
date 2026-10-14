
import express from "express";
import dotenv from "dotenv";
import { verificarConexion } from "./config/database.js";

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

app.get("/health", (_req, res) => {
  res.status(200).json({
    status: "ok",
    message: "Task Manager API is running"
  });
});

/**
 * Comprueba la conexión con PostgreSQL
 * antes de iniciar el servidor HTTP.
 */
async function iniciarServidor(): Promise<void> {
  try {
    await verificarConexion();

    app.listen(PORT, () => {
      console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("No se pudo conectar con PostgreSQL:", error);
    process.exitCode = 1;
  }
}

iniciarServidor();
