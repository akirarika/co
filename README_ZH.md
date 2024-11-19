# 🥵 再也别想该用啥包管理器了！

[English](README.md) | 中文

co - **🥵 再也别想该用啥包管理器了！**

在 JavaScript 社区中，有许多包管理器，例如 `npm`、`bun`、`yarn`、`pnpm`、`cnpm` 等等……

在不同的项目中，安装一个包之前，首先要回忆这个项目所使用的包管理器，然后再运行相应的命令。

由于肌肉记忆，我经常习惯性地在那些 `yarn`、`pnpm`、`bun` 项目中错误运行 `npm i`，这种感觉实在是太痛苦了……

为了解决这个问题，我编写了 `co`，你可以通过一套相同的命令，来自由地根据不同项目，执行不同的包管理器命令。

## 脚本

实现这样魔法的背后，是 `co` 的脚本功能，就像 `npm` 中 `package.json` 的 `scripts` 一样。

`co` 的脚本功能也可以提供许多额外的好处，例如，我经常需要在不同的工程中编写一些脚本，例如构建、打包、发行等，每个工程的脚本可能都是有差异的，而 `co` 支持你直接以 TypeScript 的形式来写你的脚本，并且简单地执行它。

## 跨平台

Bun 是一个非常好用的 JavaScript 运行时，而 `co` 则是使用 Bun 开发的，在 Bun 中，有一个非常好用的 $ Shell 功能：

```ts
await $`cd your/project/path && bun run index.ts`;
```

你可以使用上文这种奇妙的语法，来执行任何你想执行的命令。同时，这是跨平台的（尽管语法和 ShellScript 相似）。即使在 Windows 上，你的脚本也可以正确工作。

即使你的系统中没有安装 Bun，也可以这种方式来执行命令，因为 `co` 是使用 Bun 开发的。

## 工程化

`ni` 是一个和 `co` 功能类似的工具，它是通过识别你工程目录下的锁文件，来决定使用哪个包管理器的，但这在多人协作场景下可能会带来一些问题，有不熟悉工程的人可能会不小心地错误使用了包管理器，并且将锁文件提交到了 Git 中，导致你在使用时，使用了错误的包管理器。

`co` 通过在你工程根目录创建一个 `.commands` 目录，来记住你所使用的包管理器。这样无论你的工程中是否有锁文件，或者有哪些所文件，`co` 都能正确地选择你所期待使用的包管理器。

同时，你在 `.commands` 下创建的任何 `.ts` 文件，都会变为一个 `co` 的脚本，你可以直接通过 `co 文件名` 来运行它。我们可以将一些团队间共享的构建、打包、发行脚本放在这里，这样任何一个人都将可以方便地运行它们，并且不和其他工程产生耦合。

## 安装

```bash
bun create co
```

```bash
npm create co
```

你可以使用任何你喜欢的包管理器，来安装 `co`，这是最为简单的方法。

## 使用



通常，我们启动项目的开发会运行 `npm run dev`，现在，你只需要使用 `co dev`：

```sh
co dev
```

以及，你想要安装包 `lodash`，你可以这样做：

```sh
co install lodash
co add lodash
co i lodash
co a lodash
```

是的，以上每个命令都是等价的。他们只是同一个操作的不同别名，这是为了照顾不同包管理器习惯的使用者。

在背后，`co` 会根据你不久前为项目选择的包管理器预设，自动转化为你所使用的具体的包管理器的命令：

```sh
npm install --save lodash
yarn add lodash
pnpm add lodash
bun add lodash
```

对于常用的操作，`co` 也贴心地为你提供了统一的缩写，例如，将 `eslint` 安装到全局：

```sh
co install --global eslint
co add --global eslint
co i -g eslint
co a -g eslint
```

你可以通过阅读这一份[别名列表](./ALIAS_LIST.md)，来了解 `co` 的预设为你提供了哪些别名。

## 脚本

当你工程下的 `.commands` 目录中存在 `.ts` 文件时，你就可以使用 `co` 直接运行它。

除此以外，你也可以编写一些全局范围的脚本，放在 `~/.commands` 目录下，`co` 也可以识别到并运行它们。

例如，我们编写一个打招呼的脚本，保存为 `hello.ts`：

```ts
import { $ } from "bun";

self.addEventListener("message", async (event: MessageEvent) => {
  // 使用时传递的一些命令行参数信息
  console.log(event.data);

  // 运行 shell 命令，即使没有安装 Bun，也可以使用完整的 Bun API
  await $`echo hello world`;

  // 运行完成后，发送退出消息以关闭进程
  postMessage("exit");
});
```

其中，我们可以获取到用户的参数，例如，当执行：

```bash
co hello world -foo -bar=baz
```

在 `event.data` 中就可以获取到以下信息：

```ts
{
  command: "hello",
  commands: [ "world" ],
  options: {
    foo: "1",
    bar: "baz",
  },
  raw: [ "world", "-foo", "-bar=baz" ],
}
```

## 来自社区

如果你编写了一些实用的脚本，欢迎分享出来，可以通过提出 PR 的方式将你的脚本的链接放置于此。