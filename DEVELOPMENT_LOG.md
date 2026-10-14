# Development Log — Instaleap Task Manager

## 1. Objetivo del registro

Documentar el proceso de desarrollo de la API, las decisiones técnicas, el uso de herramientas de inteligencia artificial, las verificaciones realizadas y los problemas encontrados durante la implementación.

## 2. Entorno de desarrollo

- Sistema operativo: Windows.
- Entorno de desarrollo: Visual Studio Code.
- Node.js: v24.20.0.
- npm: 11.19.0.
- TypeScript: configurado mediante `tsconfig.json`.
- Framework HTTP: Express.
- Base de datos: PostgreSQL 18.6.
- Control de versiones: Git.

## 3. Decisiones técnicas

### 3.1. Elección de PostgreSQL

**Decisión:** utilizar PostgreSQL como sistema de gestión de bases de datos.

**Motivo:** la prueba permite utilizar PostgreSQL o MongoDB. Se seleccionó PostgreSQL para almacenar usuarios y tareas mediante tablas relacionadas y restricciones de integridad.

**Verificación:** se confirmó la conexión al servidor PostgreSQL 18.6 y se creó la base de datos `instaleap_task_manager`.

### 3.2. Uso de TypeScript y Express

**Decisión:** utilizar TypeScript sobre Node.js con Express.

**Motivo:** Express permite construir la API HTTP y TypeScript añade comprobaciones de tipos durante el desarrollo y la compilación.

**Verificación:** `npm run build` terminó sin errores en la etapa inicial del proyecto.

### 3.3. Uso de un grupo de conexiones

**Decisión:** utilizar `Pool` del paquete `pg`.

**Motivo:** permite administrar y reutilizar conexiones con PostgreSQL.

**Verificación:** se ejecutó una consulta `SELECT NOW() AS fecha_servidor` y se recibió una respuesta del servidor.

## 4. Uso de inteligencia artificial

Se utilizó ChatGPT como apoyo para explicar conceptos, orientar la configuración del entorno y revisar la implementación paso a paso.

### 4.1. Prompts y asistencia recibida

Registrar los prompts relevantes utilizados durante el desarrollo, su resultado y la decisión tomada sobre las sugerencias recibidas.

| Prompt o solicitud | Resultado obtenido | Decisión y verificación |
|---|---|---|
| Orientación para configurar un proyecto Node.js, Express y TypeScript. | Se definieron scripts de desarrollo, compilación y ejecución. | Se ejecutó `npm run build` y terminó sin errores en la etapa inicial. |
| Orientación para instalar y configurar PostgreSQL. | Se instaló PostgreSQL 18.6 y se creó `instaleap_task_manager`. | Se verificó la versión, la conexión y la existencia de la base de datos mediante la consola de PostgreSQL. |
| Explicación y configuración del módulo de conexión con PostgreSQL. | Se creó `src/config/database.ts` con `Pool` y una función de comprobación. | La aplicación ejecutó una consulta SQL y mostró la fecha del servidor. |

Esta tabla es un resumen inicial. Los prompts exactos, las respuestas relevantes y las decisiones de aceptación o rechazo deberán ampliarse con base en las interacciones reales del proceso.

### 4.2. Evaluación crítica de las sugerencias

Las sugerencias de IA se revisan antes de incorporarlas. La validación se realiza mediante la ejecución de comandos, la compilación, las consultas a la base de datos y la revisión del comportamiento de la aplicación.

No se deben registrar como verificadas funcionalidades que todavía no se hayan implementado o probado.

## 5. Hitos completados

### Hito 1. Configuración inicial del proyecto

- Se creó el proyecto Node.js.
- Se configuró TypeScript.
- Se definieron los scripts de desarrollo, compilación y ejecución.
- Se creó la ruta `GET /health`.
- Se creó `.gitignore` para excluir archivos y secretos locales.
- Se inicializó Git y se creó el primer commit.

**Commit:** `68abdc1` — `chore: initialize Instaleap task manager project`.

### Hito 2. Configuración de PostgreSQL

