
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import {
  buscarUsuarioPorEmail,
  crearUsuario,
  type Usuario,
} from "../persistence/user.repository.js";

/**
 * Error que indica que el correo electrónico ya está registrado.
 */
export class EmailEnUsoError extends Error {
  /**
   * Crea el error con el mensaje correspondiente al correo duplicado.
   */
  constructor() {
    super("El correo electrónico ya está registrado.");
    this.name = "EmailEnUsoError";
  }
}

/**
 * Error que indica que las credenciales proporcionadas no son válidas.
 */
export class CredencialesInvalidasError extends Error {
  /**
   * Crea un error con un mensaje genérico para las credenciales incorrectas.
   */
  constructor() {
    super("Correo electrónico o contraseña incorrectos.");
    this.name = "CredencialesInvalidasError";
  }
}

/**
 * Registra un usuario nuevo, comprueba que el correo no esté registrado
 * y almacena la contraseña utilizando un hash seguro.
 *
 * @param datos - Nombre, correo electrónico y contraseña del usuario.
 * @returns Una promesa con los datos del usuario creado, sin el hash de la contraseña.
 * @throws {EmailEnUsoError} Si ya existe un usuario con el correo proporcionado.
 */
export async function registrarUsuario(datos: {
  nombre: string;
  email: string;
  password: string;
}): Promise<Omit<Usuario, "password_hash">> {
  const usuarioExistente = await buscarUsuarioPorEmail(datos.email);

  if (usuarioExistente) {
    throw new EmailEnUsoError();
  }

  const passwordHash = await bcrypt.hash(datos.password, 10);

  const usuarioCreado = await crearUsuario(
    datos.nombre,
    datos.email,
    passwordHash
  );

  const { password_hash: _passwordHash, ...usuarioSeguro } = usuarioCreado;

  return usuarioSeguro;
}

/**
 * Autentica a un usuario mediante su correo electrónico y contraseña.
 * Si las credenciales son válidas, genera un token JWT con una vigencia
 * de una hora.
 *
 * @param datos - Correo electrónico y contraseña del usuario.
 * @returns Una promesa con los datos seguros del usuario y el token JWT.
 * @throws {CredencialesInvalidasError} Si el usuario no existe o la contraseña es incorrecta.
 */
export async function iniciarSesion(datos: {
  email: string;
  password: string;
}): Promise<{
  usuario: Omit<Usuario, "password_hash">;
  token: string;
}> {
  const usuario = await buscarUsuarioPorEmail(datos.email);

  if (!usuario) {
    throw new CredencialesInvalidasError();
  }

  const contrasenaValida = await bcrypt.compare(
    datos.password,
    usuario.password_hash
  );

  if (!contrasenaValida) {
    throw new CredencialesInvalidasError();
  }

  const token = jwt.sign(
    {},
    env.jwtSecret,
    {
      subject: usuario.id,
      expiresIn: "1h",
    }
  );

  const { password_hash: _passwordHash, ...usuarioSeguro } = usuario;

  return {
    usuario: usuarioSeguro,
    token,
  };
}
