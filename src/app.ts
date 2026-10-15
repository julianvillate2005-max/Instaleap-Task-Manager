
import express from "express";
import { env } from "./config/env.js";
import { verificarConexion } from "./config/database.js";
import authRoutes from "./api/routes/auth.routes.js";
import taskRoutes from "./api/routes/task.routes.js";
import { manejarErrores } from "./api/middlewares/error.middleware.js";
import swaggerUi from "swagger-ui-express";
import { especificacionSwagger } from "./config/swagger.js";
import path from "node:path";
import { fileURLToPath } from "node:url";

const directorioActual = path.dirname(fileURLToPath(import.meta.url));
const directorioPublico = path.join(directorioActual, "public");

const app = express();

app.use(express.json());

// Sirve los archivos personalizados de Swagger UI.
app.use("/swagger-assets", express.static(directorioPublico));

app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(especificacionSwagger, {
    customJs: "/swagger-assets/swagger-custom.js",
  })
);

app.use("/tasks", taskRoutes);
app.use("/auth", authRoutes);

/**
 * Endpoint de comprobación de disponibilidad de la API.
 *
 * @param _req - Solicitud HTTP de Express, no utilizada.
 * @param res - Respuesta HTTP que contiene el estado de la aplicación.
 */
app.get("/health", (_req, res) => {
  res.status(200).json({
    status: "ok",
    message: "Task Manager API is running",
  });
});

// Debe registrarse después de las rutas.
app.use(manejarErrores);

/**
 * Aplicación Express configurada con las rutas, la documentación
 * Swagger, el endpoint de salud y el middleware de errores.
 */
export default app;

/**
 * Comprueba la conexión con PostgreSQL antes de iniciar
 * el servidor HTTP.
 *
 * Si la conexión se establece correctamente, inicia el servidor
 * en el puerto configurado. Si ocurre un error, lo registra
 * y establece un código de salida distinto de cero.
 *
 * @returns Una promesa que se resuelve cuando termina el proceso
 * de inicialización del servidor.
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

// Inicia el servidor únicamente cuando este archivo
// se ejecuta directamente, no cuando se importa en las pruebas.
if (
  process.argv[1] &&
  path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  iniciarServidor();
}
