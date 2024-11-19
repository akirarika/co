import { bootstrap } from "./bootstrap";
import { index } from "./commands";
import { init } from "./commands/init";
import { install } from "./commands/install";
import { uninstall } from "./commands/uninstall";
import { upgrade } from "./commands/upgrade";
import { run } from "./commands/run";
import { execute } from "./commands/execute";
import { create } from "./commands/create";
import { version } from "./commands/version";

const commands = {
  // index
  index: index,
  // init
  init: init,
  // install
  install: install,
  i: install,
  add: install,
  a: install,
  // upgrade
  upgrade: upgrade,
  update: upgrade,
  u: upgrade,
  // uninstall
  uninstall: uninstall,
  remove: uninstall,
  un: uninstall,
  // run
  run: run,
  r: run,
  // execute
  execute: execute,
  dlx: execute,
  x: execute,
  create: create,
  c: create,
  // version
  version: version,
  v: version,
};

await bootstrap(commands);
