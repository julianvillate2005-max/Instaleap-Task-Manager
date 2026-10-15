# Development Log — Instaleap Task Manager

## 1. Objetivo del registro

Documentar el proceso de desarrollo de la API, las decisiones técnicas, el uso de herramientas de inteligencia artificial, las verificaciones realizadas y los problemas encontrados durante la implementación. Este registro distingue entre verificaciones realizadas y actividades que todavía requieren evidencia.

## 2. Entorno de desarrollo

- Sistema operativo: Windows.

- Entorno de desarrollo: Visual Studio Code.

- Node.js: v24.20.0.

- npm: 11.19.0.

- TypeScript: configurado mediante `tsconfig.json`.

- Framework HTTP: Express.

- Base de datos: PostgreSQL 18.6.

- Control de versiones: Git.

- Pruebas automatizadas: Vitest y Supertest.

- Validación de entradas: AJV.

- Autenticación: bcrypt y JWT.

## 3. Decisiones técnicas

### 3.1. Elección de PostgreSQL

**Decisión:** utilizar PostgreSQL como sistema de gestión de bases de datos.

**Motivo:** la prueba permite utilizar PostgreSQL o MongoDB. Se seleccionó PostgreSQL para almacenar usuarios y tareas mediante tablas relacionadas y restricciones de integridad.

**Verificación:** se confirmó la conexión al servidor PostgreSQL 18.6, se creó la base de datos `instaleap_task_manager` y se ejecutó una consulta `SELECT NOW() AS fecha_servidor`. También se registró una comprobación de las tablas `users` y `tasks` mediante el script de comprobación del proyecto.

### 3.2. Uso de TypeScript y Express

**Decisión:** utilizar TypeScript sobre Node.js con Express.

**Motivo:** Express permite construir la API HTTP y TypeScript añade comprobaciones de tipos durante el desarrollo y la compilación.

**Verificación:** `npm run build` terminó sin errores en las verificaciones recientes del proyecto.

### 3.3. Uso de un grupo de conexiones

**Decisión:** utilizar `Pool` del paquete `pg`.

**Motivo:** permite administrar y reutilizar conexiones con PostgreSQL.

**Verificación:** se ejecutó una consulta SQL y se recibió una respuesta del servidor. La aplicación también comprobó la conexión durante el arranque, según las verificaciones registradas durante el desarrollo.

### 3.4. Separación por responsabilidades

**Decisión de implementación:** mantener separadas las rutas y middlewares HTTP, los controladores, los servicios, los repositorios de persistencia y la configuración.

**Motivo:** facilita localizar responsabilidades, probar partes de la aplicación y evitar concentrar toda la lógica en un único archivo.

**Verificación:** la estructura del proyecto incluye módulos de API, controladores, servicios, persistencia y configuración. La compilación ha terminado correctamente. La conformidad exacta de cada archivo con la estructura solicitada debe revisarse en el repositorio antes de la entrega final.

### 3.5. Aislamiento de tareas por usuario

**Decisión de implementación:** asociar las tareas con el usuario autenticado y restringir las consultas y operaciones por su identificador.

**Motivo:** cada usuario debe poder consultar y modificar únicamente sus propias tareas.

**Verificación:** las pruebas automatizadas incluyen la consulta de una tarea que no existe o no pertenece al usuario, que debe responder HTTP 404. También se verifica que la lista de tareas se solicite usando el identificador del usuario autenticado.

> **Nota sobre decisiones independientes:** las dos decisiones confirmadas por el candidato se documentan en la sección 4.3. La asistencia de IA utilizada posteriormente para desarrollar o perfeccionar esas soluciones se registra por separado.

## 4. Uso de inteligencia artificial

Se utilizó ChatGPT como apoyo para explicar conceptos, orientar la configuración del entorno, proponer y revisar modificaciones de código, interpretar errores de TypeScript, preparar pruebas y revisar comandos de Git. Las sugerencias se contrastaron con la compilación, las pruebas automatizadas y las salidas reales de la terminal. No se consideran verificadas funcionalidades únicamente por haber recibido una propuesta de código.

