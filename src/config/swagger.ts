
import swaggerJsdoc from "swagger-jsdoc";

/**
 * Configuración de Swagger para generar la especificación OpenAPI
 * de Instaleap Task Manager.
 *
 * Define la información general de la API, el servidor local,
 * el esquema de autenticación Bearer mediante JWT y los archivos
 * de rutas que contienen las anotaciones OpenAPI.
 */
const opcionesSwagger: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Instaleap Task Manager API",
      version: "1.0.0",
      description:
        "API REST para gestionar usuarios y tareas, con autenticación mediante JWT.",
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Servidor local de desarrollo",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "Introduce el token JWT obtenido al iniciar sesión.",
        },
      },
    },
  },
  apis: ["./src/api/routes/*.ts"],
};

/**
 * Especificación OpenAPI generada a partir de la configuración
 * de Swagger y las anotaciones presentes en los archivos de rutas.
 *
 * Se utiliza para exponer la documentación interactiva de la API.
 */
export const especificacionSwagger = swaggerJsdoc(opcionesSwagger);
