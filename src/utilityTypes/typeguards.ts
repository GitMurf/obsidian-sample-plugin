// basic primitive type guards
function isString(value: unknown): value is string {
  return typeof value === 'string';
}

function isNumber(value: unknown): value is number {
  return typeof value === 'number';
}

function isBoolean(value: unknown): value is boolean {
  return typeof value === 'boolean';
}

function isSymbol(value: unknown): value is symbol {
  return typeof value === 'symbol';
}

function isBigInt(value: unknown): value is bigint {
  return typeof value === 'bigint';
}

function isUndefined(value: unknown): value is undefined {
  return typeof value === 'undefined';
}

function isNull(value: unknown): value is null {
  return value === null;
}

function isObject(value: unknown): value is object {
  return typeof value === 'object' && !isNull(value);
}

export const UtilityTypeGuards = {
  primitive: {
    isString,
    isNumber,
    isBoolean,
    isSymbol,
    isBigInt,
    isUndefined,
    isNull,
    isObject,
  },
  advanced: {},
};
