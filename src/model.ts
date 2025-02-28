import { resolve } from "path";
import { DB, FileDB } from "./db";
import { nanoid } from "nanoid";

const filePath = resolve(__dirname, "inmuebles.json");
export class InmueblesModel {
  db: DB;
  constructor(db: DB = new FileDB(filePath)) {
    this.db = db;
  }
  /**
   * Creates a new Inmueble entry in the database.
   * @param inm - The input data for creating an Inmueble.
   * @returns A promise that resolves to the ID of the newly created Inmueble.
   */
  async createInmueble(inm: CreateInmuebleInput): Promise<string> {
    const data = await this.db.read();
    const newId = nanoid();
    data.push({
      ...inm,
      id: newId,
    });
    await this.db.write(data);
    return newId;
  }
  async getInmuebleById(id: string): Promise<Inmueble> {
    const data = await this.db.read();
    const inm = data.find((inm) => inm.id === id);
    if (inm) {
      return inm;
    }
    return null;
  }
  async searchInmueble(options: SearchInmueblesInputs): Promise<Inmueble[]> {
    const data = await this.db.read();
    return data.filter((inm) => {
      let pass = true;
      if (options.ciudad && pass) {
        pass = inm.ciudad === options.ciudad;
      }

      if (options.zonas && pass) {
        pass = options.zonas.includes(inm.zona);
      }

      if (options.tipos?.length > 0 && pass) {
        pass = options.tipos.includes(inm.tipo);
      }

      if (options.precioMax && pass) {
        pass = inm.precio <= options.precioMax;
      }

      if (options.precioMin && pass) {
        pass = inm.precio >= options.precioMin;
      }

      if (options.minAmbientes && pass) {
        pass = inm.ambientes >= options.minAmbientes;
      }

      if (options.maxAmbientes && pass) {
        pass = inm.ambientes <= options.maxAmbientes;
      }

      return pass;
    });
  }
  async updateInmueble(
    inmId: string,
    update: Partial<Inmueble>
  ): Promise<boolean> {
    const data = await this.db.read();
    const indexToUpdate = data.findIndex((inm) => inm.id === inmId);

    if (indexToUpdate >= 0) {
      const inmToUpdate = data[indexToUpdate];
      data[indexToUpdate] = {
        ...inmToUpdate,
        ...update,
      };
      this.db.write(data);
      return true;
    }

    return false;
  }
  async deleteInmueble(inmId: string): Promise<boolean> {
    const data = await this.db.read();
    const indexToDelete = data.findIndex((inm) => inm.id === inmId);

    if (indexToDelete >= 0) {
      data.splice(indexToDelete, 1);
      this.db.write(data);
      return true;
    }

    return false;
  }
}

/**
 * Esto lo hago asi por si en el futuro
 * cercano tengo que hacer un pick o definir
 * un tipo propio para el input
 **/

export type CreateInmuebleInput = Omit<Inmueble, "id">;

export type SearchInmueblesInputs = Partial<{
  ciudad: string;
  zonas: string[];
  tipos: TipoDeInmueble[];
  precioMax: number;
  precioMin: number;
  minAmbientes: number;
  maxAmbientes: number;
}>;

type TipoDeInmueble =
  | "departamento"
  | "casa"
  | "ph"
  | "local"
  | "terreno"
  | "oficina";

export type Operacion = "venta" | "alquiler";

export class Inmueble {
  id: string; // Identificador único del inmueble
  titulo: string; // Título o descripción breve
  descripcion: string; // Descripción detallada del inmueble
  operacion: Operacion;
  ciudad: string; // Ciudad donde se encuentra la inmueble
  zona: string; // Ciudad donde se encuentra la inmueble
  precio: number; // Precio de venta o alquiler
  ambientes: number; // Cantidad de ambientes
  tipo: TipoDeInmueble; // Tipo de inmueble
  metros?: number; // Superficie total en m²
  contacto?: string;
}
