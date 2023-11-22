export type { Sum as UtilityNumberSum } from './sum';
export type {
  SortTupleNumbers as UtilitySortTupleNumbers,
  SortTupleAlphabetical as UtilitySortTupleAlphabetical,
} from './sort';

/*
  GENERAL UTILITY TYPES
*/

export type UtilityClassPropertyNames<TClass> = {
  [P in keyof TClass]: TClass[P] extends (
    (() => unknown) | ((...args: unknown[]) => unknown)
  ) ?
    never
  : P;
}[keyof TClass];

// fixed before for Object.keys()
export function utilityObjectKeys<TObj extends object>(obj: TObj): (keyof TObj)[] {
  return Object.keys(obj) as (keyof TObj)[];
}

export function utilityObjectKeysSet<
  TObj,
  TKey extends keyof TObj,
  TVal extends TObj[TKey],
>(obj: TObj, key: TKey, newVal: TVal): TObj {
  obj[key] = newVal;
  return obj;
}

export type UtilityObjectRemoveFunctionsMethods<
  TObj extends object,
  TExceptions extends keyof TObj = never,
> = {
  [P in keyof TObj as TObj[P] extends (
    (() => unknown) | ((...args: unknown[]) => unknown)
  ) ?
    P extends TExceptions ?
      P
    : never
  : P]: TObj[P];
};

export type UtilityObjectOverrideKeyValues<
  TObj,
  TKeys extends keyof TObj,
  TUpdateType,
> = {
  [P in keyof TObj]: P extends TKeys ? TUpdateType : TObj[P];
};

export type UtilityObjectWritable<T> = {
  -readonly [P in keyof T]: T[P];
};

// opposite of Readonly<Tuple[]>
export type UtilityTupleWritable<TTuple extends readonly unknown[] | unknown[]> = [
  ...TTuple,
];

// types that can be used in type template literal string
export type UtilityTypesStringable = string | number | bigint | boolean;

interface UtilityTupleChangeTypeEnum {
  append: 'append';
  prepend: 'prepend';
  replace: 'replace';
  remove: 'remove';
  insertBefore: 'insertBefore';
  insertAfter: 'insertAfter';
  addAsUnion: 'addAsUnion';
  excludeFromUnion: 'excludeFromUnion';
}

type UtilityTupleChangeItemAtIndexProcessChange<
  TOldValue,
  TChangeToValue,
  TChangeType extends keyof UtilityTupleChangeTypeEnum,
> = TChangeType extends 'append' ?
  TOldValue extends UtilityTypesStringable ?
    [`${TOldValue}${TChangeToValue & string}`]
  : never
: TChangeType extends 'prepend' ?
  TOldValue extends UtilityTypesStringable ?
    [`${TChangeToValue & string}${TOldValue}`]
  : never
: TChangeType extends 'replace' ? [TChangeToValue]
: TChangeType extends 'remove' ? []
: TChangeType extends 'insertBefore' ? [TChangeToValue, TOldValue]
: TChangeType extends 'insertAfter' ? [TOldValue, TChangeToValue]
: TChangeType extends 'addAsUnion' ? [TOldValue | TChangeToValue]
: TChangeType extends 'excludeFromUnion' ? [Exclude<TOldValue, TChangeToValue>]
: never;

// this is actually quite awesome! Replace/remove/append etc. any Tuple items based on its index
export type UtilityTupleChangeItemAtIndex<
  TTuple extends readonly unknown[] | unknown[],
  TChangeToValue = undefined,
  TChangeType extends keyof UtilityTupleChangeTypeEnum = 'append',
  TIndex extends UtilityTupleIndexList<TTuple> | null = null,
  TAcc extends unknown[] = [],
> = TIndex extends null ?
  TAcc extends [] ? undefined
  : TAcc extends [infer TOld, ...infer TRest] ?
    [
      ...TTuple,
      ...UtilityTupleChangeItemAtIndexProcessChange<TOld, TChangeToValue, TChangeType>,
      ...TRest,
    ]
  : never
: TTuple extends [...infer TStart, infer TLast] ?
  UtilityTupleChangeItemAtIndex<
    TStart,
    TChangeToValue,
    TChangeType,
    TIndex extends UtilityTupleIndexList<TStart> ? TIndex : null,
    [TLast, ...TAcc]
  >
: never;

export type UtilityTupleGetLength<TTuple extends readonly unknown[] | unknown[]> =
  TTuple['length'];

// if a Tuple has 3 items this returns '0' | '1' | '2'
type UtilityTupleIndexList<TTuple extends readonly unknown[] | unknown[]> = {
  [P in keyof TTuple]: P extends `${number}` ? P : never;
}[keyof TTuple];

export type UtilityObjectIsPlainObject<T> =
  T extends object ?
    T extends unknown[] | [] ? false
    : T extends Date ? false
    : T extends (() => unknown) | ((...args: unknown[]) => unknown) ? false
    : true
  : false;

// traverses an object and its nested keys until it matches the key(s) provided
export type UtilityObjectGetNestedUnion<
  TObj,
  TFindKey extends PropertyKey | undefined = undefined,
  // optional one last layer deeper and also will check if Array[] and index with [number]
  TFinalIndex = undefined,
