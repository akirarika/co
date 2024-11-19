import { cwd, exit } from "node:process";
import type { Params } from "../types";
import consola from "consola";
import { $ } from "bun";
import { execFileSync } from "node:child_process";
import { join } from "node:path";
import { init } from "../commands/init";
import { exists } from "node:fs/promises";

export async function run(params: Params, options: { path?: string; hint?: "global" | "npm-script" | "workspace" }) {
  if (options.hint === "npm-script") {
    if (!(await exists(join(cwd(), ".commands", "__CONFIG__.toml")))) await init(params);
    const config: any = Bun.TOML.parse(await Bun.file(join(cwd(), ".commands", "__CONFIG__.toml")).text());
    if (config.general.packageManager === "bun") {
      await $`bun run ${options.path} ${params.raw.join(" ")}`;
    }

    if (config.general.packageManager === "npm") {
      await $`npm run ${options.path} ${params.raw.join(" ")}`;
    }

    if (config.general.packageManager === "cnpm") {
      await $`cnpm run ${options.path} ${params.raw.join(" ")}`;
    }

    if (config.general.packageManager === "yarn") {
      await $`yarn run ${options.path} ${params.raw.join(" ")}`;
    }

    if (config.general.packageManager === "pnpm") {
      await $`pnpm run ${options.path} ${params.raw.join(" ")}`;
    }

    exit(0);
  } else {
    // await new Promise(async (resolve) => {
    //   const worker = new Worker(options.path!);
    //   worker.onerror = (event) => {
    //     console.error(event.message);
    //     if (event.error) consola.error(event.error);
    //     exit(1);
    //   };
    //   worker.onmessage = (event) => {
    //     if (event.data === "exit") exit(0);
    //     resolve(undefined);
    //   };
    //   worker.postMessage(params);
    // });

    execFileSync("bun", ["run", options.path!, JSON.stringify(params)], { stdio: "inherit" });
    exit(0);
  }
}
