import type { Params } from "../types";
import { version as v } from "../version";

export async function version(params: Params) {
  console.log(v);
}
