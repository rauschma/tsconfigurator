export type TagFunction<R> = (
  templateStrings: TemplateStringsArray,
  ...substitutions: unknown[]
) => R;

export class UnexpectedValueError extends Error {
  constructor(
    // Type enables type checking
    value: never,
    // Avoid exception if `value` is:
    // - object without prototype
    // - symbol
    message = `Unexpected value: ${{}.toString.call(value)}`
  ) {
    super(message)
  }
}