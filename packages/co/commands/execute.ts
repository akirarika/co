import type { Params } from "../types";
import { join } from "node:path";
import { cwd } from "node:process";
import { exists } from "node:fs/promises";
import { init } from "./init";
import { $ } from "bun";

export async function execute(params: Params) {
  if (!(await exists(join(cwd(), ".commands", "__CONFIG__.toml")))) await init(params);
  const config: any = Bun.TOML.parse(await Bun.file(join(cwd(), ".commands", "__CONFIG__.toml")).text());

  if (config.general.packageManager === "bun") {
    let raw = "bun x";
    raw += " " + params.commands.join(" ");
    await $`${{ raw }}`;
  }

  if (config.general.packageManager === "npm") {
    let raw = "npx";
    raw += " " + params.commands.join(" ");
    await $`${{ raw }}`;
  }

  if (config.general.packageManager === "cnpm") {
    let raw = "npx";
    raw += " " + params.commands.join(" ");
    await $`${{ raw }}`;
  }

  if (config.general.packageManager === "yarn") {
    let raw = "yarn dlx";
    raw += " " + params.commands.join(" ");
    await $`${{ raw }}`;
  }

  if (config.general.packageManager === "pnpm") {
    let raw = "pnpm dlx";
    raw += " " + params.commands.join(" ");
    await $`${{ raw }}`;
  }
}
