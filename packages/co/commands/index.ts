import type { Params } from "../types";
import gradient from "gradient-string";
import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import { cwd, env, exit, stdout } from "node:process";
import { exists } from "node:fs/promises";
import consola from "consola";
import { run } from "../utils/run";

export async function index(params: Params) {
  const color = gradient(["cyan", "green"]);
  const commands = [] as Array<{ label: string; value: string; path?: string; hint?: "global" | "npm-script" | "workspace" }>;

  if (await exists(join(env.HOME || env.USERPROFILE || "/", ".commands"))) {
    const dir = await readdir(join(env.HOME || env.USERPROFILE || "/", ".commands"));
    let temp = [] as typeof commands;
    for (const file of dir) {
      if (!file.endsWith(".ts")) continue;
      temp.push({ label: file.slice(0, -3), value: file, path: join(env.HOME || env.USERPROFILE || "/", ".commands", file), hint: "global" });
    }
    temp.sort((a, b) => a.label.localeCompare(b.label));
    commands.push(...temp);
  }

  if (await exists(join(cwd(), "package.json"))) {
    const packageJson = JSON.parse(await readFile(join(cwd(), "package.json"), "utf-8"));
    for (const key in packageJson?.scripts ?? {}) {
      commands.push({ label: key, value: key, path: key, hint: "npm-script" });
    }
  }

  if (await exists(join(cwd(), ".commands"))) {
    const dir = await readdir(join(cwd(), ".commands"));
    let temp = [] as typeof commands;
    for (const file of dir) {
      if (!file.endsWith(".ts")) continue;
      commands.push({ label: file.slice(0, -3), value: file, path: join(cwd(), ".commands", file), hint: "workspace" });
    }
    temp.sort((a, b) => a.label.localeCompare(b.label));
    commands.push(...temp);
  }

  if (commands.length === 0) {
    consola.warn("There is no command yet.");
    consola.info(`Docs: https://github.com/akirarika/co`);
    return;
  }

  const limit = stdout.rows - 6 < 3 ? 3 : stdout.rows - 6;
  let offset = 0;

  let selected: (typeof commands)[number];
  while (true) {
    const options = commands.slice(offset, offset === 0 ? offset + limit + 1 : offset + limit);

    if (offset !== 0) options.unshift({ label: "<↑ prev page>", value: "<prev page>" });
    if (commands.length > offset + limit) options.push({ label: "<↓ next page>", value: "<next page>" });

    const selectedInfo = (await consola.prompt(color("Is the Order a Rabbit?"), {
      type: "select",
      options: options,
    })) as any;

    if (typeof selectedInfo === "symbol" || selectedInfo === "<cancel>") exit(0);
    else if (selectedInfo === "<prev page>") offset -= limit;
    else if (selectedInfo === "<next page>") offset += limit;
    else {
      selected = commands.find((v) => v.value === selectedInfo)!;
      if (!selected) exit(0);
      break;
    }
  }

  await run(params, selected);
  exit(0);
}
