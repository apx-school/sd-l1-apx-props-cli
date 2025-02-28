import {
  CreateInmuebleInput,
  Inmueble,
  InmueblesModel,
  SearchInmueblesInputs,
} from "./model";
import { InmueblesView } from "./view";

export class InmueblesController {
  private model: InmueblesModel;
  constructor() {
    this.model = new InmueblesModel();
  }

  async createInmueble(inm: CreateInmuebleInput): Promise<void> {
    try {
      const newInmId = await this.model.createInmueble(inm);
      const newInm = await this.model.getInmuebleById(newInmId);

      return InmueblesView.showCreatedInmueble(newInm);
    } catch (error) {
      return InmueblesView.showError(error.message);
    }
  }
  async showInmuebleById(id: string): Promise<void> {
    const inm = await this.model.getInmuebleById(id);
    return InmueblesView.showInmueble(inm);
  }
  async searchInmueble(input: SearchInmueblesInputs = {}): Promise<void> {
    const inms = await this.model.searchInmueble(input);
    return InmueblesView.showInmueblesList(inms);
  }
  async updateInmueble(inmId: string, inm: Partial<Inmueble>): Promise<void> {
    const updated = await this.model.updateInmueble(inmId, inm);
    if (updated) {
      const inm = await this.model.getInmuebleById(inmId);
      return InmueblesView.showInmueble(inm);
    } else {
      return InmueblesView.showError("No se pudo actualizar");
    }
  }
  async deleteInmueble(inmId: string): Promise<void> {
    const deleted = await this.model.deleteInmueble(inmId);
    if (deleted) {
      return console.log("Se elimino el inmueble", inmId);
    } else {
      return InmueblesView.showWarningMessage("No se pudo eliminar");
    }
  }
}