### 4.1. Prompts y asistencia recibida

Se registran solicitudes textuales disponibles en la interacción reciente. Las solicitudes antiguas cuyo texto exacto no se conserva se identifican como resúmenes y no como transcripciones literales.

**Solicitud 1 — validación de fechas:** “Puedes corregirlo y darme el script completo?”, acompañada del contenido de `src/utils/task.validation.ts`.

- **Qué se aceptó y por qué:** validar un formato ISO 8601 estricto y comprobar los componentes de fecha y hora, porque una fecha de vencimiento debe tener un formato inequívoco y ser válida.
- **Qué se modificó:** la primera propuesta comparaba fechas normalizadas, pero eso no comprobaba por sí solo todos los días de calendario inexistentes. Se añadió una comprobación explícita de los días del mes. Cuando TypeScript señaló que `zonaHoraria` podía ser `undefined`, se agregó una comprobación previa antes de usar `.slice()`.
- **Verificación:** `npm run build` terminó sin errores y `npm test` pasó de 22 a 23 pruebas al añadir el caso `2026-02-30T14:30:00.000Z`.

**Solicitud 2 — corrección de TypeScript:** solicitud para corregir el error que mostraba el editor después de revisar el código de validación.

- **Qué se aceptó y por qué:** conservar el esquema AJV existente, los tipos de `DatosCrearTarea` y la validación de los demás campos, evitando alterar innecesariamente el contrato del módulo.
- **Qué se modificó:** se corrigió el acceso potencialmente inseguro a `zonaHoraria` después del error `TS18048` (`possibly 'undefined'`).
- **Verificación:** la salida compartida de `npm run build` no mostró errores y la salida compartida de Vitest confirmó 23 pruebas aprobadas.

**Solicitud 3 — revisión integral de la bitácora:** “Si quiero que corrija y actualice el documento completo, respetando su estructura y registrando únicamente los cambios y verificaciones que realmente hemos realizados. Además quiero que verifiques si cumplimos con todos los requisitos o si falta algo por argumentar o documentar”.

- **Qué se aceptó y por qué:** revisar el documento completo, distinguir resultados verificados de pendientes y comparar el estado documentado con los requisitos de la prueba.
- **Qué no se presenta como terminado:** la revisión visual del README, las pruebas end-to-end contra PostgreSQL real que aún no tengan evidencia reciente y el video de entrega. Swagger en modo compilado se verificó posteriormente en la revisión final.
- **Verificación:** la revisión se basa en las salidas de terminal compartidas y en el documento de requisitos de la prueba técnica. Las comprobaciones pendientes se conservan expresamente en las secciones 7, 8, 9 y 10.

**Resumen, no transcripción literal — configuración inicial:** se solicitó ayuda para configurar Node.js, Express, TypeScript y PostgreSQL.

- **Qué se documenta:** decisiones y resultados respaldados por la bitácora previa: configuración del proyecto, base de datos, grupo de conexiones y comprobación de conectividad.
- **Límite:** no se atribuye una frase exacta a conversaciones antiguas cuyo prompt literal no está disponible en el registro revisado.
- **Verificación registrada:** los hitos de esta bitácora incluyen compilación, conexión a PostgreSQL y comprobación del esquema.

### 4.2. Evaluación crítica de las sugerencias

Las sugerencias de IA se revisaron mediante la compilación y las pruebas automatizadas. Un ejemplo concreto fue el validador de fechas: se identificó que la comparación de representaciones ISO no bastaba para garantizar que el día del calendario existiera; se modificó la validación y se añadió una prueba para el 30 de febrero. También se atendió el error de tipado que señaló TypeScript para `zonaHoraria`.

La última ejecución comunicada de `npm test` mostró **23 pruebas aprobadas** en `test/app.test.ts`. Estas pruebas HTTP usan mocks para las dependencias de persistencia; por tanto, ese resultado no equivale a una prueba de integración completa contra PostgreSQL.

