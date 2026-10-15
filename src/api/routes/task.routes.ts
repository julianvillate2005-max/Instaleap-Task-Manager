import { Router } from "express";
import { autenticarToken } from "../middlewares/auth.middleware.js";
import {
  crear,
  listar,
  obtenerPorId,
  actualizar,
  eliminar,
} from "../../controllers/task.controller.js";

const router = Router();

/**
 * @openapi
 * tags:
 *   - name: Tareas
 *     description: Operaciones de gestión de tareas
 */

/**
 * @openapi
 * components:
 *   schemas:
 *     Tarea:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         titulo:
 *           type: string
 *           example: Preparar entrega técnica
 *         descripcion:
 *           type: string
 *           nullable: true
 *           example: Documentar la API
 *         estado:
 *           type: string
 *           example: pendiente
 */

/**
 * @openapi
 * /tasks:
 *   get:
 *     tags:
 *       - Tareas
 *     summary: Listar tareas del usuario autenticado
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Lista de tareas del usuario
 *       '401':
 *         description: Token ausente o inválido
 *   post:
 *     tags:
 *       - Tareas
 *     summary: Crear una tarea
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - titulo
 *             properties:
 *               titulo:
 *                 type: string
 *                 example: Preparar entrega técnica
 *               descripcion:
 *                 type: string
 *                 nullable: true
 *                 example: Documentar los endpoints
 *               estado:
 *                 type: string
 *                 example: pendiente
 *               fecha_vencimiento:
 *                 type: string
 *                 format: date-time
 *                 nullable: true
 *     responses:
 *       '201':
 *         description: Tarea creada correctamente
 *       '400':
 *         description: Datos de la tarea inválidos
 *       '401':
 *         description: Se requiere autenticación
 */

/**
 * @openapi
 * /tasks/{id}:
 *   parameters:
 *     - name: id
 *       in: path
 *       required: true
 *       description: Identificador positivo de la tarea
 *       schema:
 *         type: integer
 *         minimum: 1
 *   get:
 *     tags:
 *       - Tareas
 *     summary: Obtener una tarea
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Tarea encontrada
 *       '400':
 *         description: Identificador inválido
 *       '401':
 *         description: Se requiere autenticación
 *       '404':
 *         description: Tarea inexistente o sin permiso de acceso
 *   put:
 *     tags:
 *       - Tareas
 *     summary: Actualizar una tarea
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - titulo
 *             properties:
 *               titulo:
 *                 type: string
 *                 example: Terminar documentación
 *               descripcion:
 *                 type: string
 *                 nullable: true
 *               estado:
 *                 type: string
 *                 example: en_progreso
 *               fecha_vencimiento:
 *                 type: string
 *                 format: date-time
 *                 nullable: true
 *     responses:
 *       '200':
 *         description: Tarea actualizada correctamente
 *       '400':
 *         description: Identificador o datos inválidos
 *       '401':
 *         description: Se requiere autenticación
 *       '404':
 *         description: Tarea inexistente o sin permiso de acceso
 *   delete:
 *     tags:
 *       - Tareas
 *     summary: Eliminar una tarea
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Tarea eliminada correctamente
 *       '400':
 *         description: Identificador inválido
 *       '401':
 *         description: Se requiere autenticación
 *       '404':
 *         description: Tarea inexistente o sin permiso de acceso
 */

// Todas las rutas de tareas requieren autenticación.
router.use(autenticarToken);

router.post("/", crear);
router.get("/", listar);
router.get("/:id", obtenerPorId);
router.put("/:id", actualizar);
router.delete("/:id", eliminar);

export default router;
