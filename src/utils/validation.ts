import { Ajv, type JSONSchemaType } from "ajv";

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

const ajv = new Ajv ({ allErrors: true });

ajv.addFormat("email", {
  type: "string",
  validate: (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
});

export const validarRegistroUsuario =
  ajv.compile<RegistroUsuarioDTO>(esquemaRegistroUsuario);