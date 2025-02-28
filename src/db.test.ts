import fs from "fs";
import { nanoid } from "nanoid";
import { resolve } from "path";
import { afterAll, expect, test } from "vitest";
import { FileDB } from "./db";
import { Inmueble } from "./model";

const filePath = resolve(__dirname, "test.json");

const mockInm: Inmueble = {
  id: nanoid(),
  titulo: "Hermoso departamento en Palermo",
  descripcion: "Departamento de 2 ambientes con balcón y vista abierta.",
  operacion: "venta",
  ciudad: "CABA",
  zona: "Palermo, CABA",
  precio: 120000,
  ambientes: 2,
  tipo: "departamento",
  metros: 55,
  contacto: "contacto@inmobiliaria.com",
};

afterAll(() => {
  fs.unlinkSync(filePath);
});

test("Write data in fileDB the first time", async () => {
  const db = new FileDB(filePath);
  const initialData = await db.read();
  initialData.push(mockInm);
  await db.write(initialData);
  const newData = await db.read();

  expect(newData.length).toBe(1);
  expect(newData[0]).toMatchObject(mockInm);
});
