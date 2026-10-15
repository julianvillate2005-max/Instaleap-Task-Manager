
import { Ajv, type JSONSchemaType } from "ajv";

/**
 * Estructura de los datos requeridos para registrar un usuario.
 *
 * @property nombre Nombre del usuario, entre 2 y 100 caracteres.
 * @property email Dirección de correo electrónico válida, entre 5 y 255 caracteres.
 * @property password Contraseña de entre 8 y 72 caracteres.
 */
export interface RegistroUsuarioDTO {
  nombre: string;
  email: string;
  password: string;
}

const esquemaRegistroUsuario: JSONSchemaType<RegistroUsuarioDTO> = {
  type: "object",
  properties: {
    nombre: {
      type: "string",
      minLength: 2,
      maxLength: 100,
    },
    email: {
      type: "string",
      minLength: 5,
      maxLength: 255,
      format: "email",
    },
    password: {
      type: "string",
      minLength: 8,
      maxLength: 72,
    },
  },
  required: ["nombre", "email", "password"],
  additionalProperties: false,
};

const ajv = new Ajv({ allErrors: true });

ajv.addFormat("email", {
  type: "string",
  validate: (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
});

/**
 * Validador compilado de AJV para los datos de registro.
 *
 * Comprueba los campos obligatorios, sus tipos y restricciones,
 * el formato del correo electrónico y la ausencia de propiedades
 * adicionales, según el esquema definido.
 *
 * @returns Una función de validación que comprueba los datos de registro.
 */
export const validarRegistroUsuario =
  ajv.compile<RegistroUsuarioDTO>(esquemaRegistroUsuario);
