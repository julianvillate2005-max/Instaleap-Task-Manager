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

- Completar las pruebas automatizadas de la API.
- Verificar el comportamiento de Swagger UI al ejecutar la versión compilada con `npm start`.
- Revisar y completar las instrucciones de instalación y ejecución del README.
- Ampliar el registro de prompts y la evaluación de las sugerencias de inteligencia artificial.
- Revisar los requisitos restantes de la prueba técnica y preparar los entregables finales.

## 8. Pendientes de documentación

- Registrar los prompts exactos relevantes y la evaluación individual de las sugerencias de IA, según la evidencia disponible.
- Completar y documentar las pruebas automatizadas de la API.
- Verificar Swagger UI mediante la versión compilada con npm start.
- Revisar y completar las instrucciones definitivas de instalación y ejecución en el README.
- Revisar los requisitos restantes de la prueba técnica y preparar los entregables finales.

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

## Hito: creación y verificación del esquema de PostgreSQL

**Cambios realizados**

- Se creó el esquema SQL para las tablas `users` y `tasks`.
- Se establecieron restricciones para los correos electrónicos, los estados de las tareas y la relación entre usuarios y tareas.
- Se añadió un índice para facilitar la consulta de tareas por usuario.
- Se crearon scripts de desarrollo para inicializar el esquema y comprobar la existencia de las tablas.

**Verificaciones realizadas**

- La aplicación estableció una conexión con PostgreSQL.
- Se ejecutó la inicialización del esquema.
- El script `check-database.ts` confirmó la existencia de las tablas `tasks` y `users`.

**Decisiones técnicas**

- Se eligió PostgreSQL como sistema de gestión de base de datos.
- Se estableció una relación entre usuarios y tareas mediante una clave foránea.
- Se definió un conjunto limitado de estados válidos para las tareas.

**Pendiente**

- Implementar el registro y el inicio de sesión.
- Incorporar el hash de contraseñas y la autenticación JWT.
- Añadir pruebas automatizadas para la persistencia y la autenticación.

## Hito: incorporación de validaciones para el registro de usuarios

### Cambios realizados

- Se instaló AJV para validar datos mediante esquemas JSON.
- Se instaló bcrypt para preparar el manejo seguro de contraseñas.
- Se instaló jsonwebtoken para preparar la implementación de autenticación mediante JWT.
- Se creó `src/utils/validation.ts` con la interfaz `RegistroUsuarioDTO`, el esquema de validación y la función `validarRegistroUsuario`.
- Se establecieron restricciones para el nombre, el correo electrónico y la contraseña.
- Se configuró una validación básica del formato del correo electrónico mediante una expresión regular.
- Se creó `src/utils/test-validation.ts` para ejecutar comprobaciones manuales con datos válidos e inválidos.

### Decisiones técnicas

1. Utilizar AJV y un esquema JSON para centralizar las reglas de validación y facilitar su reutilización en el registro de usuarios.
2. Rechazar propiedades adicionales mediante `additionalProperties: false`, para limitar los campos aceptados por el esquema.
3. Definir una longitud máxima de 72 caracteres para la contraseña, teniendo en cuenta las limitaciones de bcrypt y la necesidad de establecer una política de contraseñas coherente.

### Verificaciones realizadas

- `npx tsx src/utils/test-validation.ts`: el objeto válido fue aceptado y el inválido fue rechazado.
- Se detectaron errores de longitud en el nombre y la contraseña, y un error de formato en el correo electrónico.
- `npm run build`: compilación de TypeScript completada sin errores.
- `git diff --check`: no reportó errores de espacios en blanco; únicamente aparecieron advertencias relacionadas con finales de línea LF/CRLF en archivos de configuración.

### Limitaciones actuales

- La función de validación todavía no está conectada al endpoint `POST /auth/register`.
- La expresión regular comprueba un formato básico, pero no demuestra que el correo electrónico exista.
- La prueba de validación es un script manual; todavía no se ha integrado un framework de pruebas automatizadas.
- La instalación de bcrypt y jsonwebtoken no significa que el registro, el hash de contraseñas o la autenticación JWT estén implementados.

### Uso de inteligencia artificial

Se utilizó ChatGPT para explicar AJV, TypeScript, JSON Schema y las reglas de validación; orientar la implementación y ayudar a interpretar los resultados de las pruebas. Se revisaron la compilación y el comportamiento del script de validación.

Los prompts exactos y la evaluación individual de las sugerencias deben completarse utilizando el historial real de la interacción, sin presentar resúmenes como si fueran transcripciones literales.

### Pendientes

- Integrar la validación con el controlador del registro.
- Implementar el registro de usuarios y la persistencia en PostgreSQL.
- Aplicar bcrypt al almacenamiento de contraseñas.
- Añadir pruebas automatizadas.
- Registrar los resultados de las siguientes verificaciones y los commits correspondientes.

## Hito: implementación y pruebas del registro de usuarios

**Funcionalidad implementada**

Se desarrolló el endpoint `POST /auth/register` utilizando Express y TypeScript. La lógica de negocio se separó en un servicio y las consultas a PostgreSQL se organizaron en un repositorio.

**Aspectos técnicos**

- Validación de los datos de entrada mediante AJV y un esquema JSON.
- Hash de contraseñas con bcrypt antes de almacenarlas.
- Consulta de usuarios por correo electrónico para evitar registros duplicados.
- Respuestas HTTP diferenciadas para registro exitoso, datos inválidos y correo ya registrado.
- Exclusión del hash de contraseña de la respuesta HTTP.

