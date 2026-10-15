import { Router } from "express";
import {
  registrar,
  login,
} from "../../controllers/auth.controller.js";

const router = Router();

/**
 * @openapi
 * tags:
 *   - name: Autenticación
 *     description: Registro de usuarios e inicio de sesión
 */

/**
 * @openapi
 * /auth/register:
 *   post:
 *     tags:
 *       - Autenticación
 *     summary: Registrar un usuario
 *     description: Crea una cuenta de usuario.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nombre
 *               - email
 *               - password
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: Usuario de prueba
 *               email:
 *                 type: string
 *                 format: email
 *                 example: usuario@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: MiClaveSegura123
 *     responses:
 *       '201':
 *         description: Usuario registrado correctamente
 *       '400':
 *         description: Datos de registro inválidos
 *       '409':
 *         description: El correo electrónico ya está registrado
 */
router.post("/register", registrar);

/**
 * @openapi
 * /auth/login:
 *   post:
 *     tags:
 *       - Autenticación
 *     summary: Iniciar sesión
 *     description: Verifica las credenciales y devuelve un JWT.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: usuario@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: MiClaveSegura123
 *     responses:
 *       '200':
 *         description: Inicio de sesión exitoso
 *       '400':
 *         description: Datos de acceso inválidos
 *       '401':
 *         description: Credenciales incorrectas
 */
router.post("/login", login);

export default router;
