
import { Ajv } from "ajv";

/**
 * Representa los datos permitidos para crear o actualizar una tarea.
 */
export interface DatosCrearTarea {
  /** Título de la tarea, con una longitud máxima de 150 caracteres. */
  titulo: string;

  /** Descripción opcional de la tarea; puede ser nula. */
  descripcion?: string | null;

  /** Fecha de vencimiento opcional en formato ISO 8601; puede ser nula. */
  fecha_vencimiento?: string | null;

  /** Estado opcional de la tarea. */
  estado?: "pendiente" | "en curso" | "completada";
}

/**
 * Esquema de validación de los datos admitidos para una tarea.
 *
 * Rechaza propiedades no definidas y establece las restricciones
 * de longitud y los valores permitidos para cada campo.
 */
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

/** Instancia de AJV configurada para recopilar todos los errores de validación. */
const ajv = new Ajv({
  allErrors: true,
});

/** Función compilada que comprueba la estructura de los datos de una tarea. */
const validarEsquema = ajv.compile<DatosCrearTarea>(
  esquemaCrearTarea
);

/**
 * Comprueba que una fecha tenga el formato ISO 8601 admitido
 * y que sus componentes representen una fecha y hora válidas.
 *
 * Valida los rangos de fecha, hora y zona horaria, así como
 * la interpretación de la fecha por JavaScript.
 *
 * @param fecha - Fecha y hora expresadas como texto.
 * @returns true si la fecha cumple las validaciones; false en caso contrario.
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

  // Obtener la cantidad real de días del mes en UTC.
  const diasDelMes = new Date(
    Date.UTC(anio, mes, 0)
  ).getUTCDate();

  if (dia > diasDelMes) {
    return false;
  }

  // Comprobar que la zona horaria esté presente.
  if (!zonaHoraria) {
    return false;
  }

  // Validar el desplazamiento de la zona horaria cuando no se usa Z.
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

  // Rechazar fracciones de segundo que superen la precisión admitida.
  if (
    fraccionSegundo !== undefined &&
    fraccionSegundo.length > 3
  ) {
    return false;
  }

  return true;
}

/**
 * Valida la estructura y los valores de los datos de una tarea.
 *
 * Comprueba el esquema definido con AJV y, cuando se proporciona
 * una fecha de vencimiento, verifica que tenga el formato ISO 8601
 * admitido y represente una fecha y hora válidas.
 *
 * @param datos - Valor desconocido que se desea validar.
 * @returns true si los datos cumplen las validaciones y pueden tratarse
 * como DatosCrearTarea; false en caso contrario.
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
