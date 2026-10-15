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
- `bcrypt` para el hash de contraseñas
- `jsonwebtoken` para la autenticación JWT
- `dotenv` para la configuración mediante variables de entorno
- AJV para la validación de datos
- Swagger y OpenAPI para la documentación de la API
- Vitest y Supertest para las pruebas automatizadas
- Git para el control de versiones

## Funcionalidades implementadas

- Registro de usuarios mediante `POST /auth/register`.
- Inicio de sesión mediante `POST /auth/login`.
- Almacenamiento de contraseñas mediante hash con bcrypt.
- Generación y validación de tokens JWT con una vigencia de una hora.
- Protección de las rutas de tareas mediante autenticación.
- Creación, consulta, actualización y eliminación de tareas.
- Restricción del acceso a las tareas según el usuario autenticado.
- Validación de los datos de entrada.
- Manejo centralizado de errores HTTP.
- Conexión con PostgreSQL mediante un grupo de conexiones (`Pool`).
- Endpoint de comprobación `GET /health`.
- Documentación interactiva con Swagger UI en `/api-docs`.
- Botón personalizado para copiar el JWT desde la respuesta de inicio de sesión.
- Pruebas automatizadas de endpoints, autenticación, validaciones y operaciones CRUD.

## Arquitectura

El proyecto se organiza por responsabilidades:

- `src/api`: rutas y middlewares HTTP.
- `src/controllers`: recepción y gestión de solicitudes.
- `src/services`: lógica de negocio.
- `src/persistence`: acceso a los datos y esquema SQL.
- `src/config`: configuración y conexión con servicios externos.
- `src/public`: archivos estáticos personalizados de Swagger.
- `test`: pruebas automatizadas de la API.

## Requisitos previos

- Node.js y npm.
- PostgreSQL.
- Git.

## Instalación

Clona el repositorio:

```bash
git clone https://github.com/julianvillate2005-max/Instaleap-Task-Manager.git
cd Instaleap-Task-Manager
```

Instala las dependencias:

```bash
npm install
```

Crea un archivo `.env` en la raíz del proyecto tomando como referencia `.env.example` y configura las variables para tu entorno local.

## Variables de entorno

La aplicación utiliza las siguientes variables:

| Variable | Descripción |
|---|---|
| `PORT` | Puerto HTTP de la API; por defecto, 3000. |
| `NODE_ENV` | Entorno de ejecución. |
| `DB_HOST` | Dirección del servidor PostgreSQL. |
| `DB_PORT` | Puerto de PostgreSQL; por defecto, 5432. |
| `DB_NAME` | Nombre de la base de datos. |
| `DB_USER` | Usuario de PostgreSQL. |
| `DB_PASSWORD` | Contraseña del usuario de PostgreSQL. |
| `JWT_SECRET` | Clave secreta utilizada para firmar y verificar los tokens JWT. |

No incluyas contraseñas, tokens ni secretos reales en el repositorio.

Antes de iniciar la aplicación, asegúrate de que PostgreSQL esté disponible y que la base de datos y las tablas requeridas estén creadas.

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

La aplicación inicia en `http://localhost:3000`, salvo que se configure otro puerto mediante `PORT`.

## Pruebas automatizadas

Ejecuta:

```bash
npm test
```

Las pruebas actuales utilizan Vitest y Supertest. Incluyen comprobaciones de respuestas HTTP, validaciones, autenticación JWT y operaciones CRUD con repositorios simulados.

**Importante:** estas pruebas no sustituyen las pruebas de integración contra una base de datos PostgreSQL real.

## Endpoints principales

| Método | Ruta | Descripción |
|---|---|---|
| `GET` | `/health` | Comprueba el estado básico de la API. |
| `POST` | `/auth/register` | Registra un usuario. |
| `POST` | `/auth/login` | Autentica al usuario y devuelve un JWT. |
| `GET` | `/tasks` | Lista las tareas del usuario autenticado. |
| `POST` | `/tasks` | Crea una tarea. |
| `GET` | `/tasks/:id` | Consulta una tarea propia. |
| `PUT` | `/tasks/:id` | Actualiza una tarea propia. |
| `DELETE` | `/tasks/:id` | Elimina una tarea propia. |

Las rutas de tareas requieren el encabezado de autorización:

```http
Authorization: Bearer <token>
```

## Documentación interactiva

Con el servidor en ejecución, abre:

[http://localhost:3000/api-docs](http://localhost:3000/api-docs)

Desde Swagger UI puedes consultar los endpoints documentados y probar las solicitudes.

## Seguridad y manejo de errores

- Las contraseñas se almacenan mediante hash.
- Las rutas de tareas requieren un JWT válido.
- Las consultas de tareas se restringen al usuario autenticado.
- Los datos recibidos se validan antes de ejecutar las operaciones.
- Las respuestas HTTP distinguen errores de validación, autenticación y recursos inexistentes.

## Control de versiones

El proyecto utiliza Git y commits descriptivos siguiendo la convención Conventional Commits.

## Registro de desarrollo

El archivo `DEVELOPMENT_LOG.md` documenta las decisiones técnicas, las verificaciones realizadas, los problemas encontrados y el uso de herramientas de inteligencia artificial durante el desarrollo.