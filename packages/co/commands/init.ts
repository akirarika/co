import { join } from "node:path";
import { cwd, env, exit, stdout } from "node:process";
import { exists, mkdir, writeFile } from "node:fs/promises";
import type { Params } from "../types";
import consola from "consola";
import gradient from "gradient-string";
import { search } from "@inquirer/prompts";

export async function init(params: Params) {
  const color = gradient(["green", "green"]);
  const managers = ["bun", "npm", "pnpm", "yarn", "cnpm"];

  if (await exists(join(cwd(), ".commands", "__CONFIG__.toml"))) {
    consola.error(`The project has been initialized, and the (${".commands"}) directory already exists under (${cwd()}).`);
    exit(1);
  }

  const selected = await search({
    message: "Which package manager do you want?",
    source: async (input, { signal }) => {
      return managers.filter((manager) => {
        return manager.startsWith(input ?? "");
      });
    },
  });

  await mkdir(join(cwd(), ".commands"));
  await writeFile(join(cwd(), ".commands", "__CONFIG__.toml"), `[general]\npackageManager = "${selected}"`);

  consola.success(color("Initialized!"));
  consola.info(`Docs: https://github.com/akirarika/co`);
  consola.info(`Settings: ${join(cwd(), ".commands", "__CONFIG__.toml")}`);
  console.log("");
}
