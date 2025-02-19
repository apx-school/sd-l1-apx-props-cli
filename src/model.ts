import { DB, FileDB } from "./db";
import { nanoid } from "nanoid";
export class InmueblesModel {
  db: DB;
  constructor(db: DB = new FileDB("inmuebles.json")) {
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
    return null;
  }
  async searchInmueble(options: SearchInmueblesInputs): Promise<Inmueble[]> {
    return [];
  }
  async updateInmueble(
    inmId: string,
    inm: Partial<Inmueble>
  ): Promise<boolean> {
    return true;
  }
  async deleteInmueble(inmId: string): Promise<boolean> {
    return true;
  }
}

/**
 * Esto lo hago asi por si en el futuro
 * cercano tengo que hacer un pick o definir
 * un tipo propio para el input
 **/

export type CreateInmuebleInput = Omit<Inmueble, "id">;

export type SearchInmueblesInputs = {
  barrio: string;
  ciudad: string;
  precioMax: number;
  precioMin: number;
  ambientes: number;
  minDormitorios: number;
  maxDormitorios: number;
};

type TipoDeInmueble =
  | "departamento"
  | "casa"
  | "ph"
  | "local"
  | "terreno"
  | "oficina";

type Operacion = "venta" | "alquiler";

export class Inmueble {
  id: string; // Identificador único del inmueble
  titulo: string; // Título o descripción breve
  descripcion: string; // Descripción detallada del inmueble
  operacion: Operacion;
  zona: string; // Ciudad donde se encuentra la inmueble
  precio: number | null; // Precio de venta o alquiler (null si es "Consultar precio")
  ambientes: number; // Cantidad de ambientes
  tipo: TipoDeInmueble; // Tipo de inmueble
  metros?: number; // Superficie total en m²
  contacto?: string;
}
