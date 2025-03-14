# TSConfigurator: generate tsconfig.json

Prints a `tsconfig.json` to standard out. Supports two modes:

* `tsconfigurator --all`: print a tsconfig with everything.
* `tsconfigurator --interactive`: ask questions and print a tailored tsconfig.

## Run via `npx`

Print help:

```
npx tsconfigurator -h
```

## Run from inside the repository

Print help:

```
cd tsconfigurator/
node src/tsconfigurator.ts -h
```

## `package.json`

Don’t forget:

```json
"type": "module"
```

If you use Node.js, you’ll want to install `@types/node`