La última ejecución comunicada de `npm run build` terminó sin errores. `git diff --check` había señalado espacios finales en dos líneas; después se eliminaron esos espacios y el archivo temporal `cambios_revision.txt` dejó de aparecer en `git status --short`. El commit `ee0db0c` (`test: strengthen task date validation`) se creó y se subió a `origin/master`. La actualización de esta bitácora descrita en este documento aún debe incorporarse y publicarse por separado.

### 4.3. Decisiones tomadas de manera independiente

Según lo confirmado durante el desarrollo, se registran las siguientes decisiones tomadas por iniciativa propia. La asistencia de IA utilizada posteriormente para implementar o perfeccionar las soluciones se documenta por separado y no se presenta como trabajo realizado sin asistencia.

1\. **Incorporar pruebas automatizadas para la API.**

   **Razón:** comprobar el comportamiento de los endpoints y detectar regresiones en funcionalidades como autenticación, operaciones CRUD y validación de entradas, en lugar de depender exclusivamente de pruebas manuales.

   **Evidencia:** `test/app.test.ts`; commit `d123fce` — `test: add automated API tests`. La ejecución más reciente comunicada de `npm test` finalizó con 23 pruebas aprobadas y ninguna fallida.

2\. **Reforzar la validación de fechas de vencimiento.**

   **Razón:** impedir que una fecha con un día inexistente, como el 30 de febrero, sea aceptada como si fuera una fecha válida. La validación debe comprobar tanto el formato como la existencia real de la fecha.

   **Evidencia:** `src/utils/task.validation.ts`; prueba de rechazo de `2026-02-30T14:30:00.000Z` en `test/app.test.ts`; commit `ee0db0c` — `test: strengthen task date validation`. La compilación y las 23 pruebas automatizadas pasaron después del cambio.

## 5. Hitos completados

### Hito 1. Configuración inicial del proyecto

- Se creó el proyecto Node.js.

- Se configuró TypeScript.

- Se definieron los scripts de desarrollo, compilación y ejecución.

- Se creó la ruta `GET /health`.

- Se creó `.gitignore` para excluir archivos y secretos locales.

- Se inicializó Git y se crearon commits para los cambios del proyecto.

**Commit inicial registrado:** `68abdc1` — `chore: initialize Instaleap task manager project`.

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

**Resultado:** conexión verificada durante las comprobaciones realizadas en el entorno local.

### Hito 4. Centralización y validación de la configuración

**Cambios realizados**

- Se creó `src/config/env.ts` para centralizar la carga y lectura de las variables de entorno.

- Se implementó `obtenerPuerto()` para validar puertos.

- Se implementó `obtenerVariableObligatoria()` para detectar variables requeridas ausentes o vacías.

- Se modificó `src/config/database.ts` para utilizar la configuración centralizada.

- Se modificó `src/app.ts` para utilizar `env.port`.

**Verificaciones registradas**

- `npm run build`: compilación completada sin errores.

- `npm run dev`: la aplicación se conectó con PostgreSQL y el servidor Express inició en el puerto 3000.

- `git check-ignore -v .env`: confirmó que `.env` está excluido de Git.

### Hito 5. Creación y verificación del esquema de PostgreSQL

**Cambios realizados**

- Se creó el esquema SQL para las tablas `users` y `tasks`.

- Se establecieron restricciones para los correos electrónicos, los estados de las tareas y la relación entre usuarios y tareas.

- Se añadió un índice para facilitar la consulta de tareas por usuario.

- Se crearon scripts de desarrollo para inicializar el esquema y comprobar la existencia de las tablas.

**Verificaciones registradas**

- La aplicación estableció conexión con PostgreSQL.

- Se ejecutó la inicialización del esquema.

- El script `check-database.ts` confirmó la existencia de las tablas `tasks` y `users`.

### Hito 6. Validaciones y registro de usuarios

**Cambios realizados**

- Se instaló AJV para validar datos mediante esquemas JSON.

- Se creó `src/utils/validation.ts` con la interfaz `RegistroUsuarioDTO`, un esquema de validación y la función `validarRegistroUsuario`.

