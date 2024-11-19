import type { Params } from "../types";
import { join } from "node:path";
import { cwd } from "node:process";
import { exists } from "node:fs/promises";
import { init } from "./init";
import { $ } from "bun";

export async function upgrade(params: Params) {
  if (!(await exists(join(cwd(), ".commands", "__CONFIG__.toml")))) await init(params);
  const config: any = Bun.TOML.parse(await Bun.file(join(cwd(), ".commands", "__CONFIG__.toml")).text());

  if (config.general.packageManager === "bun") {
    await $`bun update`;
  }

  if (config.general.packageManager === "npm") {
    await $`npm upgrade`;
  }

  if (config.general.packageManager === "cnpm") {
    await $`cnpm update`;
  }

  if (config.general.packageManager === "yarn") {
    await $`yarn upgrade`;
  }

  if (config.general.packageManager === "pnpm") {
    await $`pnpm update`;
  }
}