> = UtilityObjectIsPlainObject<TObj> extends false ? never
: TFindKey extends NonNullable<keyof TObj> ?
  TFinalIndex extends undefined ? TObj[TFindKey]
  : TFinalIndex extends keyof TObj[TFindKey] ? TObj[TFindKey][TFinalIndex]
  : TObj[TFindKey] extends unknown[] ?
    TFinalIndex extends keyof TObj[TFindKey][number] ?
      TObj[TFindKey][number][TFinalIndex]
    : TObj[TFindKey]
  : TObj[TFindKey]
: {
    [P in keyof TObj]: UtilityObjectGetNestedUnion<TObj[P], TFindKey, TFinalIndex>;
  }[keyof TObj];

// This take an object Type that had two intersections and merges them into a single index signature to look like one regular object
// Basically it is difference between type showing "Obj1 & Obj2" vs "Obj1 (with combined keys)"
export type UtilityObjectMergeIntersection<T> = {
  [P in keyof T]: T[P];
};

/*
  VARIOUS HELPERS FOR DETERMINING TYPES OF: null, undefined, any, unknown, never
*/

// NEVER
export type UtilityIsNever<T> =
  Exclude<T extends never ? true : false, never> extends never ? true : false;
type HelperBooleanInverse<T> = T extends true ? false : true;
type HelperIsNotNever<T> = HelperBooleanInverse<UtilityIsNever<T>>;

// GENERICS FOR NULL AND UNDEFINED OPERATIONS
type HelperIsNullOrUndefinedOnly<
  T,
  TNullOrUndefined extends null | undefined,
> = UtilityIsNever<
  Extract<T, T> extends TNullOrUndefined ?
    Extract<T, T> extends never ? false
    : NonNullable<T> extends never ? never
    : false
  : false
>;
type HelperHasNullOrUndefined<
  T,
  TNullOrUndefined extends null | undefined,
> = HelperIsNullOrUndefinedOnly<Extract<T, TNullOrUndefined>, TNullOrUndefined>;

// NULL
export type UtilityIsNullOnly<T> = HelperIsNullOrUndefinedOnly<T, null>;
export type UtilityHasNull<T> = HelperHasNullOrUndefined<T, null>;

// UNDEFINED
export type UtilityIsUndefinedOnly<T> = HelperIsNullOrUndefinedOnly<T, undefined>;
export type UtilityHasUndefined<T> = HelperHasNullOrUndefined<T, undefined>;

// ANY
type HelperHasTrue<T> = HelperIsNotNever<T extends true ? true : never>;
type _HelperHasFalse<T> = HelperIsNotNever<T extends false ? true : never>;
export type UtilityIsAny<T> = HelperHasTrue<
  Extract<unknown, T> extends never ? false
  : Exclude<NonNullable<T>, object> extends never ? false
  : true
>;
// Option 2: Exclude<T extends never ? true : false, false>;
// Option 3: UtilityIsNever<T extends never ? true : never>;

// UNKNOWN
export type UtilityIsUnknown<T> = UtilityIsNever<
  NonNullable<Extract<T, T>> extends never ? false
  : NonNullable<T> extends object ?
    Exclude<T, object> extends never ? false
    : Exclude<T, object> extends undefined | null ? false
    : never
  : false
>;

// Now check for either UNKNOWN or ANY
export type UtilityIsUnknownOrAny<T> =
  UtilityIsUnknown<T> extends true ? 'true1' : UtilityIsAny<T>;

export type UtilityGetNullable<T> = Extract<T, null | undefined>;

// Get required and optional properties from object type
export type UtilityObjectGetOptionalNewObj<T> = {
  [K in keyof T as T[K] extends undefined ? K
  : UtilityGetNullable<T[K]> extends never ? never
  : UtilityGetNullable<T[K]> extends undefined ? K
  : never]+?: T[K];
};
export type UtilityObjectGetOptionalKeys<T> = keyof UtilityObjectGetOptionalNewObj<T>;

export type UtilityObjectGetRequiredNewObj<T> = {
  [K in keyof T as true extends UtilityIsUnknownOrAny<T[K]> ? K
  : undefined extends T[K] ? never
  : K]-?: T[K];
};
export type UtilityObjectGetRequiredKeys<T> = keyof UtilityObjectGetRequiredNewObj<T>;

export type UtilityIfNeverThen<T, TReplace = unknown> = UtilityIsNever<T> extends true ?
  TReplace
: T;
export type UtilityIfThen<T, TIf, TThen = unknown> = T extends TIf ? TThen : T;

// Extract<T, T> is a trick that prevents T = never from auto just returning never without evaluating the expression
export type UtilityIfThenElse<T, TIf, TThen, TElse> =
  Extract<T, T> extends TIf ? TThen : TElse;

/*
  make all optional and then replace any that were not undefined (making them required)
*/
export type UtilityObjectModifyOptionalRequired<
  TObj extends object,
  TOptional extends UtilityObjectGetRequiredKeys<TObj> = never,
  TRequire extends UtilityObjectGetOptionalKeys<TObj> = never,
