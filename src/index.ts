import colors from "colors";
import inquirer from "inquirer";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { InmueblesController } from "./controller";
import { InmueblesView } from "./view";
import { CreateInmuebleInput, SearchInmueblesInputs } from "./model";

async function askCreateData(): Promise<CreateInmuebleInput> {
  const respuestas = await inquirer.prompt([
    {
      type: "input",
      name: "titulo",
      message: "Título de la publicación",
      validate: (input) => (input ? true : "El nombre no puede estar vacío."),
    },
    {
      type: "input",
      name: "descripcion",
      message: "Descripción de la publicación",
      validate: (input) =>
        input ? true : "La descripción no puede estar vacía.",
    },
    {
      type: "list",
      name: "operacion",
      message: "Selecciona un tipo de publicación",
      choices: ["alquier", "venta"],
      default: 0,
    },
    {
      type: "input",
      name: "ciudad",
      message: "Ciudad",
      validate: (input) => (input ? true : "La ciudad no puede estar vacía."),
    },
    {
      type: "input",
      name: "zona",
      message: "Zona",
      validate: (input) => (input ? true : "La zona no puede estar vacía."),
    },
    {
      type: "number",
      name: "precio",
      message: "Precio",
      validate: (input) => (input ? true : "El precio no puede estar vacío."),
    },
    {
      type: "number",
      name: "ambientes",
      message: "Cantidad de habitaciones",
      validate: (input) =>
        input ? true : "La cantidad de habitaciones no puede estar vacía.",
    },
    {
      type: "list",
      name: "tipo",
      message: "Tipo de inmueble",
      choices: ["departamento", "casa", "ph", "local", "terreno", "oficina"],
      default: 0,
    },
    {
      type: "number",
      name: "metros",
      message: "Superficie total en m²",
    },
    {
      type: "input",
      name: "contacto",
      message: "Contacto",
    },
    {
      type: "confirm",
      name: "confirmar",
      message: "¿Confirmas la creación?",
      default: true,
    },
  ]);

  if (respuestas.confirmar) {
    // console.log({ respuestas });
    const { confirmar, ...newInmData } = respuestas;
    return newInmData;
  } else {
    return null;
  }
}
async function searchCommandOptions(): Promise<SearchInmueblesInputs> {
  const respuestas = await inquirer.prompt([
    {
      type: "input",
      name: "ciudad",
      message: "Ciudad",
    },
    {
      type: "input",
      name: "zonas",
      message: "Zonas",
    },
    {
      type: "checkbox",
      name: "tipos",
      message: "Tipos de Inmueble",
      choices: ["departamento", "casa", "ph", "local", "terreno", "oficina"],
      default: null,
    },
    {
      type: "number",
      name: "precioMax",
      message: "Precio Máximo",
    },
    {
      type: "number",
      name: "precioMin",
      message: "Precio Mínimo",
    },
    {
      type: "number",
      name: "minAmbientes",
      message: "Mínimo de Ambientes",
    },
    {
      type: "number",
      name: "maxAmbientes",
      message: "Máximo de Ambientes",
    },
  ]);

  return respuestas;
}

async function processArgv() {
  return yargs(hideBin(process.argv))
    .command(
      "create",
      "Dar de alta un nuevo inmueble",
      () => {},
      async (argv) => {
        const newInmData = await askCreateData();
        if (newInmData) {
          const controller = new InmueblesController();
          await controller.createInmueble(newInmData);
        } else {
          // TODO:Ver la forma de hacer el throw
          // y que lo agarre fail()
          // throw Error("No aceptaste crear el inmueble");
          console.error(colors.yellow("No aceptaste crear el inmueble"));
        }
      }
    )
    .command("all", "Obtener todos los inmuebles", function (argv) {
      console.log("all");
      const controller = new InmueblesController();
      return controller.searchInmueble();
    })
    .command(
      "get <id>",
      "Obtener un inmueble por id",
      function (yargs) {
        yargs.positional("id", {
          describe: "El id del inmueble",
          type: "string",
        });
      },
      function (argv) {
        const controller = new InmueblesController();
        controller.showInmuebleById(argv.id);
      }
    )
    .command("search", "Busca inmuebles", async function (argv) {
      const searchOptions = await searchCommandOptions();
      const controller = new InmueblesController();
      return controller.searchInmueble(searchOptions);
    })
    .command(
      ["remove <id>", "rm <id>"],
      "Obtener un inmueble por id",
      function (yargs) {
        yargs.positional("id", {
          describe: "El id del inmueble",
          type: "string",
        });
      },
      function (argv) {
        const controller = new InmueblesController();
        controller.deleteInmueble(argv.id);
      }
    )
    .demandCommand(1, "# Tenés que usar algún comando")
    .recommendCommands()
    .help()
    .strict()
    .fail((msg, err, argv) => {
      // console.error({ err });
      if (err?.name == "ExitPromptError") {
        console.error(colors.red("# Chau!"));
        process.exit(0);
      } else if (!err) {
        console.error(colors.yellow(msg), "\n");
        argv.showHelp();
      }
    })
    .parse();
}

(async function main() {
  await processArgv();
})();
