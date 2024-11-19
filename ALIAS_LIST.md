## Alias List (JavaScript Package Manager) / 别名列表 (JavaScript 包管理器)

### Run Script / 运行脚本

Alias: `run`, `r`

Compare NPM: `npm run`

```sh
co r dev
```

When a command does not exist, co will attempt to run it using the run command. Therefore, we can directly:

当一个命令不存在时，co 将尝试使用 run 命令来运行它。因此，我们可以直接：

```sh
co dev
```

### Execute (npx) / 执行 (npx)

Alias: `execute`, `x`

Compare NPM: `npx`

```sh
co x prisma
```

### Installation dependencies / 安装依赖

Alias: `install`, `i`, `add`, `a`

Compare NPM: `npm install`

```sh
co i
```

### install a package / 安装一个包

Alias: `install`, `i`, `add`, `a`

Compare NPM: `npm install --save`

```sh
co i lodash
```

### Install a package (to development environment) / 安装一个包 (至开发环境)

Alias: `install:dev`, `i:d`, `add:dev`, `a:d`

Compare NPM: `npm install --save-dev`

```sh
co i:d typescript
```

### Install a package (to global) / 安装一个包 (至全局)

Alias: `install:global`, `i:g`, `add:global`, `a:g`

Compare NPM: `npm install --global`

```sh
co i:g typescript
```

### Update dependencies / 更新依赖

Alias: `update`, `up`, `upgrade`

Compare NPM: `npm upgrade`

```sh
co up
```

### Uninstall a package / 卸载一个包

Alias: `uninstall`, `un`, `remove`, `rm`

Compare NPM: `npm uninstall`

```sh
co rm jquery
```