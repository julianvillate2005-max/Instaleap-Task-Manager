
import { afterAll, beforeEach, describe, expect, it, vi } from "vitest";
import request from "supertest";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

vi.mock("../src/persistence/user.repository.js", () => ({
  buscarUsuarioPorEmail: vi.fn(),
  crearUsuario: vi.fn(),
}));

vi.mock("../src/persistence/task.repository.js", () => ({
  crearTarea: vi.fn(),
  listarTareasPorUsuario: vi.fn(),
  buscarTareaPorId: vi.fn(),
  actualizarTarea: vi.fn(),
  eliminarTarea: vi.fn(),
}));

import app from "../src/app.js";
import { database } from "../src/config/database.js";
import { env } from "../src/config/env.js";
import {
  buscarUsuarioPorEmail,
  crearUsuario,
} from "../src/persistence/user.repository.js";
import {
  crearTarea,
  listarTareasPorUsuario,
  buscarTareaPorId,
  actualizarTarea,
  eliminarTarea,
} from "../src/persistence/task.repository.js";

const buscarUsuarioMock = vi.mocked(buscarUsuarioPorEmail);
const crearUsuarioMock = vi.mocked(crearUsuario);
const listarTareasMock = vi.mocked(listarTareasPorUsuario);

const crearTareaMock = vi.mocked(crearTarea);
const buscarTareaMock = vi.mocked(buscarTareaPorId);
const actualizarTareaMock = vi.mocked(actualizarTarea);
const eliminarTareaMock = vi.mocked(eliminarTarea);

const usuarioPrueba = {
  id: "usuario-prueba-1",
  nombre: "Usuario de prueba",
  email: "prueba.automatizada@example.com",
  password_hash: "",
};
const tareaPrueba = {
  id: "101",
  titulo: "Preparar pruebas automatizadas",
  descripcion: "Verificar el CRUD",
  fecha_vencimiento: null,
  estado: "pendiente" as const,
  user_id: usuarioPrueba.id,
  created_at: new Date("2026-10-15T12:00:00.000Z"),
};

function crearTokenPrueba(): string {
  return jwt.sign(
    {},
    env.jwtSecret,
    {
      subject: usuarioPrueba.id,
      expiresIn: "1h",
    }
  );
}