- Se establecieron restricciones para el nombre, el correo electrónico y la contraseña.

- Se prepararon bcrypt y jsonwebtoken para el manejo de contraseñas y JWT.

- Se creó un script de validación manual.

**Verificaciones históricas**

- `npx tsx src/utils/test-validation.ts`: el objeto válido fue aceptado y el inválido fue rechazado.

- Se detectaron errores de longitud en el nombre y la contraseña, y un error de formato en el correo electrónico.

- `npm run build`: compilación completada sin errores.

La limitación inicial de que el validador no estaba conectado al registro se superó en un hito posterior, cuando se implementó el endpoint de registro.

### Hito 7. Implementación del registro de usuarios

**Funcionalidad implementada**

Se desarrolló `POST /auth/register` con separación entre servicio, repositorio y controlador HTTP.

**Aspectos técnicos**

- Validación de entrada mediante AJV.

- Hash de contraseñas con bcrypt antes de almacenarlas.

- Consulta por correo electrónico para evitar registros duplicados.

- Respuestas diferenciadas para registro exitoso, datos inválidos y correo ya registrado.

- Exclusión del hash de contraseña de la respuesta HTTP.

**Verificaciones registradas**

- `npm run build`: finalizó sin errores.

- Registro con datos válidos: HTTP 201.

- Registro con correo existente: HTTP 409.

- Registro con correo inválido y contraseña inferior al mínimo permitido: HTTP 400.

### Hito 8. Autenticación JWT y operaciones CRUD de tareas

**Cambios realizados**

- Se implementó `POST /auth/login`.

- Se incorporó la generación de tokens JWT con una vigencia de una hora.

- Se implementó el middleware para validar `Authorization: Bearer <token>`.

- Se protegieron las rutas de tareas.

- Se implementaron operaciones de creación, consulta, actualización y eliminación.

- Se restringieron las operaciones por el identificador del usuario autenticado.

- Se añadieron validaciones para los datos y los identificadores de las rutas.

**Verificaciones registradas**

- Inicio de sesión correcto: se obtuvo un token JWT.

- Contraseña incorrecta: HTTP 401.

- Ruta protegida sin token: HTTP 401.

- Se comprobaron operaciones CRUD mediante peticiones HTTP.

- Acceso a una tarea que no existe o no pertenece al usuario: HTTP 404.

- `npm run build`: compilación completada sin errores.

**Commit relacionado:** `751c5fa` — `feat: implement JWT authentication and task CRUD`.

### Hito 9. Manejo centralizado de errores

**Cambios realizados**

- Se incorporó `src/api/middlewares/error.middleware.ts`.

- Se registró el middleware después de las rutas.

- Se normalizaron respuestas para errores de validación, autenticación y acceso a recursos.

**Verificaciones registradas**

- JSON mal formado: HTTP 400.

- Correo duplicado durante el registro: HTTP 409.

- Credenciales incorrectas: HTTP 401.

**Commit relacionado:** `3b377fb` — `feat: centralize API error handling`.

### Hito 10. Documentación OpenAPI y Swagger UI

**Cambios realizados**

- Se instalaron `swagger-jsdoc` y `swagger-ui-express`, junto con sus definiciones de tipos.

- Se creó `src/config/swagger.ts`.

- Se documentaron rutas de autenticación y operaciones de tareas.

- Se configuró el esquema de seguridad Bearer JWT.

- Se habilitó la documentación interactiva en `/api-docs`.

- Se creó `src/public/swagger-custom.js` para copiar el campo `token` de la respuesta de inicio de sesión.

- Se configuró Express para servir el JavaScript personalizado.

- Se actualizó el proceso de compilación para copiar los archivos estáticos a `dist/public`.

**Verificaciones registradas**

- Swagger UI se abrió y mostró los grupos de autenticación y tareas.

- `/swagger-assets/swagger-custom.js` respondió HTTP 200.

- El botón personalizado mostró el mensaje `JWT copiado`.

- `npm run build` terminó sin errores.

