import consola from "consola";
import type { Params } from "../types";

export async function notFound(params: Params) {
  consola.error(`Command not found: ${params.command}`);
  consola.info(`Docs: https://github.com/akirarika/co`);
  console.log("");
}
