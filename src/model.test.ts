import { assert, describe, expect, test } from "vitest";
import {
  CreateInmuebleInput,
  Inmueble,
  InmueblesModel,
  Operacion,
} from "./model";
import { MemoryDB } from "./db";
import { nanoid } from "nanoid";

const mockInm: CreateInmuebleInput = {
  ciudad: "CABA",
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

test("Create inmueble save in db", async () => {
  const db = new MemoryDB();
  const model = new InmueblesModel(db);
  const newInmId = await model.createInmueble(mockInm);
  const dbAll = await db.read();
  const newItemInDb = dbAll.find((inm) => inm.id === newInmId);

  expect(newItemInDb.id).toBe(newInmId);
  expect(newItemInDb).toMatchObject(mockInm);
});

test("Get inm by id", async () => {
  const db = new MemoryDB();
  const model = new InmueblesModel(db);
  const newInmueble = {
    ...mockInm,
    id: nanoid(),
  };
  db.write([newInmueble]);
  const foundInm = await model.getInmuebleById(newInmueble.id);

  expect(foundInm).toMatchObject(newInmueble);
});

const baseMock = {
  titulo: "Test title",
  descripcion: "Test description",
  operacion: "alquiler" as Operacion,
  metros: 55,
  contacto: "contacto@inmobiliaria.com",
};

describe("Search inmueble", async () => {
  const db = new MemoryDB();
  const model = new InmueblesModel(db);

  // TODO: Generar estos mocks de forma aleatoria

  const inmA: Inmueble = {
    ...baseMock,
    id: nanoid(),
    ciudad: "ciudad-a",
    zona: "zona-a",
    tipo: "departamento",
    precio: 120000,
    ambientes: 4,
  };

  const inmB: Inmueble = {
    ...baseMock,
    id: nanoid(),
    ciudad: "ciudad-b",
    zona: "zona-b",
    tipo: "departamento",
    precio: 30000,
    ambientes: 1,
  };

  const inmC: Inmueble = {
    ...baseMock,
    id: nanoid(),
    ciudad: "ciudad-b",
    zona: "zona-c",
    tipo: "casa",
    precio: 90000,
    ambientes: 2,
  };

  db.write([inmA, inmB, inmC]);

  test("Search by ciudad b", async () => {
    const foundInm = await model.searchInmueble({
      ciudad: "ciudad-b",
    });

    const foundInmIds = foundInm.map((inm) => inm.id);
    expect(foundInm.length).toBe(2);
    expect(foundInmIds).toEqual(expect.arrayContaining([inmB.id, inmC.id]));
  });

  test("Search by ciudad a", async () => {
    const foundInm = await model.searchInmueble({
      ciudad: "ciudad-a",
    });

    const foundInmIds = foundInm.map((inm) => inm.id);
    expect(foundInm.length).toBe(1);
    expect(foundInmIds).toEqual(expect.arrayContaining([inmA.id]));
  });

  test("Search by ciudad and zona", async () => {
    const foundInm = await model.searchInmueble({
      ciudad: "ciudad-b",
      zonas: ["zona-c"],
    });

    const foundInmIds = foundInm.map((inm) => inm.id);
    expect(foundInm.length).toBe(1);
    expect(foundInmIds).toEqual(expect.arrayContaining([inmC.id]));
  });

  test("Search by ciudad and zonas", async () => {
    const foundInm = await model.searchInmueble({
      ciudad: "ciudad-b",
      zonas: ["zona-c", "zona-b"],
    });

    const foundInmIds = foundInm.map((inm) => inm.id);
    expect(foundInm.length).toBe(2);
    expect(foundInmIds).toEqual(expect.arrayContaining([inmB.id, inmC.id]));
  });

  test("Search by tipo", async () => {
    const foundInm = await model.searchInmueble({
      tipos: ["departamento"],
    });

    const foundInmIds = foundInm.map((inm) => inm.id);
    expect(foundInm.length).toBe(2);
    expect(foundInmIds).toEqual(expect.arrayContaining([inmA.id, inmB.id]));
  });

  test("Search by zona and tipo", async () => {
    const foundInm = await model.searchInmueble({
      tipos: ["departamento"],
      zonas: ["zona-b"],
    });

    const foundInmIds = foundInm.map((inm) => inm.id);
    expect(foundInm.length).toBe(1);
    expect(foundInmIds).toEqual(expect.arrayContaining([inmB.id]));
  });

  test("Search by empty tipo array", async () => {
    const foundInm = await model.searchInmueble({
      tipos: [],
      zonas: ["zona-b"],
    });

    const foundInmIds = foundInm.map((inm) => inm.id);
    expect(foundInm.length).toBe(1);
    expect(foundInmIds).toEqual(expect.arrayContaining([inmB.id]));
  });

  test("Search by precio", async () => {
    const foundInm = await model.searchInmueble({
      precioMin: 15000,
      precioMax: 99999,
    });

    const foundInmIds = foundInm.map((inm) => inm.id);
    expect(foundInm.length).toBe(2);
    expect(foundInmIds).toEqual(expect.arrayContaining([inmB.id, inmC.id]));
  });
  test("Search by precio min", async () => {
    const foundInm = await model.searchInmueble({
      precioMin: 99000,
    });

    const foundInmIds = foundInm.map((inm) => inm.id);
    expect(foundInm.length).toBe(1);
    expect(foundInmIds).toEqual(expect.arrayContaining([inmA.id]));
  });

  test("Search by ambientes min", async () => {
    const foundInm = await model.searchInmueble({
      minAmbientes: 2,
    });

    const foundInmIds = foundInm.map((inm) => inm.id);
    expect(foundInm.length).toBe(2);
    expect(foundInmIds).toEqual(expect.arrayContaining([inmA.id, inmC.id]));
  });

  test("Search by ambientes min max", async () => {
    const foundInm = await model.searchInmueble({
      minAmbientes: 2,
      maxAmbientes: 3,
    });

    const foundInmIds = foundInm.map((inm) => inm.id);
    expect(foundInm.length).toBe(1);
    expect(foundInmIds).toEqual(expect.arrayContaining([inmC.id]));
  });

  test("Search by ambientes min and zona", async () => {
    const foundInm = await model.searchInmueble({
      minAmbientes: 2,
      zonas: ["zona-c"],
    });

    const foundInmIds = foundInm.map((inm) => inm.id);
    expect(foundInmIds).toEqual(expect.arrayContaining([inmC.id]));
  });
});

test("Update inmueble", async () => {
  const db = new MemoryDB();
  const model = new InmueblesModel(db);
  const newInmId = nanoid();
  const newInmueble = {
    ...mockInm,
    id: newInmId,
  };
  db.write([newInmueble]);

  const update: Partial<Inmueble> = {
    operacion: "alquiler",
    precio: 90000,
    ambientes: 5,
    tipo: "casa",
    metros: 90,
  };

  await model.updateInmueble(newInmId, update);
  const dbAll = await db.read();
  const updatedItem = dbAll.find((inm) => inm.id === newInmId);

  expect(updatedItem).toMatchObject({
    ...newInmueble,
    ...update,
  });
});
test("Delete inmueble", async () => {
  const db = new MemoryDB();
  const model = new InmueblesModel(db);
  const mocks = Array.from({ length: 3 }).map(() => ({
    ...mockInm,
    id: nanoid(),
  }));

  const lengthAfterDelete = mocks.length - 1;

  db.write(mocks);

  const inmToDelete = mocks[2];

  const deleted = await model.deleteInmueble(inmToDelete.id);
  const dbAll = await db.read();

  expect(deleted).toBe(true);
  expect(dbAll).toHaveLength(lengthAfterDelete);
  expect(dbAll).not.toContain(inmToDelete);
});