- `Test-Path dist/public/swagger-custom.js` devolvió `True`.

**Commit relacionado:** `db363b2` — `feat: add Swagger API documentation and JWT copy button`.

**Verificación final comunicada:** al ejecutar la versión compilada con `npm start`, el servidor inició y se conectó con PostgreSQL. Se confirmó `GET /health`, la carga de `/api-docs` y el funcionamiento del botón personalizado para copiar el JWT. La verificación fue comunicada por el candidato durante la revisión final.

### Hito 11. README y configuración de entorno

**Cambios realizados**

- Se actualizaron `README.md` y `.env.example`.

- Se documentaron la descripción, arquitectura, requisitos, variables de entorno, comandos y endpoints principales.

- Se incluyeron instrucciones para mantener los secretos locales fuera del repositorio.

**Verificaciones disponibles**

- Se confirmó que `.env` está ignorado por Git.

- Se confirmó que el archivo `.env.example` contiene valores de ejemplo y no debe incluir secretos reales.

- El commit `b7c6bff` — `docs: update README and environment example` — se subió correctamente.

**Pendiente:** revisar visualmente el README en GitHub para confirmar que los caracteres acentuados se muestran correctamente y que las instrucciones coinciden con el estado actual del proyecto.

### Hito 12. Pruebas automatizadas de la API

**Cambios realizados**

- Se incorporó Vitest para ejecutar pruebas automatizadas.

- Se añadieron pruebas HTTP con Supertest en `test/app.test.ts`.

- Las pruebas cubren salud de la API, autenticación, registro, inicio de sesión, validación, y operaciones de tareas.

- Las dependencias de persistencia se simulan mediante mocks en estas pruebas.

**Verificación más reciente comunicada**

- `npm test`: un archivo de pruebas pasó y se aprobaron 23 pruebas.

- Entre los casos verificados se incluyen: ruta de salud HTTP 200, peticiones sin JWT HTTP 401, registro válido, inicio de sesión, contraseña incorrecta, creación de tareas, validación de fechas y respuestas HTTP 404 para tareas no accesibles.

- `npm run build`: terminó sin errores.

- `git diff --check`: se identificaron espacios finales en dos líneas; luego se limpiaron antes de preparar el commit.

- `git status --short`: mostró únicamente `src/utils/task.validation.ts` y `test/app.test.ts` antes del commit.

**Commit relacionado:** `d123fce` — `test: add automated API tests`.

### Hito 13. Mejora de validación de fechas de tareas

**Problema identificado**

La validación anterior comprobaba el formato y el parseo de JavaScript, pero no garantizaba por sí sola que el día existiera en el calendario. Además, TypeScript señaló que `zonaHoraria` podía ser `undefined` (`TS18048`).

**Cambios realizados**

- Se reforzó `esFechaISOValida()` para comprobar el formato ISO 8601, los componentes de la fecha y la hora y el desplazamiento horario.

- Se añadió una comprobación explícita de la cantidad de días del mes.

- Se añadió una guarda para comprobar que `zonaHoraria` exista antes de procesarla.

- Se añadió una prueba para rechazar `2026-02-30T14:30:00.000Z`.

**Verificaciones realizadas**

- `npm run build`: terminó sin errores después de corregir el error de tipado.

- `npm test`: pasó con 23 pruebas.

- La nueva prueba `POST /tasks rechaza una fecha con un día inexistente` pasó.

- `git diff --check`: inicialmente señaló espacios finales; se eliminaron antes de confirmar los cambios.

- `git commit -m "test: strengthen task date validation"` creó el commit `ee0db0c`.

- `git push origin master` terminó correctamente y actualizó `origin/master`.

**Commit relacionado:** `ee0db0c` — `test: strengthen task date validation`.

## 6. Retos y soluciones

### 6.1. Comando `psql` no reconocido

**Problema:** PowerShell no reconocía `psql` como comando.

**Solución:** se ejecutó el programa utilizando su ruta completa: `C:\Program Files\PostgreSQL\18\bin\psql.exe`.

