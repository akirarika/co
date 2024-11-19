import type { Params } from "../types";
import { join } from "node:path";
import { cwd } from "node:process";
import { exists } from "node:fs/promises";
import { init } from "./init";
import { $ } from "bun";

export async function run(params: Params) {
  if (!(await exists(join(cwd(), ".commands", "__CONFIG__.toml")))) await init(params);
  const config: any = Bun.TOML.parse(await Bun.file(join(cwd(), ".commands", "__CONFIG__.toml")).text());

  if (config.general.packageManager === "bun") {
    let raw = "bun run";
    raw += " " + params.raw.join(" ");
    await $`${{ raw }}`;
  }

  if (config.general.packageManager === "npm") {
    let raw = "npm run";
    raw += " " + params.raw.join(" ");
    await $`${{ raw }}`;
  }

  if (config.general.packageManager === "cnpm") {
    let raw = "cnpm run";
    raw += " " + params.raw.join(" ");
    await $`${{ raw }}`;
  }

  if (config.general.packageManager === "yarn") {
    let raw = "yarn run";
    raw += " " + params.raw.join(" ");
    await $`${{ raw }}`;
  }

  if (config.general.packageManager === "pnpm") {
    let raw = "pnpm run";
    raw += " " + params.raw.join(" ");
    await $`${{ raw }}`;
  }
}
