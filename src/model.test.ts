import { assert, expect, test } from "vitest";
import { CreateInmuebleInput, Inmueble, InmueblesModel } from "./model";
import { MemoryDB } from "./db";

test("Create inmueble save in db", async () => {
  const db = new MemoryDB();
  const model = new InmueblesModel(db);
  const newInmId = await model.createInmueble(mockInm);
  const dbAll = await db.read();
  const newItemInDb = dbAll.find((inm) => inm.id === newInmId);

  expect(newItemInDb.id).toBe(newInmId);
  expect(newItemInDb).toMatchObject(mockInm);
});

const mockInm: CreateInmuebleInput = {
  titulo: "Hermoso departamento en Palermo",
  descripcion: "Departamento de 2 ambientes con balcón y vista abierta.",
  operacion: "venta",
  zona: "Palermo, CABA",
  precio: 120000,
  ambientes: 2,
  tipo: "departamento",
  metros: 55,
  contacto: "contacto@inmobiliaria.com",
};