describe("Pruebas HTTP de la API", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
it("POST /tasks rechaza una fecha con un día inexistente", async () => {
  const response = await request(app)
    .post("/tasks")
    .set("Authorization", `Bearer ${crearTokenPrueba()}`)
    .send({
      titulo: "Tarea con fecha inexistente",
      fecha_vencimiento: "2026-02-30T14:30:00.000Z",
    });

  expect(response.status).toBe(400);
  expect(crearTareaMock).not.toHaveBeenCalled();
});

  it("GET /health devuelve HTTP 200 y estado ok", async () => {
    const response = await request(app).get("/health");

    expect(response.status).toBe(200);
    expect(response.body.status).toBe("ok");
    expect(response.body.message).toBe(
      "Task Manager API is running"
    );
  });

  it("GET /tasks sin JWT devuelve HTTP 401", async () => {
    const response = await request(app).get("/tasks");

    expect(response.status).toBe(401);
  });

  it("GET /tasks con token inválido devuelve HTTP 401", async () => {
    const response = await request(app)
      .get("/tasks")
      .set("Authorization", "Bearer token-invalido");

    expect(response.status).toBe(401);
  });

  it("POST /auth/register con datos inválidos devuelve HTTP 400", async () => {
    const response = await request(app)
      .post("/auth/register")
      .send({});

    expect(response.status).toBe(400);
  });

  it("POST /auth/register registra un usuario y no expone su contraseña", async () => {
    buscarUsuarioMock.mockResolvedValue(null);

    crearUsuarioMock.mockImplementation(
      async (nombre, email, passwordHash) => ({
        id: "usuario-prueba-1",
        nombre,
        email,
        password_hash: passwordHash,
      })
    );

    const response = await request(app)
      .post("/auth/register")
      .send({
        nombre: "Usuario de prueba",
        email: "prueba.automatizada@example.com",
        password: "MiClaveSegura123",
      });

    expect(response.status).toBe(201);
    expect(response.body.usuario.email).toBe(
      "prueba.automatizada@example.com"
    );
    expect(response.body.usuario).not.toHaveProperty("password_hash");
    expect(crearUsuarioMock).toHaveBeenCalledOnce();
  });

  it("POST /auth/login sin credenciales devuelve HTTP 400", async () => {
    const response = await request(app)
      .post("/auth/login")
      .send({});

    expect(response.status).toBe(400);
  });

  it("POST /auth/login con JSON malformado devuelve HTTP 400", async () => {
    const response = await request(app)
      .post("/auth/login")
      .set("Content-Type", "application/json")
      .send('{"email":');

    expect(response.status).toBe(400);
  });

  it("POST /auth/login devuelve un JWT con credenciales correctas", async () => {
    const password = "MiClaveSegura123";
    const passwordHash = await bcrypt.hash(password, 4);

    buscarUsuarioMock.mockResolvedValue({
      ...usuarioPrueba,
      password_hash: passwordHash,
    });

    const response = await request(app)
      .post("/auth/login")
      .send({
        email: usuarioPrueba.email,
        password,
      });

    expect(response.status).toBe(200);
    expect(response.body.token).toEqual(expect.any(String));
    expect(response.body.usuario.email).toBe(usuarioPrueba.email);
    expect(response.body.usuario).not.toHaveProperty("password_hash");

    const payload = jwt.verify(
      response.body.token,
      env.jwtSecret
    );

    expect(payload).toMatchObject({
      sub: usuarioPrueba.id,
    });
  });

  it("POST /auth/login rechaza una contraseña incorrecta", async () => {
    const passwordHash = await bcrypt.hash(
      "OtraClaveSegura123",
      4
    );

    buscarUsuarioMock.mockResolvedValue({
      ...usuarioPrueba,
      password_hash: passwordHash,
    });

    const response = await request(app)
      .post("/auth/login")
      .send({
        email: usuarioPrueba.email,
        password: "ClaveIncorrecta123",
      });

    expect(response.status).toBe(401);
  });

  it("GET /tasks acepta un JWT válido", async () => {
    const token = jwt.sign(
      {},
      env.jwtSecret,
      {
        subject: usuarioPrueba.id,
        expiresIn: "1h",
      }
    );

    listarTareasMock.mockResolvedValue([]);

    const response = await request(app)
      .get("/tasks")
      .set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.tareas).toEqual([]);
    expect(listarTareasMock).toHaveBeenCalledWith(
      usuarioPrueba.id
    );
  });
  
  it("POST /tasks crea una tarea y devuelve HTTP 201", async () => {
    crearTareaMock.mockResolvedValue(tareaPrueba);

    const response = await request(app)
      .post("/tasks")
      .set("Authorization", `Bearer ${crearTokenPrueba()}`)
      .send({
        titulo: tareaPrueba.titulo,
        descripcion: tareaPrueba.descripcion,
        estado: "pendiente",
      });

    expect(response.status).toBe(201);
    expect(response.body.tarea.titulo).toBe(tareaPrueba.titulo);
    expect(crearTareaMock).toHaveBeenCalledWith(
      usuarioPrueba.id,
      expect.objectContaining({
        titulo: tareaPrueba.titulo,
      })
    );
  });

  it("POST /tasks rechaza una tarea sin título", async () => {
    const response = await request(app)
      .post("/tasks")
      .set("Authorization", `Bearer ${crearTokenPrueba()}`)
      .send({ descripcion: "Falta el título" });

    expect(response.status).toBe(400);
    expect(crearTareaMock).not.toHaveBeenCalled();
  });

it("POST /tasks rechaza una fecha de vencimiento inválida", async () => {
  const response = await request(app)
    .post("/tasks")
    .set("Authorization", `Bearer ${crearTokenPrueba()}`)
    .send({
      titulo: "Tarea con fecha inválida",
      fecha_vencimiento: "2026-99-99T25:61:00",
    });

  expect(response.status).toBe(400);
  expect(crearTareaMock).not.toHaveBeenCalled();
});


