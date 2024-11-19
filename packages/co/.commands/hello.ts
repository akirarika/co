import { $ } from "bun";

self.addEventListener("message", async (event: MessageEvent) => {
  // Some command-line parameter information passed when using
  console.log(event.data);

  // Run a shell command, you can use the full Bun API even if you don't have Bun installed
  await $`echo hello world`;

  // After running, send an exit message to shut down the process
  postMessage("exit");
});
