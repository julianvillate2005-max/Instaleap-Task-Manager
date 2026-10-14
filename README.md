# Instaleap Task Manager

API REST para la gestión de tareas personales, desarrollada como parte de una prueba técnica para una oportunidad de aprendizaje en desarrollo backend.

## Objetivo

Construir una API que permita registrar usuarios, autenticar sus sesiones y administrar tareas personales mediante operaciones CRUD, garantizando que cada usuario pueda acceder únicamente a sus propias tareas.

## Tecnologías

- Node.js
- Express
- TypeScript
- PostgreSQL
- `pg` para la conexión con PostgreSQL
- `dotenv` para la configuración mediante variables de entorno
- Git para el control de versiones

## Estado del proyecto

Actualmente se dispone de:

- Servidor Express con una ruta de comprobación `GET /health`.
- Configuración inicial de TypeScript.
- Conexión configurada con PostgreSQL mediante un grupo de conexiones (`Pool`).
- Comprobación de conectividad mediante una consulta SQL.
- Variables de entorno para la configuración local.
- Repositorio Git inicializado y primer commit creado.

Las funcionalidades de autenticación, gestión de tareas, validaciones, documentación de endpoints y pruebas están pendientes de implementación y verificación.

## Arquitectura prevista

El proyecto se organizará por responsabilidades:

- `src/api`: rutas y middlewares HTTP.
- `src/controllers`: recepción y gestión de solicitudes.
- `src/services`: lógica de negocio.
- `src/persistence`: acceso a los datos.
- `src/config`: configuración y conexión a servicios externos.

## Requisitos previos

- Node.js y npm.
- PostgreSQL.
- Git.

## Instalación

Clona el repositorio o abre la carpeta del proyecto y ejecuta:

```bash
npm install
```

Crea un archivo `.env` en la raíz del proyecto tomando como referencia `.env.example` y completa las variables con la configuración local de PostgreSQL.

## Variables de entorno

El proyecto utiliza las siguientes variables:

- `PORT`: puerto HTTP de la API.
- `NODE_ENV`: entorno de ejecución.
- `DB_HOST`: dirección del servidor PostgreSQL.
- `DB_PORT`: puerto de PostgreSQL.
- `DB_NAME`: nombre de la base de datos.
- `DB_USER`: usuario de PostgreSQL.
- `DB_PASSWORD`: contraseña del usuario de PostgreSQL.

No incluyas contraseñas ni secretos reales en el repositorio.

## Ejecución en desarrollo

```bash
npm run dev
```

## Compilación

```bash
npm run build
```

## Ejecución de la versión compilada

```bash
npm start
```

## Endpoint de comprobación

`GET /health`

Devuelve el estado básico de la API. La conexión a PostgreSQL también se comprueba durante el arranque de la aplicación.

## Funcionalidades previstas

- Registro e inicio de sesión con contraseñas almacenadas mediante hash y autenticación con JWT.
- Crear, consultar, actualizar y eliminar tareas.
- Asociar cada tarea con su propietario.
- Validar los datos de entrada y centralizar el manejo de errores.
- Documentar los endpoints mediante Swagger.
- Incorporar pruebas y registrar el proceso de desarrollo.

## Control de versiones

Se utilizarán commits descriptivos siguiendo la convención Conventional Commits.

## Registro de desarrollo

El archivo `DEVELOPMENT_LOG.md` documentará el proceso de implementación, el uso de herramientas de IA, las decisiones técnicas, las verificaciones y los retos encontrados.