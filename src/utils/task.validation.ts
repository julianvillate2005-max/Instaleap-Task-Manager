
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

/**
 * Valida que una fecha cumpla el formato ISO 8601
 * y que sus componentes representen una fecha y hora válidas.
 *
 * Formatos admitidos:
 * 2026-10-15T14:30:00Z
 * 2026-10-15T14:30:00.123Z
 * 2026-10-15T14:30:00-05:00
 */
function esFechaISOValida(fecha: string): boolean {
  const formatoISO =
    /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(?:\.(\d{1,3}))?(Z|[+-]\d{2}:\d{2})$/;

  const coincidencia = fecha.match(formatoISO);

  if (!coincidencia) {
    return false;
  }

  const [
    ,
    anioTexto,
    mesTexto,
    diaTexto,
    horaTexto,
    minutoTexto,
    segundoTexto,
    fraccionSegundo,
    zonaHoraria,
  ] = coincidencia;

  const anio = Number(anioTexto);
  const mes = Number(mesTexto);
  const dia = Number(diaTexto);
  const hora = Number(horaTexto);
  const minuto = Number(minutoTexto);
  const segundo = Number(segundoTexto);

  // Validar los rangos básicos de la fecha y la hora.
  if (
    anio < 1 ||
    mes < 1 ||
    mes > 12 ||
    dia < 1 ||
    hora > 23 ||
    minuto > 59 ||
    segundo > 59
  ) {
    return false;
  }

  // Obtener la cantidad real de días del mes.
  // Se utiliza UTC para evitar depender de la zona horaria local.
  const diasDelMes = new Date(
    Date.UTC(anio, mes, 0)
  ).getUTCDate();

  if (dia > diasDelMes) {
    return false;
  }

  // Validar la zona horaria cuando no se utiliza Z.
if (!zonaHoraria) {
  return false;
}

if (zonaHoraria !== "Z") {
  const [horasZonaTexto, minutosZonaTexto] =
    zonaHoraria.slice(1).split(":");

  const horasZona = Number(horasZonaTexto);
  const minutosZona = Number(minutosZonaTexto);

  if (
    horasZona > 23 ||
    minutosZona > 59
  ) {
    return false;
  }
}

  // Confirmar que JavaScript pueda interpretar la fecha.
  const fechaParseada = new Date(fecha);

  if (Number.isNaN(fechaParseada.getTime())) {
    return false;
  }

  // Rechazar fracciones de segundo que no puedan representarse
  // con la precisión de milisegundos de JavaScript.
  if (
    fraccionSegundo !== undefined &&
    fraccionSegundo.length > 3
  ) {
    return false;
  }

  return true;
}

/**
 * Valida los datos recibidos para crear o actualizar una tarea.
 */
export function validarCrearTarea(
  datos: unknown
): datos is DatosCrearTarea {
  if (!validarEsquema(datos)) {
    return false;
  }

  const fecha = datos.fecha_vencimiento;

  if (fecha !== undefined && fecha !== null) {
    if (!esFechaISOValida(fecha)) {
      return false;
    }
  }

  return true;
}