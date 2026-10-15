
import bcrypt from "bcrypt";
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