it("POST /tasks acepta una fecha ISO válida", async () => {
  const fechaValida = "2026-10-15T14:30:00.000Z";

  crearTareaMock.mockResolvedValue({
    ...tareaPrueba,
    fecha_vencimiento: new Date(fechaValida),
  });

  const response = await request(app)
    .post("/tasks")
    .set("Authorization", `Bearer ${crearTokenPrueba()}`)
    .send({
      titulo: "Tarea con fecha válida",
      fecha_vencimiento: fechaValida,
    });

  expect(response.status).toBe(201);
  expect(crearTareaMock).toHaveBeenCalledWith(
    usuarioPrueba.id,
    expect.objectContaining({
      titulo: "Tarea con fecha válida",
      fecha_vencimiento: fechaValida,
    })
  );
});

it("POST /tasks rechaza una fecha con formato ambiguo", async () => {
  const response = await request(app)
    .post("/tasks")
    .set("Authorization", `Bearer ${crearTokenPrueba()}`)
    .send({
      titulo: "Tarea con fecha ambigua",
      fecha_vencimiento: "15/10/2026",
    });

  expect(response.status).toBe(400);
  expect(crearTareaMock).not.toHaveBeenCalled();
});

  it("GET /tasks/:id devuelve una tarea del usuario", async () => {
    buscarTareaMock.mockResolvedValue(tareaPrueba);

    const response = await request(app)
      .get("/tasks/101")
      .set("Authorization", `Bearer ${crearTokenPrueba()}`);

    expect(response.status).toBe(200);
    expect(response.body.tarea.id).toBe("101");
    expect(buscarTareaMock).toHaveBeenCalledWith(
      usuarioPrueba.id,
      "101"
    );
  });

  it("GET /tasks/:id devuelve HTTP 404 si la tarea no existe o no pertenece al usuario", async () => {
    buscarTareaMock.mockResolvedValue(null);

    const response = await request(app)
      .get("/tasks/999")
      .set("Authorization", `Bearer ${crearTokenPrueba()}`);

    expect(response.status).toBe(404);
  });

  it("GET /tasks/:id rechaza un identificador inválido", async () => {
    const response = await request(app)
      .get("/tasks/abc")
      .set("Authorization", `Bearer ${crearTokenPrueba()}`);

    expect(response.status).toBe(400);
    expect(buscarTareaMock).not.toHaveBeenCalled();
  });

  it("PUT /tasks/:id actualiza una tarea del usuario", async () => {
    const tareaActualizada = {
      ...tareaPrueba,
      titulo: "Pruebas automatizadas terminadas",
    };

    actualizarTareaMock.mockResolvedValue(tareaActualizada);

    const response = await request(app)
      .put("/tasks/101")
      .set("Authorization", `Bearer ${crearTokenPrueba()}`)
      .send({
        titulo: tareaActualizada.titulo,
        descripcion: tareaActualizada.descripcion,
        estado: "completada",
      });

    expect(response.status).toBe(200);
    expect(response.body.tarea.titulo).toBe(
      "Pruebas automatizadas terminadas"
    );
    expect(actualizarTareaMock).toHaveBeenCalledWith(
      usuarioPrueba.id,
      "101",
      expect.objectContaining({
        titulo: "Pruebas automatizadas terminadas",
      })
    );
  });

  it("PUT /tasks/:id devuelve HTTP 404 si no existe la tarea", async () => {
    actualizarTareaMock.mockResolvedValue(null);

    const response = await request(app)
      .put("/tasks/999")
      .set("Authorization", `Bearer ${crearTokenPrueba()}`)
      .send({ titulo: "Tarea inexistente" });

    expect(response.status).toBe(404);
  });

  it("DELETE /tasks/:id elimina una tarea del usuario", async () => {
    eliminarTareaMock.mockResolvedValue(true);

    const response = await request(app)
      .delete("/tasks/101")
      .set("Authorization", `Bearer ${crearTokenPrueba()}`);

    expect(response.status).toBe(200);
    expect(eliminarTareaMock).toHaveBeenCalledWith(
      usuarioPrueba.id,
      "101"
    );
  });

  it("DELETE /tasks/:id devuelve HTTP 404 si no existe la tarea", async () => {
    eliminarTareaMock.mockResolvedValue(false);

    const response = await request(app)
      .delete("/tasks/999")
      .set("Authorization", `Bearer ${crearTokenPrueba()}`);

    expect(response.status).toBe(404);
  });
});

afterAll(async () => {
  await database.end();
});