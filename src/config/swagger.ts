import swaggerJsdoc from "swagger-jsdoc";

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

export const especificacionSwagger = swaggerJsdoc(opcionesSwagger);