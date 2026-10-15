
import dotenv from "dotenv";

dotenv.config();

/**
 * Obtiene una variable obligatoria y comprueba que no esté vacía.
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
 * Convierte un valor de entorno en un puerto válido.
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
