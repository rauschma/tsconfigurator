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
npm install
node src/tsconfigurator.ts -h
```

## `package.json`

Don’t forget:

```json
"type": "module"
```

If you use Node.js, you’ll want to install `@types/node`

## Further reading

* [My guide to `tsconfig.json`](https://2ality.com/2025/01/tsconfig-json.html)
