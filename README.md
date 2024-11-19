# 🥵 Never Worry About Which Package Manager to Use Again!

English | [中文](./README_ZH.md)

## Installation

```bash
bun create co
```

```bash
npm create co
```

You can use any package manager you like to install `co`. This is the simplest method.

co - **🥵 Never Worry About Which Package Manager to Use Again!**

In the JavaScript community, there are many package managers, such as `npm`, `bun`, `yarn`, `pnpm`, `cnpm`, and so on...

Before installing a package in different projects, you first need to recall the package manager used by this project, and then run the corresponding commands.

Due to muscle memory, I often habitually run `npm i` wrongly in those `yarn`, `pnpm`, `bun` projects. This feeling is really painful...

To solve this problem, I wrote `co`. You can execute commands of different package managers freely according to different projects through a set of identical commands.

## Scripts

Behind achieving such magic is the scripting functionality of `co`, just like the `scripts` in `package.json` of `npm`.

The scripting functionality of `co` can also provide many additional benefits. For example, I often need to write some scripts in different projects, such as building, packaging, releasing, etc. The scripts of each project may be different, and `co` supports you to write your scripts directly in the form of TypeScript and execute them easily.

## Cross-platform

Bun is a very useful JavaScript runtime, and `co` is developed using Bun. In Bun, there is a very useful $ Shell functionality:

```ts
await $`cd your/project/path && bun run index.ts`;
```

You can use the wonderful syntax above to execute any command you want to execute. Meanwhile, it is cross-platform (although the syntax is similar to ShellScript). Even on Windows, your scripts can work correctly.

Even if Bun is not installed in your system, you can execute commands in this way because `co` is developed using Bun.

## Engineering

`ni` is a tool with similar functionality to `co`. It decides which package manager to use by recognizing the lock files in your project directory. However, this may cause some problems in the scenario of multi-person collaboration. People who are not familiar with the project may accidentally use the package manager wrongly and submit the lock files to Git, resulting in you using the wrong package manager when using it.

`co` creates a `.commands` directory in the root directory of your project to remember the package manager you are using. In this way, regardless of whether there are lock files in your project or what kind of lock files there are, `co` can correctly select the package manager you expect to use.

At the same time, any `.ts` file created under `.commands` will become a script of `co`, and you can run it directly by using `co filename`. We can place some build, package, and release scripts shared among the team here, so that anyone can run them conveniently and without coupling with other projects.

## Usage

Usually, when we start the development of a project, we will run `npm run dev`. Now, you only need to use `co dev`:

```sh
co dev
```

Also, if you want to install the `lodash` package, you can do it like this:

```sh
co install lodash
co add lodash
co i lodash
co a lodash
```

Yes, each of the above commands is equivalent. They are just different aliases for the same operation, which is to take care of users with different package manager habits.

Behind the scenes, `co` will automatically convert to the specific commands of the package manager you are using according to the package manager preset you selected for the project not long ago:

```sh
npm install --save lodash
yarn add lodash
pnpm add lodash
bun add lodash
```

For common operations, `co` also thoughtfully provides you with unified abbreviations. For example, to install `eslint` globally:

```sh
co install --global eslint
co add --global eslint
co i -g eslint
co a -g eslint
```

You can read this [Alias List](./ALIAS_LIST.md) to understand what aliases are provided by the preset of `co`.

## Scripts

When there is a `.ts` file in the `.commands` directory under your project, you can run it directly using `co`.

In addition, you can also write some scripts in the global scope and place them in the `~/.commands` directory. `co` can also recognize and run them.

For example, we write a greeting script and save it as `hello.ts`:

```ts
import { $ } from "bun";

self.addEventListener("message", async (event: MessageEvent) => {
  // Some command line parameter information passed when using
  console.log(event.data);

  // Run shell commands. Even if Bun is not installed, the complete Bun API can be used.
  await $`echo hello world`;

  // Send an exit message to close the process after running is completed.
  postMessage("exit");
});
```

Among them, we can obtain the user's parameters. For example, when executing:

```bash
co hello world -foo -bar=baz
```

The following information can be obtained in `event.data`:

```ts
{
  command: "hello",
  commands: [ "world" ],
  options: {
    foo: "1",
    bar: "baz",
  },
  raw: [ "world", "-foo", "-bar=baz" ]
}
```

## From the Community

If you have written some useful scripts, you are welcome to share them. You can place the link of your script here by submitting a PR.