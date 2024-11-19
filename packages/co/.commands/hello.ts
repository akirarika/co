import { $ } from "bun";
import { input } from "co-helper";
import consola from "consola";

await consola.prompt("Hello world!", {
  type: "text",
});

postMessage("exit");
