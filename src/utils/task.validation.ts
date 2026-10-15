
import { Ajv } from "ajv";

export interface DatosCrearTarea {
  titulo: string;
  descripcion?: string | null;
  fecha_vencimiento?: string | null;
  estado?: "pendiente" | "en curso" | "completada";
}

const esquemaCrearTarea = {
  type: "object",
  properties: {
    titulo: {
      type: "string",
      minLength: 1,
      maxLength: 150,
    },
    descripcion: {
      type: ["string", "null"],
      maxLength: 2000,
    },
    fecha_vencimiento: {
      type: ["string", "null"],
    },
    estado: {
      type: "string",
      enum: ["pendiente", "en curso", "completada"],
    },
  },
  required: ["titulo"],
  additionalProperties: false,
} as const;

const ajv = new Ajv({
  allErrors: true,
});

const validarEsquema = ajv.compile<DatosCrearTarea>(
  esquemaCrearTarea
);

export function validarCrearTarea(
  datos: unknown
): datos is DatosCrearTarea {
  if (!validarEsquema(datos)) {
    return false;
  }

  if (
    datos.fecha_vencimiento !== undefined &&
    datos.fecha_vencimiento !== null
  ) {
    if (
      Number.isNaN(Date.parse(datos.fecha_vencimiento)) ||
      !datos.fecha_vencimiento.includes("T")
    ) {
      return false;
    }
  }

  return true;
}