**Resultado:** se confirmó la versión PostgreSQL 18.6 y se estableció la conexión local.

### 6.2. La API no comprobaba la conexión al arrancar

**Problema:** la primera versión de `src/app.ts` iniciaba Express sin llamar a `verificarConexion()`.

**Solución:** se integró la función de comprobación antes de iniciar el servidor HTTP.

**Resultado:** la terminal mostró el mensaje de conexión establecida y la fecha del servidor.

### 6.3. Errores de tipado en la validación de fechas

**Problema:** TypeScript indicó que `zonaHoraria` podía ser `undefined` al acceder a `.slice()`.

**Solución:** se añadió una comprobación previa para rechazar el caso en que el grupo capturado no exista.

**Resultado:** `npm run build` terminó sin errores y las pruebas automatizadas pasaron.

### 6.4. Fechas con días inexistentes

**Problema:** una validación basada únicamente en `Date` y en comparar representaciones normalizadas no demostraba que la fecha del calendario fuera real.

**Solución:** se añadió una comprobación explícita de los días válidos del mes y una prueba para el 30 de febrero.

**Resultado:** la prueba específica pasó dentro de la ejecución de 23 pruebas automatizadas.

### 6.5. Espacios finales y archivo temporal de revisión

**Problema:** `git diff --check` señaló espacios finales en dos líneas y `git status --short` mostró un archivo temporal `cambios_revision.txt`.

**Solución:** se eliminaron los espacios finales y el archivo temporal dejó de aparecer en el estado de Git.

**Resultado:** se pudo crear el commit de validación de fechas y subirlo a GitHub.

## 7. Próximos pasos

Los siguientes elementos corresponden a actividades de verificación o entrega todavía no acreditadas como completadas. Su inclusión evita presentar como comprobadas tareas para las que aún no se dispone de evidencia.

- Revisar visualmente el `README.md` en GitHub y confirmar que los caracteres acentuados se muestran correctamente y que los comandos de instalación, configuración y ejecución corresponden al estado actual.
- Si se requiere evidencia end-to-end para la evaluación, ejecutar registro, login y CRUD contra PostgreSQL real, incluyendo una prueba de aislamiento con dos usuarios identificados de forma inequívoca.
- Preparar el video explicativo solicitado, mostrando arquitectura, configuración sin revelar secretos, ejecución, autenticación, CRUD, Swagger y pruebas.
- Confirmar que el repositorio sea accesible para el evaluador y entregar el enlace junto con el video, según las instrucciones de la prueba.
- Tras revisar el diff final y confirmar que los cambios son los esperados, guardar la bitácora en un commit independiente. La publicación debe realizarse solo después de la aprobación final del candidato.

El despliegue en línea se considera opcional según la información disponible sobre la prueba y no se registra como realizado.

## 8. Pendientes de documentación y evidencia

- **Prompts históricos exactos:** se incluyen las solicitudes textuales disponibles; las solicitudes antiguas cuyo texto exacto no se conserva están identificadas como resúmenes, no como citas literales.
- **Swagger en modo compilado:** verificado en la revisión final con `npm start`; el candidato confirmó la apertura de la documentación y el funcionamiento del botón de copia del JWT.
- **Integración real con PostgreSQL:** las 23 pruebas automatizadas registradas utilizan mocks de persistencia. No deben describirse como 23 pruebas ejecutadas contra una base de datos real.
- **README:** falta la revisión visual final en GitHub y la comparación de las instrucciones con la configuración vigente.
- **JSDoc:** el filtro de declaraciones exportadas no detectó declaraciones sin un bloque JSDoc inmediatamente anterior. También se revisó detalladamente `src/controllers/task.controller.ts`; las funciones y métodos mostrados cuentan con documentación coherente con sus parámetros, retornos y responsabilidades. No se requirieron cambios en ese archivo.
- **Video explicativo:** pendiente de producir y enlazar o adjuntar.
- **Entrega final:** falta confirmar el acceso del evaluador al repositorio y enviar el enlace junto con el video.
- **Despliegue en línea:** no consta como realizado; se mantiene como opcional.
- **Publicación de esta bitácora:** la versión actual ya está integrada en el archivo local y `git diff --check` no reportó advertencias. Antes de publicarla, revisar el diff completo y decidir explícitamente cuándo crear el commit independiente.

