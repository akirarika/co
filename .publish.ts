import { $, version } from "bun";
import { join } from "node:path";
import { readFile, writeFile } from "node:fs/promises";

const packageJson = {
  ...JSON.parse((await readFile(join(process.cwd(), "packages", "co", "package.json"))).toString()),
};
packageJson.version = prompt(`${join(process.cwd(), "package.json")}\nWhat is the new version? current version: ${packageJson.version}\n`);
await writeFile(join(process.cwd(), "packages", "co", "version.ts"), `export const version = "${packageJson.version}";`);
await writeFile(join(process.cwd(), "packages", "co", "package.json"), JSON.stringify({ ...packageJson }, null, 2));
await writeFile(join(process.cwd(), "packages", "create-co", "package.json"), JSON.stringify({ ...JSON.parse((await readFile(join(process.cwd(), "packages", "create-co", "package.json"))).toString()), version: packageJson.version }, null, 2));

await $`bun i`.cwd(join(process.cwd(), "packages", "co"));
await $`bun i`.cwd(join(process.cwd(), "packages", "create-co"));

await $`rm -rf ./dist`.cwd(join(process.cwd(), "packages", "co"));
// windows x64
await $`${{ raw: `bun build --minify --sourcemap=inline --compile --target=bun-windows-x64-baseline ./index.ts --outfile ./dist/co-win32-x64/co.exe` }}`.cwd(join(process.cwd(), "packages", "co"));
// linux x64
await $`${{ raw: `bun build --minify --sourcemap=inline --compile --target=bun-linux-x64-baseline ./index.ts --outfile ./dist/co-linux-x64/co` }}`.cwd(join(process.cwd(), "packages", "co"));
// linux arm64
await $`${{ raw: `bun build --minify --sourcemap=inline --compile --target=bun-linux-arm64-baseline ./index.ts --outfile ./dist/co-linux-arm64/co` }}`.cwd(join(process.cwd(), "packages", "co"));
// darwin x64
await $`${{ raw: `bun build --minify --sourcemap=inline --compile --target=bun-darwin-x64 ./index.ts --outfile ./dist/co-darwin-x64/co` }}`.cwd(join(process.cwd(), "packages", "co"));
// darwin arm64
await $`${{ raw: `bun build --minify --sourcemap=inline --compile --target=bun-darwin-arm64 ./index.ts --outfile ./dist/co-darwin-arm64/co` }}`.cwd(join(process.cwd(), "packages", "co"));

writeFile(join(process.cwd(), "packages", "co", "dist", "co-darwin-arm64", "package.json"), JSON.stringify({ ...packageJson, name: `co-darwin-arm64` }, null, 2));
writeFile(join(process.cwd(), "packages", "co", "dist", "co-darwin-x64", "package.json"), JSON.stringify({ ...packageJson, name: `co-darwin-x64` }, null, 2));
writeFile(join(process.cwd(), "packages", "co", "dist", "co-linux-arm64", "package.json"), JSON.stringify({ ...packageJson, name: `co-linux-arm64` }, null, 2));
writeFile(join(process.cwd(), "packages", "co", "dist", "co-linux-x64", "package.json"), JSON.stringify({ ...packageJson, name: `co-linux-x64` }, null, 2));
writeFile(join(process.cwd(), "packages", "co", "dist", "co-win32-x64", "package.json"), JSON.stringify({ ...packageJson, name: `co-win32-x64` }, null, 2));

await $`npm publish --access public`.cwd(join(process.cwd(), "packages", "co", "dist", "co-darwin-arm64"));
await $`npm publish --access public`.cwd(join(process.cwd(), "packages", "co", "dist", "co-darwin-x64"));
await $`npm publish --access public`.cwd(join(process.cwd(), "packages", "co", "dist", "co-linux-arm64"));
await $`npm publish --access public`.cwd(join(process.cwd(), "packages", "co", "dist", "co-linux-x64"));
await $`npm publish --access public`.cwd(join(process.cwd(), "packages", "co", "dist", "co-win32-x64"));

await $`npm publish --access public`.cwd(join(process.cwd(), "packages", "create-co"));
