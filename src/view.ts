import { Inmueble } from "./model";

export class InmueblesView {
  static showInmueble(inm: Inmueble) {
    console.log(`
      ID: ${inm.id}
      Título: ${inm.titulo}
      -----------------------
    `);
  }
  static showInmueblesList(inm: Inmueble[]) {
    console.table(inm);
  }
  static showError(msg: string) {
    console.error(msg);
  }
  static showSuccessMessage(msg: string) {
    console.log("🟩", msg);
  }
  static showWarningMessage(msg: string) {
    console.log("🟨", msg);
  }
}
