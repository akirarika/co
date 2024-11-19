import { join } from "node:path";
import { cwd, env, exit, stdout } from "node:process";
import { exists, mkdir, writeFile } from "node:fs/promises";
import type { Params } from "../types";
import consola from "consola";
import gradient from "gradient-string";

export async function init(params: Params) {
  const color = gradient(["green", "green"]);
  const managers = ["bun", "npm", "pnpm", "yarn", "cnpm"];

  if (await exists(join(cwd(), ".commands", "__CONFIG__.toml"))) {
    consola.error(`The project has been initialized, and the (${".commands"}) directory already exists under (${cwd()}).`);
    exit(1);
  }

  const limit = stdout.rows - 6 < 3 ? 3 : stdout.rows - 6;
  let offset = 0;

  let selected: string;
  while (true) {
    const options: any = managers.slice(offset, offset === 0 ? offset + limit + 1 : offset + limit);

    if (offset !== 0) options.unshift({ label: "<↑ prev page>", value: "<prev page>" });
    if (managers.length > offset + limit) options.push({ label: "<↓ next page>", value: "<next page>" });

    const selectedInfo = (await consola.prompt(color(`Which package manager do you want?`), {
      type: "select",
      options: options,
    })) as any;

    if (typeof selectedInfo === "symbol" || selectedInfo === "<cancel>") exit(0);
    else if (selectedInfo === "<prev page>") offset -= limit;
    else if (selectedInfo === "<next page>") offset += limit;
    else {
      selected = selectedInfo;
      if (!selected) exit(0);
      break;
    }
  }

  await mkdir(join(cwd(), ".commands"));
  await writeFile(join(cwd(), ".commands", "__CONFIG__.toml"), `[general]\npackageManager = "${selected}"`);

  consola.success(color("Initialized!"));
  consola.info(`Docs: https://github.com/akirarika/co`);
  consola.info(`Settings: ${join(cwd(), ".commands", "__CONFIG__.toml")}`);
  console.log("");
}
