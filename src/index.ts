import colors from "colors";
import inquirer from "inquirer";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { InmueblesController } from "./controller";

async function createCommandHandler() {
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
    console.log({ respuestas });
    const { confirmar, ...newInmData } = respuestas;
    const controller = new InmueblesController();
    await controller.createInmueble(newInmData);
  }
}

async function processArgv() {
  return yargs(hideBin(process.argv))
    .command(
      "create",
      "Dar de alta un nuevo inmueble",
      () => {},
      createCommandHandler
    )
    .command(
      "get [id]",
      "make a get HTTP request",
      function (yargs) {
        yargs.positional("id", {
          describe: "El id del inmueble",
          // type: "string",
          default: "1234", // Valor por defecto si no se proporciona
        });
      },
      function (argv) {
        console.log("handler");
        console.log(argv.id);
      }
    )
    .demandCommand(1, "# Tenés que usar algún comando")
    .recommendCommands()
    .help()
    .strict()
    .fail((msg, err, argv) => {
      if (err?.name == "ExitPromptError") {
        console.error(colors.red("# Chau!"));
        process.exit(0);
      } else if (!err) {
        argv.showHelp();
      }
    })
    .parse();
}

(async function main() {
  await processArgv();
})();
