import { join } from "node:path";
import { cwd, argv, env, exit } from "node:process";
import { mkdir, exists, readFile } from "node:fs/promises";
import { notFound } from "../commands/not-found";
import type { Params } from "../types";
import { run } from "../utils/run";

export const bootstrap = async (commands: Record<string, (params: Params) => Promise<any>>) => {
  const params: Params = {
    command: "index",
    commands: [],
    options: {},
    raw: [],
  };
  params.raw = argv.slice(3);

  for (const v of argv.slice(3)) {
    if (v.startsWith("--") && v.includes("=")) {
      const vSplited = v.split("=");
      params.options[vSplited[0].slice(2)] = vSplited.slice(1, vSplited.length).join("=");
    } else if (v.startsWith("--")) {
      params.options[v.slice(2)] = "1";
    } else if (v.startsWith("-") && v.includes("=")) {
      const vSplited = v.split("=");
      params.options[vSplited[0].slice(1)] = vSplited.slice(1, vSplited.length).join("=");
    } else if (v.startsWith("-")) {
      params.options[v.slice(1)] = "1";
    } else {
      params.commands.push(v);
    }
  }
  if (argv.length === 2) params.command = `index`;
  if (argv.length !== 2) params.command = `${argv[2] ?? "index"}`;
  if (params.command.startsWith("--")) params.command = params.command.slice(2);
  if (params.command.startsWith("-") && params.command !== "-") params.command = params.command.slice(1);

  if (params.command in commands) return await commands[params.command](params);

  exists(join(env.HOME || env.USERPROFILE || "/", ".commands"));
  if (!(await exists(join(env.HOME || env.USERPROFILE || "/", ".commands")))) await mkdir(join(env.HOME || env.USERPROFILE || "/", ".commands"));

  const packageJson = (await exists(join(cwd(), "package.json"))) ? JSON.parse(await readFile(join(cwd(), "package.json"), "utf-8")) : undefined;
  if (await exists(join(cwd(), ".commands", `${params.command}.ts`))) {
    const modulePath = join(cwd(), ".commands", `${params.command}.ts`);
    await run(params, { path: modulePath, description: "workspace" });
  } else if (packageJson?.scripts?.[params.command]) {
    run(params, { path: params.command, description: "npm-script" });
  } else if (await exists(join(env.HOME || env.USERPROFILE || "/", ".commands", `${params.command}.ts`))) {
    const modulePath = join(env.HOME || env.USERPROFILE || "/", ".commands", `${params.command}.ts`);
    await run(params, { path: modulePath, description: "global" });
  } else {
    // not found
    notFound(params);
    exit(1);
  }
};
