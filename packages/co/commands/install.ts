import type { Params } from "../types";
import { join } from "node:path";
import { cwd } from "node:process";
import { exists } from "node:fs/promises";
import { init } from "./init";
import { $ } from "bun";

export async function install(params: Params) {
  if (!(await exists(join(cwd(), ".commands", "__CONFIG__.toml")))) await init(params);
  const config: any = Bun.TOML.parse(await Bun.file(join(cwd(), ".commands", "__CONFIG__.toml")).text());

  if (config.general.packageManager === "bun") {
    if (params.commands.length === 0) {
      await $`bun install`;
    } else {
      let raw = "bun add";
      raw += " " + params.commands.join(" ");
      if (params.options.d || params.options.dev || params.options["save-dev"]) raw += " --dev";
      if (params.options.g || params.options.global) raw += " --global";
      await $`${{ raw }}`;
    }
  }

  if (config.general.packageManager === "npm") {
    if (params.commands.length === 0) {
      await $`npm install`;
    } else {
      let raw = "npm install";
      raw += " " + params.commands.join(" ");
      if (params.options.d || params.options.dev || params.options["save-dev"]) raw += " --save-dev";
      if (params.options.g || params.options.global) raw += " --global";
      else raw += " --save";
      await $`${{ raw }}`;
    }
  }

  if (config.general.packageManager === "cnpm") {
    if (params.commands.length === 0) {
      await $`cnpm install`;
    } else {
      let raw = "cnpm install";
      raw += " " + params.commands.join(" ");
      if (params.options.d || params.options.dev || params.options["save-dev"]) raw += " --dev";
      if (params.options.g || params.options.global) raw += " --global";
      await $`${{ raw }}`;
    }
  }

  if (config.general.packageManager === "yarn") {
    if (params.commands.length === 0) {
      await $`yarn install`;
    } else {
      let raw = "yarn";
      if (params.options.g || params.options.global) raw += " global add";
      else raw += " add";
      raw += " " + params.commands.join(" ");
      if (params.options.d || params.options.dev || params.options["save-dev"]) raw += " --dev";
      await $`${{ raw }}`;
    }
  }

  if (config.general.packageManager === "pnpm") {
    if (params.commands.length === 0) {
      await $`pnpm install`;
    } else {
      let raw = "pnpm add";
      raw += " " + params.commands.join(" ");
      if (params.options.d || params.options.dev || params.options["save-dev"]) raw += " --dev";
      if (params.options.g || params.options.global) raw += " --global";
      await $`${{ raw }}`;
    }
  }
}
