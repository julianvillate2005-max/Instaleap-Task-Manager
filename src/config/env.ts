
import dotenv from "dotenv";

dotenv.config();

/**
 * Obtiene una variable de entorno obligatoria y comprueba que
 * tenga un valor no vacío después de eliminar los espacios externos.
 *
 * @param nombre - Nombre de la variable de entorno que se consultará.
 * @returns Valor de la variable de entorno sin espacios externos.
 * @throws {Error} Si la variable no está definida o está vacía.
 */
function obtenerVariableObligatoria(nombre: string): string {
  const valor = process.env[nombre]?.trim();

  if (!valor) {
    throw new Error(
      `Falta la variable de entorno obligatoria: ${nombre}`,
    );
  }

  return valor;
}

/**
 * Convierte una variable de entorno en un número de puerto válido.
 *
 * Si el valor no está definido o está vacío, utiliza el puerto
 * predeterminado proporcionado.
 *
 * @param valor - Valor de texto que se desea convertir en puerto.
 * @param predeterminado - Puerto que se utilizará cuando no se proporcione un valor.
 * @returns Un número entero entre 1 y 65535.
 * @throws {Error} Si el valor no representa un puerto entero dentro del rango permitido.
 */
function obtenerPuerto(
  valor: string | undefined,
  predeterminado: number,
): number {
  if (valor === undefined || valor.trim() === "") {
    return predeterminado;
  }

  const puerto = Number(valor);

  if (!Number.isInteger(puerto) || puerto < 1 || puerto > 65535) {
    throw new Error(`Puerto inválido: ${valor}`);
  }

  return puerto;
}

/**
 * Configuración centralizada de la aplicación.
 *
 * Carga los valores del entorno y establece los puertos predeterminados.
 * También obtiene las variables obligatorias para PostgreSQL y JWT.
 *
 * @throws {Error} Si falta una variable obligatoria o un puerto tiene un valor inválido.
 */
export const env = {
  port: obtenerPuerto(process.env.PORT, 3000),
  nodeEnv: process.env.NODE_ENV ?? "development",
  database: {
    host: obtenerVariableObligatoria("DB_HOST"),
    port: obtenerPuerto(process.env.DB_PORT, 5432),
    name: obtenerVariableObligatoria("DB_NAME"),
    user: obtenerVariableObligatoria("DB_USER"),
    password: obtenerVariableObligatoria("DB_PASSWORD"),
  },
  jwtSecret: obtenerVariableObligatoria("JWT_SECRET"),
};
