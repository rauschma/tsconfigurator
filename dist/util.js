export class UnexpectedValueError extends Error {
    constructor(
    // Type enables type checking
    value, 
    // Avoid exception if `value` is:
    // - object without prototype
    // - symbol
    message = `Unexpected value: ${{}.toString.call(value)}`) {
        super(message);
    }
}
//# sourceMappingURL=util.js.map