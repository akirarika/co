import { cwd, exit } from "node:process";
import type { Params } from "../types";
import consola from "consola";
import { execFileSync } from "node:child_process";
import { join } from "node:path";
import { init } from "../commands/init";
import { exists } from "node:fs/promises";

export async function run(params: Params, options: { path?: string; description?: "global" | "npm-script" | "workspace" }) {
  if (options.description === "npm-script") {
    if (!(await exists(join(cwd(), ".commands", "__CONFIG__.toml")))) await init(params);
    const config: any = Bun.TOML.parse(await Bun.file(join(cwd(), ".commands", "__CONFIG__.toml")).text());

    try {
      if (config.general.packageManager === "bun") {
        execFileSync("bun", ["run", options.path!, ...params.raw], { stdio: "inherit", shell: true, env: { TERM: "xterm-256color", ...process.env } });
      }

      if (config.general.packageManager === "npm") {
        execFileSync("npm", ["run", options.path!, ...params.raw], { stdio: "inherit", shell: true, env: { TERM: "xterm-256color", ...process.env } });
      }

      if (config.general.packageManager === "cnpm") {
        execFileSync("cnpm", ["run", options.path!, ...params.raw], { stdio: "inherit", shell: true, env: { TERM: "xterm-256color", ...process.env } });
      }

      if (config.general.packageManager === "yarn") {
        execFileSync("yarn", ["run", options.path!, ...params.raw], { stdio: "inherit", shell: true, env: { TERM: "xterm-256color", ...process.env } });
      }

      if (config.general.packageManager === "pnpm") {
        execFileSync("pnpm", ["run", options.path!, ...params.raw], { stdio: "inherit", shell: true, env: { TERM: "xterm-256color", ...process.env } });
      }

      exit(0);
    } catch (error: any) {
      consola.error(error?.message ?? "Running Error");
      exit(1);
    }
  } else {
    try {
      execFileSync("bun", ["run", options.path!, JSON.stringify(params)], { stdio: "inherit", shell: true, env: { TERM: "xterm-256color", ...process.env } });
      exit(0);
    } catch (error: any) {
      consola.error(error?.message ?? "Running Error");
      exit(1);
    }
  }
}
