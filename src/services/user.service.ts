
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import {
  buscarUsuarioPorEmail,
  crearUsuario,
  type Usuario,
} from "../persistence/user.repository.js";

export class EmailEnUsoError extends Error {
  constructor() {
    super("El correo electrónico ya está registrado.");
    this.name = "EmailEnUsoError";
  }
}

export class CredencialesInvalidasError extends Error {
  constructor() {
    super("Correo electrónico o contraseña incorrectos.");
    this.name = "CredencialesInvalidasError";
  }
}

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