
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

// Todas las rutas de tareas requieren autenticación.
router.use(autenticarToken);

router.post("/", crear);
router.get("/", listar);
router.get("/:id", obtenerPorId);
router.put("/:id", actualizar);
router.delete("/:id", eliminar);

export default router;
