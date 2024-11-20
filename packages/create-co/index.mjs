#!/usr/bin/env node
import os from "node:os";
import { join } from "node:path";
import { exit } from "node:process";
import { Readable } from "node:stream";
import { finished } from "node:stream/promises";
import { execFileSync } from "node:child_process";
import { mkdirSync, existsSync, createWriteStream } from "node:fs";
import { move, remove } from "fs-extra";
import consola from "consola";
import gradient from "gradient-string";
import * as tar from "tar";

const colorLong = gradient(["cyan", "green"]);
const color = gradient(["cyan", "#2d9b87"]);

(async () => {
  let workspace = process.platform === "win32" ? join(process.env.USERPROFILE, ".co") : join(process.env.HOME, ".co");
  let tempspace = process.platform === "win32" ? join(process.env.USERPROFILE, ".co", ".temp") : join(process.env.HOME, ".co", ".temp");
  if (!existsSync(workspace)) mkdirSync(workspace);
  if (!existsSync(tempspace)) mkdirSync(tempspace);

  let mirror = await consola.prompt(colorLong("Where do you want to download from? When one address is not available, you can try another one."), {
    type: "select",
    options: ["https://registry.npmjs.org/", "https://registry.npmmirror.com/", "https://mirrors.cloud.tencent.com/npm/", "https://cdn.jsdelivr.net/npm/", "Custom URL"],
  });
  if (mirror === "Custom URL") mirror = await consola.prompt(color("URL: "));

  let packageInfo = await (async () => {
    const response = await fetch(`${mirror}create-co`);
    const json = await response.json();
    return json;
  })();

  const url = `${mirror}co-${process.platform}-${os.arch()}/-/co-${process.platform}-${os.arch()}-${packageInfo["dist-tags"].latest}.tgz`;
  consola.start(url);
  consola.start(color(`Downloading..`));
  await utils.downloadFile(url, tempspace, "co.tgz");
  consola.success(color("Downloaded!"));

  consola.start(color(`Extracting..`));
  await tar.extract({
    file: join(tempspace, "co.tgz"),
    cwd: tempspace,
  });
  await utils.mvToPathAndClean(join(tempspace, "package"), process.platform === "win32" ? "co.exe" : "co", tempspace);
  consola.success(color("Extracted!"));

  console.log("");
  consola.info(color(`Try run: co --version`));
  consola.info(colorLong(`If you find that the co command does not exist, try restarting your Terminal or System`));
})();

const utils = {
  downloadFile: async (url, workspace, filename) => {
    const res = await fetch(url);
    if (!existsSync("downloads")) await mkdirSync("downloads");
    if (existsSync(join(workspace, filename))) await remove(join(workspace, filename));
    const destination = join(workspace, filename);
    const fileStream = createWriteStream(destination, { flags: "wx" });
    await finished(Readable.fromWeb(res.body).pipe(fileStream));
  },
  mvToPathAndClean: async (workspace, filename, tempspace) => {
    if (process.platform === "win32") {
      await new Promise((resolve) => setTimeout(resolve, 500));
      if (!(process.env.PATH.includes(`${join(process.env.USERPROFILE, ".co")};`) || process.env.PATH.includes(`;${join(process.env.USERPROFILE, ".co")}`) || process.env.PATH === `${join(process.env.USERPROFILE, ".co")}`)) {
        await utils.executePowershell(`[System.Environment]::SetEnvironmentVariable("PATH", [System.Environment]::GetEnvironmentVariable("PATH", "User") + ";${join(process.env.USERPROFILE, ".co")}", "User");`);
      }
      if (!existsSync(process.env.USERPROFILE, ".co")) mkdirSync(process.env.USERPROFILE, ".co");
      await utils.executePowershell(`Remove-Item -Force "${join(process.env.USERPROFILE, ".co", filename)}"; Move-Item -Path "${join(workspace, filename)}" -Destination "${join(process.env.USERPROFILE, ".co")}";`);
      await utils.executePowershell(`Remove-Item -Recurse -Force "${join(tempspace)}";`);
      return;
    }
    if (process.platform === "linux") {
      const paths = [join(process.env.HOME, ".bin"), "/usr/bin/", "/usr/sbin"];
      let pathChecked = "";
      for (const path of paths) {
        if (process.env.PATH.includes(`${path}:`) || process.env.PATH.includes(`:${path}`) || process.env.PATH === `${path}`) {
          pathChecked = path;
          break;
        }
      }
      if (!pathChecked) {
        consola.error(color("No path found!"));
        exit(0);
      }
      if (!existsSync(pathChecked)) mkdirSync(pathChecked);
      if (existsSync(join(pathChecked, filename))) {
        if (pathChecked.startsWith("/home")) await utils.executeBash(`rm -f ${join(pathChecked, filename)}`);
        else await utils.executeBash(`sudo rm -f ${join(pathChecked, filename)}`);
      }
      if (pathChecked.startsWith("/home")) await utils.executeBash(`mv ${join(workspace, filename)} ${pathChecked} && chmod +x ${join(pathChecked, filename)} && rm -rf ${join(tempspace)}`);
      else await utils.executeBash(`sudo mv ${join(workspace, filename)} ${pathChecked} && sudo chmod +x ${join(pathChecked, filename)} && sudo rm -rf ${join(tempspace)}`);
    }
    if (process.platform === "darwin") {
      const paths = [join(process.env.HOME, "bin"), join(process.env.HOME, ".bin"), join(process.env.HOME, ".local", "bin"), "/usr/local/bin"];
      let pathChecked = "";
      for (const path of paths) {
        if (process.env.PATH.includes(`${path}:`) || process.env.PATH.includes(`:${path}`) || process.env.PATH === `${path}`) {
          pathChecked = path;
          break;
        }
      }
      if (!pathChecked) {
        consola.error(color("No path found!"));
        exit(0);
      }
      if (!existsSync(pathChecked)) mkdirSync(pathChecked);
      if (existsSync(join(pathChecked, filename))) {
        if (pathChecked.startsWith("/Users")) await utils.executeBash(`rm -f ${join(pathChecked, filename)}`);
        else await utils.executeBash(`sudo rm -f ${join(pathChecked, filename)}`);
      }
      if (pathChecked.startsWith("/Users")) await utils.executeBash(`mv ${join(workspace, filename)} ${pathChecked} && chmod +x ${join(pathChecked, filename)} && rm -rf ${join(tempspace)}`);
      else await utils.executeBash(`sudo mv ${join(workspace, filename)} ${pathChecked} && sudo chmod +x ${join(pathChecked, filename)} && sudo rm -rf ${join(tempspace)}`);
    }
  },
  executePowershell: async (script) => {
    return execFileSync("powershell.exe", ["-c", script], {
      stdio: "inherit",
    });
  },
  executeBash: (script) => {
    return execFileSync("bash", ["-c", script], {
      stdio: "inherit",
    });
  },
};
