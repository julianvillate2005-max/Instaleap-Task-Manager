import {
  validarRegistroUsuario,
  type RegistroUsuarioDTO,
} from "./validation.js";

const usuarioValido: RegistroUsuarioDTO = {
  nombre: "Usuario Prueba",
  email: "prueba@example.com",
  password: "ClaveTemporal123!",
};

const usuarioInvalido = {
  nombre: "",
  email: "correo-invalido",
  password: "123",
};

console.log(
  "Usuario válido:",
  validarRegistroUsuario(usuarioValido),
);

console.log(
  "Usuario inválido:",
  validarRegistroUsuario(usuarioInvalido),
);

console.log(
  "Errores de validación:",
  validarRegistroUsuario.errors,
);