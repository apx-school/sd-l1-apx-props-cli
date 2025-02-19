import { hideBin } from "yargs/helpers";
import yargs from "yargs";
import inquirer from "inquirer";

const argv = yargs(hideBin(process.argv))
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
  .help()
  .strict().argv;
// console.log(argv);/

async function createCommandHandler(argv) {
  const respuestas = await inquirer.prompt([
    {
      type: "input",
      name: "titulo",
      message: "Título de la publicación",
      validate: (input) => (input ? true : "El nombre no puede estar vacío."),
    },
    {
      type: "list",
      name: "tipo",
      message: "Selecciona un tipo de publicación",
      choices: ["Venta", "Alquiler"],
    },
    {
      type: "number",
      name: "price",
      message: "Precio",
      validate: (input) => (input ? true : "El precio no puede estar vacío."),
    },
    {
      type: "confirm",
      name: "confirmar",
      message: "¿Confirmas la creación?",
      default: true,
    },
  ]);
  console.log(respuestas);
}
