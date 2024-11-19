import type { Params } from "../types";
import { join } from "node:path";
import { cwd } from "node:process";
import { exists } from "node:fs/promises";
import { init } from "./init";
import { $ } from "bun";

export async function uninstall(params: Params) {
  if (!(await exists(join(cwd(), ".commands", "__CONFIG__.toml")))) await init(params);
  const config: any = Bun.TOML.parse(await Bun.file(join(cwd(), ".commands", "__CONFIG__.toml")).text());

  if (config.general.packageManager === "bun") {
    let raw = "bun remove";
    raw += " " + params.commands.join(" ");
    if (params.options.g || params.options.global) raw += " --global";
    await $`${{ raw }}`;
  }

  if (config.general.packageManager === "npm") {
    let raw = "npm uninstall";
    raw += " " + params.commands.join(" ");
    if (params.options.g || params.options.global) raw += " --global";
    await $`${{ raw }}`;
  }

  if (config.general.packageManager === "cnpm") {
    let raw = "cnpm uninstall";
    raw += " " + params.commands.join(" ");
    if (params.options.g || params.options.global) raw += " --global";
    await $`${{ raw }}`;
  }

  if (config.general.packageManager === "yarn") {
    let raw = "yarn";
    if (params.options.g || params.options.global) raw += " global";
    else raw += " remove";
    raw += " " + params.commands.join(" ");
    await $`${{ raw }}`;
  }

  if (config.general.packageManager === "pnpm") {
    await $`pnpm remove ${params.commands.join(" ")}`;
  }
}
