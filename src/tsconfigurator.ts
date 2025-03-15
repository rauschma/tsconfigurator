#!/usr/bin/env node
import { checkbox, select, Separator } from '@inquirer/prompts';
import ejs from 'ejs';
import * as fs from 'node:fs';
import { parseArgs, styleText } from 'node:util';
import pkg from '../package.json' with { type: 'json' };
import { UnexpectedValueError, type TagFunction } from './util.ts';

const BIN_NAME = Object.keys(pkg.bin)[0];
const {log} = console;
const b: TagFunction<string> = (templateStrings, ...substitutions) => (
  styleText('bold', String.raw(templateStrings, ...substitutions))
);
const u: TagFunction<string> = (templateStrings, ...substitutions) => (
  styleText('underline', String.raw(templateStrings, ...substitutions))
);

function printHelp(): void {
  log(b`${BIN_NAME}:`);
  log(`• Print a tsconfig.json file to standard output`);
  log(`• Version: TypeScript 5.8`);
  log();
  log(`Synonpsis:`);
  log(b`  ${BIN_NAME} --interactive`);
  log(b`  ${BIN_NAME} --all`);
  log();
  log(`Options:`);
  log(`  ${b`--interactive -i`} Ask ${questions.length} questions and tailor output`);
  log(`  ${b`--all -a`}         Print everything`);
  log();
  log(`  ${b`--help -h`}        Print help`);
  log(`  ${b`--version -v`}     Print version`);
}

async function main(): Promise<void> {
  const options = {
    interactive: {
      type: 'boolean',
      short: 'i',
    },
    all: {
      type: 'boolean',
      short: 'a',
    },
    help: {
      type: 'boolean',
      short: 'h',
    },
    version: {
      type: 'boolean',
      short: 'v',
    },
  } as const;
  const {
    values,
  } = parseArgs({ options, allowPositionals: true });

  if (values.version) {
    console.log(`${pkg.name} ${pkg.version}`);
    return;
  }
  if (values.help) {
    printHelp();
    return;
  }
  if (values.interactive) {
    await generateInteractively();
    return
  }
  if (values.all) {
    generate({ALL: true});
    return
  }

  printHelp();
}

type Choice<Value> = {
  value: Value;
  name?: string;
  description?: string;
  short?: string;
  disabled?: boolean | string;
  type?: never;
};
type Choices = ReadonlyArray<Separator | Choice<string>>;

const questions: Array<{kind: 'single'|'multi', message: string, choices: Choices}> = [
  {
    kind: 'single',
    message: 'Should TypeScript only allow JavaScript features at the non-type level (forbids: JSX, enums, constructor parameter properties, namespaces)?',
    choices: [
      {
        name: 'Only JavaScript (erasableSyntaxOnly)',
        value: 'erasableSyntaxOnly',
      },
      {
        name: 'All of TypeScript',
        value: 'allOfTs',
      },
    ],
  },
  {
    kind: 'single',
    message: 'Which filename extension do you want to use in local imports?',
    choices: [
      {
        name: '.ts (needed for running TypeScript directly)',
        value: 'useFilenameExtensionTsInImports',
      },
      {
        name: '.js',
        value: 'useFilenameExtensionJsInImports',
      },
    ],
  },
  {
    kind: 'single',
    message: 'Do you want to transpile new ECMAScript features to older versions (to support older JavaScript engines)?',
    choices: [
      {
        name: 'Don’t transpile',
        value: 'dontTranspile',
      },
      {
        name: 'Transpile new JS to old JS',
        value: 'transpileNewJsToOld',
      },
    ],
  },
  {
    kind: 'multi',
    message: 'What files should tsc emit? (Select nothing if you only want to use it for type checking)',
    choices: [
      {
        name: '.js',
        value: 'tscEmitsJs',
      },
      {
        name: '.d.ts',
        value: 'tscEmitsDts',
      },
    ],
  },
];

async function generateInteractively() {
  log(b`${BIN_NAME}:`);
  log (`• Please answer ${questions.length} questions and tsconfigurator will print a tsconfig.json to standard output.`);
  log(`• You may have to remove a few lines. Which ones those are should be clear from the comments.`);
  log();

  const opts: Record<string, boolean> = Object.create(null);
  for (const question of questions) {
    switch (question.kind) {
      case 'single': {
        const answer = await select({
          message: question.message,
          choices: question.choices,
        });
        opts[answer] = true;
        break;
      }
      case 'multi':{
        const answers = await checkbox({
          message: question.message,
          choices: question.choices,
        });
        for (const answer of answers) {
          opts[answer] = true;
        }
        break;
      }
      default:
        throw new UnexpectedValueError(question.kind);
    }
  }
  generate(opts);
}

function generate(opts: Record<string, boolean>): void {
  const str = fs.readFileSync(
    new URL('../tmpl/tsconfig.tmpl.json', import.meta.url),
    'utf-8'
  );
  const template = ejs.compile(str, {
    localsName: 'opts',
    openDelimiter: '/',
    closeDelimiter: '/',
    delimiter: '*', // after openDelimiter, before closeDelimiter
  });
  console.log(template(opts).replaceAll('◆', '*'));  
}

await main();
