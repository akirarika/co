import type { Params } from "../types";
import { join } from "node:path";
import { cwd } from "node:process";
import { exists } from "node:fs/promises";
import { init } from "./init";
import { $ } from "bun";

export async function create(params: Params) {
  if (!(await exists(join(cwd(), ".commands", "__CONFIG__.toml")))) await init(params);
  const config: any = Bun.TOML.parse(await Bun.file(join(cwd(), ".commands", "__CONFIG__.toml")).text());

  if (config.general.packageManager === "bun") {
    let raw = "bun create";
    raw += " " + params.commands.join(" ");
    await $`${{ raw }}`;
  }

  if (config.general.packageManager === "npm") {
    let raw = "npm create";
    raw += " " + params.commands.join(" ");
    await $`${{ raw }}`;
  }

  if (config.general.packageManager === "cnpm") {
    let raw = "cnpm create";
    raw += " " + params.commands.join(" ");
    await $`${{ raw }}`;
  }

  if (config.general.packageManager === "yarn") {
    let raw = "yarn create";
    raw += " " + params.commands.join(" ");
    await $`${{ raw }}`;
  }

  if (config.general.packageManager === "pnpm") {
    let raw = "pnpm create";
    raw += " " + params.commands.join(" ");
    await $`${{ raw }}`;
  }
}