## 9. Revisión de requisitos de la prueba técnica

Esta revisión se basa en el documento de requisitos de la prueba y en las verificaciones registradas hasta el momento. **Verificado** significa que existe evidencia comunicada; **parcial** significa que la implementación está descrita, pero falta una comprobación específica o completa.

- **Node.js, Express y TypeScript — Verificado.** La configuración y las compilaciones comunicadas fueron satisfactorias. Mantener la compilación limpia en cambios posteriores.
- **PostgreSQL — Verificado parcialmente.** Se confirmó el servidor 18.6, la base de datos y una consulta de conexión. Repetir los flujos de persistencia end-to-end si no hay evidencia reciente.
- **Separación en capas — Parcial.** La bitácora registra los módulos `src/api`, `controllers`, `services` y `persistence`. Revisar el árbol real del repositorio y confirmar que las responsabilidades están bien delimitadas.
- **`.env` y `.env.example` — Parcial/verificado en parte.** Se confirmó que `.env` está ignorado por Git y que `.env.example` se actualizó. Comparar las variables de ejemplo con las que exige `src/config/env.ts`, sin exponer secretos.
- **`POST /auth/register`, datos de usuario y hash bcrypt — Verificado según las pruebas registradas.** Hay evidencia de pruebas HTTP y registro previo de pruebas manuales. Confirmar persistencia real si no existe evidencia end-to-end reciente.
- **`POST /auth/login` y JWT — Verificado mediante pruebas automatizadas.** Se probaron credenciales correctas e incorrectas y validación del token. Repetir contra PostgreSQL real si hace falta evidencia end-to-end.
- **Middleware `Authorization: Bearer <token>` — Verificado en pruebas automatizadas.** Se cubrieron peticiones sin token, token inválido y token válido.
- **CRUD de tareas — Verificado mediante pruebas HTTP con mocks.** Confirmar las operaciones contra PostgreSQL real y registrar sus resultados.
- **Aislamiento de tareas por propietario — Parcial.** Las pruebas comprueban respuestas 404 para tareas inexistentes o inaccesibles y el uso del identificador del usuario autenticado. Si la evaluación exige persistencia real, probar con dos usuarios cuyo ID se haya verificado.
- **Campos y estados de tareas — Parcial.** El esquema documenta `titulo`, `descripcion`, `fecha_vencimiento` y los estados `pendiente`, `en curso` y `completada`. Confirmar que el identificador y la asociación con el propietario están presentes en persistencia y respuestas.
- **Validación con AJV/JSON Schema — Verificado en las pruebas registradas.** Incluye validación de registro, tareas y fechas. Revisar límites, valores opcionales o nulos y formato de correo según el contrato esperado.
- **Manejo centralizado de errores — Verificado para varios casos HTTP.** Se registraron respuestas 400, 401, 404 y 409. Revisar el tratamiento seguro de errores inesperados y que no se expongan detalles internos.
- **Swagger — Verificado en la versión compilada.** Se confirmó el arranque con `npm start`, la respuesta de `/health`, la apertura de `/api-docs` y el funcionamiento del botón personalizado de copia del JWT. La cobertura funcional de la API también está respaldada por las pruebas automatizadas.
- **JSDoc en funciones y clases importantes — Revisado.** El filtro de declaraciones exportadas no detectó funciones exportadas sin bloque JSDoc inmediatamente anterior. La revisión detallada de `src/controllers/task.controller.ts` confirmó que sus ocho funciones documentan propósito y parámetros; las funciones HTTP también describen el retorno y la delegación de errores cuando corresponde.
- **Conventional Commits — Verificado según los commits registrados.** Entre ellos: `db363b2`, `3b377fb`, `751c5fa`, `d123fce`, `b7c6bff` y `ee0db0c`. Mantener mensajes descriptivos en cambios futuros.
- **README con arquitectura, instalación, `.env` y ejecución — Parcial.** El README se actualizó. Comprobar su contenido y visualización en GitHub, incluidas las instrucciones `npm install`, configuración y `npm run dev`.
- **`DEVELOPMENT_LOG.md` y uso crítico de IA — Contenido consolidado.** Las dos decisiones independientes confirmadas se registran en la sección 4.3; también se documentan usos de IA, modificaciones y verificaciones. La bitácora está integrada en el repositorio local. git diff --check terminó sin advertencias; queda revisar el diff completo antes de publicar los cambios.
- **Retos y soluciones — Documentado.** La bitácora recoge problemas con `psql`, el arranque de la API, el tipado y la validación de fechas. Añadir únicamente otros retos reales que el candidato pueda explicar.
- **Pruebas automatizadas — Verificado según la última ejecución comunicada.** Pasaron 23 pruebas. Ampliar casos o añadir pruebas de integración es una mejora opcional.
- **Despliegue en línea — No consta como realizado.** Se mantiene como opcional según la información disponible sobre la prueba.
- **Repositorio de GitHub — Publicación verificada según el historial comunicado.** `git push origin master` actualizó el repositorio. Confirmar que el evaluador tenga acceso.
- **Video explicativo — Pendiente.** Prepararlo y entregarlo junto con el enlace del repositorio, conforme a las instrucciones de la prueba.

