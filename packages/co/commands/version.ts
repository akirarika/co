import type { Params } from "../types";
import { version as v } from "../version";
import { cwd, env } from "node:process";
import { join } from "node:path";

export async function version(params: Params) {
  console.log(v);
  console.log("global:" + join(env.HOME || env.USERPROFILE || "/", ".commands"));
  console.log("workspace:" + join(cwd(), ".commands"));
}
