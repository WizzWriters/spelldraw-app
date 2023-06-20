# Whiteboard app

Frontend for our whiteboard.

## Project Setup

For now we only support running this project under Linux operating system.

### Environment setup

First install and run the server: https://github.com/WizzWriters/spelldraw-server.

Because we are using TensorFlow.js which requires specific version of Tensorflow
and python, there are some additional steps needed first.

1. Create and activate virtual environment
```sh
virtualenv venv
. venv/bin/activate
```
2. Install python dependencies
```
pip install -r requirements.txt
```
3. Run script to download and build tensorflow models
```sh
./tools/build-models
```
4. Install node dependencies
```sh
npm ci
```

From now on you can run the project. For example with `npm run dev`.

## NPM Scripts

### Compile and Hot-Reload for Development

```sh
npm run dev
```

Sometimes it's useful to expose the project in local network (for example to test
it on mobile). In that case run:
```sh
npm run dev-expose
```
and enter the 'Network' addres on any device.

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

To perform only type checking you can run:
```sh
npm run type-check
```

### Lint with [ESLint](https://eslint.org/)

To validate:
```sh
npm run lint-check
```

To run lint and fix:
```sh
npm run lint
```

### Format

To format:
```sh
npm run format
```

To check formating:
```sh
npm run format-check
```

Please run format, lint and type checks before each commit.

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur) + [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin).

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin) to make the TypeScript language service aware of `.vue` types.

(**WSL Users! - this is required!**) If the standalone TypeScript plugin doesn't feel fast enough to you, Volar has also implemented a [Take Over Mode](https://github.com/johnsoncodehk/volar/discussions/471#discussioncomment-1361669) that is more performant. You can enable it by the following steps:

1. Disable the built-in TypeScript Extension
    1) Run `Extensions: Show Built-in Extensions` from VSCode's command palette
    2) Find `TypeScript and JavaScript Language Features`, right click and select `Disable (Workspace)`
2. Reload the VSCode window by running `Developer: Reload Window` from the command palette.