- Se instaló PostgreSQL 18.6.
- Se verificó la conexión local al servidor.
- Se creó la base de datos `instaleap_task_manager`.
- Se instaló el paquete `pg` y sus definiciones de tipos.

### Hito 3. Conexión de la API con PostgreSQL

- Se creó `src/config/database.ts`.
- Se configuró un grupo de conexiones mediante `Pool`.
- Se implementó `verificarConexion()`.
- Se integró la comprobación al arranque de Express.
- Se obtuvo una respuesta satisfactoria a una consulta SQL.

**Resultado:** conexión verificada durante el arranque de la aplicación.

## 6. Retos y soluciones

### 6.1. Comando `psql` no reconocido

**Problema:** PowerShell no reconocía `psql` como comando.

**Solución:** se ejecutó el programa utilizando su ruta completa: `C:\\Program Files\\PostgreSQL\\18\\bin\\psql.exe`.

**Resultado:** se confirmó la versión PostgreSQL 18.6 y se estableció la conexión local.

### 6.2. La API no comprobaba la conexión al arrancar

**Problema:** la primera versión de `src/app.ts` iniciaba Express sin llamar a `verificarConexion()`.

**Solución:** se integró la función de comprobación antes de iniciar el servidor HTTP.

**Resultado:** la terminal mostró el mensaje de conexión establecida y la fecha del servidor.

## 7. Próximos pasos

- Crear y verificar las tablas de usuarios y tareas.
- Centralizar y validar la configuración del entorno.
- Implementar el registro y el inicio de sesión.
- Implementar autenticación JWT y autorización por propietario.
- Implementar el CRUD de tareas.
- Añadir validaciones y manejo centralizado de errores.
- Documentar los endpoints con Swagger.
- Implementar pruebas.
- Completar el README, revisar la bitácora y preparar los entregables finales.

## 8. Pendientes de documentación

- Registrar las decisiones técnicas independientes adicionales a medida que se tomen.
- Añadir prompts exactos relevantes y documentar las sugerencias aceptadas o rechazadas.
- Registrar resultados concretos de las pruebas.
- Documentar las instrucciones definitivas de instalación y ejecución.
- Registrar los commits posteriores a `68abdc1`.

## Hito: centralización y validación de la configuración

**Cambios realizados**

- Se creó `src/config/env.ts` para centralizar la carga y lectura de las variables de entorno.
- Se implementó `obtenerPuerto()` para comprobar que los puertos sean números enteros dentro del rango válido.
- Se implementó `obtenerVariableObligatoria()` para detectar variables requeridas que no existan o estén vacías.
- Se modificó `src/config/database.ts` para utilizar la configuración centralizada al crear el pool de conexiones de PostgreSQL.
- Se modificó `src/app.ts` para utilizar `env.port` y eliminar la carga duplicada de variables de entorno.

**Decisiones técnicas**

1. Centralizar la configuración en un módulo independiente para evitar que diferentes archivos gestionen las variables de entorno por separado.
2. Validar los puertos y las variables obligatorias al cargar la configuración, con el objetivo de detectar errores antes de iniciar el servidor.

**Verificaciones realizadas**

- `npm run build`: compilación completada sin errores.
- `npm run dev`: se estableció la conexión con PostgreSQL y el servidor Express inició en el puerto 3000.
- `git diff --check`: no reportó problemas de espacios en blanco.
- `git check-ignore -v .env`: confirmó que `.env` continúa excluido de Git.

**Uso de asistencia de IA**

Se utilizó ChatGPT para orientar la organización de la configuración, proponer modificaciones de código y explicar los comandos de Git y PowerShell. Los cambios se incorporaron al proyecto y se verificaron mediante la compilación y el inicio de la aplicación.

**Pendiente de completar**

- Probar explícitamente el endpoint `GET /health`.
- Probar el comportamiento cuando falta una variable obligatoria.
- Registrar los prompts exactos utilizados y la evaluación individual de las sugerencias de IA, según los requisitos de la prueba técnica.