## 10. Estado de la última verificación

### 10.1. Resultados confirmados en la última ejecución comunicada

- **Compilación:** `npm run build` terminó sin errores.
- **Pruebas automatizadas:** `npm test` ejecutó `test/app.test.ts`; 23 pruebas aprobadas y ninguna fallida.
- **Validación de fechas:** la prueba que rechaza `2026-02-30T14:30:00.000Z` pasó.
- **Swagger compilado:** en la última verificación comunicada, el servidor inició con `npm start`, `/health` respondió correctamente, `/api-docs` abrió y el botón personalizado de copia del JWT funcionó.
- **GitHub:** el commit `ee0db0c` se publicó en `origin/master` según el registro previo.
- **JSDoc:** el filtro inicial no encontró declaraciones exportadas sin un bloque JSDoc inmediatamente anterior. Además, se revisó el contenido de `src/controllers/task.controller.ts` y se consideró correcto.
- **Estado local actual:** git status --short muestra DEVELOPMENT_LOG.md y 16 archivos TypeScript modificados. No se ha creado ni publicado un commit para estos cambios locales.

### 10.2. Pendientes reales de cierre y entrega

- `git diff --check` y `git status --short` se ejecutaron después de integrar la versión local. `git diff --check` no reportó advertencias; el estado mostró `DEVELOPMENT_LOG.md` y 16 archivos TypeScript modificados.
- La revisión del diff de la bitácora continúa: el fragmento compartido mostró el inicio del diff y el conteo `380` líneas añadidas y `185` eliminadas, pero no se ha inspeccionado aquí cada hunk del diff completo.
- Revisar el README directamente en GitHub.
- Si la prueba exige demostrar persistencia e aislamiento end-to-end, repetir las operaciones contra PostgreSQL real y con dos usuarios verificados.
- Producir el video explicativo y confirmar el acceso del evaluador al repositorio.

### 10.3. Criterio de cierre de esta bitácora

Esta versión está integrada en el archivo local `DEVELOPMENT_LOG.md`. La comprobación `git diff --check` terminó sin advertencias y el estado de Git mostró cambios locales en la bitácora y 16 archivos TypeScript. La revisión del diff completo, la inspección visual del README en GitHub y el video explicativo siguen pendientes. Las pruebas automatizadas aprobadas utilizan mocks de persistencia; si la evaluación exige evidencia end-to-end, debe verificarse el flujo contra PostgreSQL real y probar el aislamiento con dos usuarios identificados inequívocamente. No se ha creado ni publicado un commit para esta versión. La bitácora distingue entre verificaciones confirmadas y tareas de entrega aún pendientes.
