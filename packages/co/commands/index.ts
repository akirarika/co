import { search, Separator } from "@inquirer/prompts";
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
  const commands = [] as Array<{ name: string; value: string; path?: string; description?: "global" | "npm-script" | "workspace" }>;

  if (await exists(join(env.HOME || env.USERPROFILE || "/", ".commands"))) {
    const dir = await readdir(join(env.HOME || env.USERPROFILE || "/", ".commands"));
    let temp = [] as typeof commands;
    for (const file of dir) {
      if (!file.endsWith(".ts")) continue;
      temp.push({ name: file.slice(0, -3), value: file, path: join(env.HOME || env.USERPROFILE || "/", ".commands", file), description: "global" });
    }
    temp.sort((a, b) => a.name.localeCompare(b.name));
    commands.push(...temp);
  }

  if (await exists(join(cwd(), "package.json"))) {
    const packageJson = JSON.parse(await readFile(join(cwd(), "package.json"), "utf-8"));
    for (const key in packageJson?.scripts ?? {}) {
      commands.push({ name: key, value: key, path: key, description: "npm-script" });
    }
  }

  if (await exists(join(cwd(), ".commands"))) {
    const dir = await readdir(join(cwd(), ".commands"));
    let temp = [] as typeof commands;
    for (const file of dir) {
      if (!file.endsWith(".ts")) continue;
      commands.push({ name: file.slice(0, -3), value: file, path: join(cwd(), ".commands", file), description: "workspace" });
    }
    temp.sort((a, b) => a.name.localeCompare(b.name));
    commands.push(...temp);
  }

  if (commands.length === 0) {
    consola.warn("There is no command yet.");
    consola.info(`Docs: https://github.com/akirarika/co`);
    return;
  }

  const selected = await search({
    message: "Which command to execute?",
    source: async (input, { signal }) => {
      return commands.filter((command) => {
        return command.name.startsWith(input ?? "");
      });
    },
  });

  await run(params, commands.find((v) => v.value === selected)!);
  exit(0);
}
