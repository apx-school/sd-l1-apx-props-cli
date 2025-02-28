import { capitalize, pick } from "radash";
import { Inmueble } from "./model";
import colors from "colors";
export class InmueblesView {
  static showInmueble(inm: Inmueble) {
    const text = Object.keys(inm)
      .map((k) => "> " + colors.cyan(capitalize(k)) + ": " + inm[k])
      .join("\n");
    console.log("\n" + text, "\n");
  }
  static showCreatedInmueble(inm: Inmueble) {
    console.log(colors.bgGreen(`### Inmueble creado ###`));
    this.showInmueble(inm);
  }
  static showInmueblesList(inm: Inmueble[]) {
    console.table(inm.map((inm) => pick(inm, ["id", "titulo", "descripcion"])));
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
