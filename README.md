# Spelldraw app

Frontend for our whiteboard.

## Project Setup

For now we only support running this project under Linux operating system.

### Environment setup

First install and run the server: https://github.com/WizzWriters/spelldraw-server.

Because we are using TensorFlow.js which requires specific version of Tensorflow
and python, there are some additional steps needed first. In case of any problems
make sure you are not using the latest python version (try 3.10).

1. Create and activate virtual environment
```sh
python -m venv "venv"
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