> = UtilityObjectMergeIntersection<
  Partial<TObj> & {
    [P in keyof TObj as P extends TRequire ? P
    : P extends TOptional ? never
    : undefined extends TObj[P] ? never
    : // eslint-disable-next-line @typescript-eslint/no-explicit-any -- any exception ok here
      P]-?: UtilityIfThenElse<Exclude<TObj[P], undefined>, never, any, TObj[P]>;
  }
>;

/*
  OTHER GENERICS
*/

type _IgnoreEslintErrors = A1 | A2 | B1 | B2 | B3 | B4 | B5 | TestA1;

// Remove duplicate Tuple items

export type UtilityTupleUniqueRemoveDuplicates<
  TTuple extends readonly unknown[] | unknown[],
> = UtilityUnionToTuple<TTuple[number]>;

type B5 = UtilityTupleUniqueRemoveDuplicates<[1, 2, 4, 1, 2, 2, 6]>;
//    ^?

// Remove matching items from Tuple

export type UtilityTupleExclude<
  TTuple extends readonly unknown[] | unknown[],
  TRemove extends TTuple[number] | TTuple[number][],
  TAcc extends unknown[] = [],
  TUnionRemove = TRemove extends TTuple[number] ? TRemove
  : TRemove extends TTuple[number][] ? TRemove[number]
  : never,
> = TTuple extends [] ? TAcc
: TTuple extends [infer TFirst, ...infer TRest] ?
  TFirst extends TUnionRemove ?
    UtilityTupleExclude<TRest, TRemove, TAcc, TUnionRemove>
  : UtilityTupleExclude<TRest, TRemove, [...TAcc, TFirst], TUnionRemove>
: never;

type B4 = UtilityTupleExclude<['foo', 3, 99, 'bar', 3], 'foo' | 99>;
//    ^?

// convert string number to actual number
export type UtilityConvertStringToNumber<T extends string | number> =
  T extends number ? T
  : T extends `${infer TNumber extends number}` ? TNumber
  : never;

type B3 = UtilityConvertStringToNumber<'23'>;
//       ^?

// Union to Intersection

export type UtilityUnionToIntersection<T> =
  (T extends T ? (arg: T) => unknown : never) extends (arg: infer U) => unknown ? U
  : never;

type A1 = UtilityUnionToIntersection<{ a: 'a'; c: 'c' } | { a: string; b: 'b'; d: 'd' }>;
//    ^?

// Union to Tuple

type LastInUnion<T> =
  UtilityUnionToIntersection<T extends T ? (arg: T) => unknown : never> extends (
    (arg: infer TLastUnion) => unknown
  ) ?
    TLastUnion
  : never;

export type UtilityUnionToTuple<TUnion, TLast = LastInUnion<TUnion>> = [TUnion] extends (
  [never]
) ?
  []
: [...UtilityUnionToTuple<Exclude<TUnion, TLast>>, TLast];

type A2 = UtilityUnionToTuple<'foo' | 'bar' | 'baz'>;
//    ^?

/**
 * Union to a new Union of Arrays
 * @example
 * ```ts
 * type Union = 'foo' | 'bar' | 'baz';
 * type UnionArray = UtilityUnionToUnionArray<Union>;
 * // result is: ['foo'] | ['bar'] | ['baz']
 * ```
 */
export type UtilityUnionToUnionArray<TUnion> = TUnion extends unknown ? TUnion[] : never;

/** type */
export type UtilityUnionStringAppend<
  T extends string,
  TPrepend extends string = '',
  TAppend extends string = '',
> = `${TPrepend}${T}${TAppend}`;

// Object keys to Union

export type UtilityObjectKeysToUnion<T extends object> = keyof T;

type B1 = UtilityObjectKeysToUnion<{ a: 'foo'; b: 'bar' }>;
//    ^?

// Object values to Union

export type UtilityObjectValuesToUnion<T extends object> = {
  [P in keyof T]: T[P];
}[keyof T];

type B2 = UtilityObjectValuesToUnion<{ a: 'foo'; b: 'bar' }>;
//    ^?

// Union to Object Interface

type PrimitiveTypeFunction = (...args: unknown[]) => unknown;

type UnionToObjectInterface<T> = {
  [P in T as P extends PropertyKey ? P
  : P extends boolean ?
    P extends false ?
      'false'
    : 'true'
  : P extends Date ? 'date'
  : P extends PrimitiveTypeFunction ? 'function'
  : P extends object ? 'object'
  : 'never']: P;
};

type TestA1 = UnionToObjectInterface<
  //    ^?
  | { a: 'this'; b: 987 }
  | 'foo'
  | 'bar'
  | number
  | ((arg1: string, arg2: number) => number)
>;

/*
  IPC TYPES
*/

export type UtilityRemoveMatchingStartOfString<
  T extends string,
  TFindStart extends string,
> = T extends `${TFindStart}${infer Rest}` ? Rest : never;

export type UtilityMakeFirstCharacterLowercase<T extends string> =
  T extends `${infer First}${infer Rest}` ? `${Lowercase<First>}${Rest}` : T;