**Verificaciones realizadas**

- `npm run build`: finalizó sin errores.
- Registro con datos válidos: respondió correctamente con HTTP 201.
- Registro con un correo existente: respondió HTTP 409.
- Registro con correo inválido y contraseña inferior al mínimo permitido: respondió HTTP 400.

**Uso de herramientas de IA**

Se utilizó asistencia de IA para orientar la implementación de la validación, el repositorio de usuarios, el servicio de registro y el controlador HTTP. El código se compiló y el endpoint se probó mediante peticiones HTTP desde PowerShell.

**Pendientes**

Continuar con el inicio de sesión, la autenticación mediante JWT, la protección de rutas y las operaciones CRUD de tareas. Completar el registro de prompts exactos y las decisiones de aceptación o rechazo de sugerencias de IA según la evidencia disponible.

---

## Hito: autenticación JWT y operaciones CRUD de tareas

### Cambios realizados

- Se implementó el inicio de sesión mediante `POST /auth/login`.
- Se incorporó la generación de tokens JWT con una vigencia de una hora.
- Se implementó el middleware de autenticación para validar el encabezado `Authorization: Bearer <token>`.
- Se protegieron las rutas de tareas mediante autenticación.
- Se implementaron las operaciones de creación, consulta, actualización y eliminación de tareas.
- Se restringió el acceso a las tareas mediante el identificador del usuario autenticado, evitando que un usuario consulte o modifique las tareas de otro.
- Se incorporaron validaciones para los datos de las tareas y para los identificadores recibidos en las rutas.

### Verificaciones realizadas

- Inicio de sesión correcto: se obtuvo un token JWT.
- Contraseña incorrecta: respuesta HTTP 401.
- Solicitud a una ruta protegida sin token: respuesta HTTP 401.
- Operaciones CRUD de tareas: se comprobaron respuestas satisfactorias.
- Acceso a tareas pertenecientes a otro usuario: respuesta HTTP 404.
- Consulta de una tarea inexistente: respuesta HTTP 404.
- `npm run build`: compilación completada sin errores.

### Commit relacionado

`751c5fa` — `feat: implement JWT authentication and task CRUD`

---

## Hito: manejo centralizado de errores

### Cambios realizados

- Se incorporó el middleware centralizado de errores en `src/api/middlewares/error.middleware.ts`.
- Se configuró su registro después de las rutas de la aplicación.
- Se normalizaron las respuestas para determinados errores de validación, autenticación y acceso a recursos.

### Verificaciones realizadas

- JSON mal formado: respuesta HTTP 400.
- Correo duplicado durante el registro: respuesta HTTP 409.
- Credenciales incorrectas: respuesta HTTP 401.
- `git diff --check`: no reportó errores de espacios en blanco en la revisión correspondiente.

### Commit relacionado

`3b377fb` — `feat: centralize API error handling`

---

## Hito: documentación OpenAPI e integración de Swagger UI

### Cambios realizados

- Se instalaron `swagger-jsdoc` y `swagger-ui-express`, junto con sus definiciones de tipos.
- Se creó `src/config/swagger.ts` para configurar la especificación OpenAPI.
- Se documentaron las rutas de autenticación y las operaciones de tareas.
- Se configuró el esquema de seguridad Bearer JWT en Swagger UI.
- Se habilitó la documentación interactiva en `/api-docs`.
- Se creó `src/public/swagger-custom.js` para incorporar un botón personalizado que copia únicamente el campo `token` de la respuesta del inicio de sesión.
- Se configuró Express para servir el archivo JavaScript personalizado.
- Se actualizó el proceso de compilación para copiar los archivos estáticos de Swagger a `dist/public`.

### Verificaciones realizadas

- La documentación interactiva se abrió en Swagger UI y se mostraron los grupos de autenticación y tareas.
- La petición a `/swagger-assets/swagger-custom.js` respondió HTTP 200.
- El botón personalizado mostró el mensaje `JWT copiado`.
- `npm run build` terminó sin errores después de incorporar la copia de archivos estáticos.
- `Test-Path dist/public/swagger-custom.js` devolvió `True`.
- `git diff --check` no reportó errores de espacios en blanco; aparecieron advertencias relacionadas con los finales de línea LF/CRLF de Windows.

### Commit relacionado

`db363b2` — `feat: add Swagger API documentation and JWT copy button`

### Pendientes de verificación

- Confirmar que el botón personalizado funciona al ejecutar la versión compilada con `npm start`.
- Completar las pruebas automatizadas y documentar sus resultados.
- Revisar los requisitos restantes de la prueba técnica antes de preparar la entrega final.

---

## Registro de uso de inteligencia artificial

Se utilizó ChatGPT como apoyo para explicar conceptos, proponer modificaciones de código, orientar las pruebas manuales y revisar los resultados de los comandos de compilación y Git.

Las sugerencias se incorporaron después de revisar el código y comprobar su comportamiento. Los resultados se documentaron con base en las verificaciones realizadas, manteniendo como pendientes las pruebas que todavía no cuentan con confirmación.

Los prompts exactos y la evaluación individual de las sugerencias deben ampliarse a partir del historial real de la interacción, sin presentar resúmenes como transcripciones literales.