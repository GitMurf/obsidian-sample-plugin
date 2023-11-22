/* eslint-disable @typescript-eslint/naming-convention -- for SortAlpha utility */
import type {
  UtilityConvertStringToNumber,
  UtilityNumberSum,
  UtilityTupleExclude,
  UtilityUnionToTuple,
} from './utilityTypes';

export type SortTupleNumbers<
  TTuple,
  TDescending extends boolean = false,
  TAcc = [],
> = TTuple extends [infer TFirst extends SortItemType, ...infer TRest] ?
  SortTupleNumbers<TRest, TDescending, SortTupleInsertSorted<TAcc, TFirst, TDescending>>
: TAcc;

// NOTE: This will only sort by the first letter
export type SortTupleAlphabetical<
  TTuple extends unknown[],
  TDescending extends boolean = false,
  TAcc extends unknown[] = [],
  TAlphaArray = SortTupleAlphaGetAlphaValue<TTuple>,
> = TTuple extends [] ? TAcc
: TAlphaArray[keyof TAlphaArray] extends [infer TFirst1, ...infer _TRest1] ?
  SortTupleNumbers<UtilityUnionToTuple<TFirst1>> extends (
    [infer TFirst2, ...infer _TRest2]
  ) ?
    TDescending extends false ?
      SortTupleAlphabetical<
        UtilityTupleExclude<TTuple, SortTupleGetMatches<TAlphaArray, TFirst2>>,
        TDescending,
        [...TAcc, ...UtilityUnionToTuple<SortTupleGetMatches<TAlphaArray, TFirst2>>]
      >
    : SortTupleAlphabetical<
        UtilityTupleExclude<TTuple, SortTupleGetMatches<TAlphaArray, TFirst2>>,
        TDescending,
        [...UtilityUnionToTuple<SortTupleGetMatches<TAlphaArray, TFirst2>>, ...TAcc]
        // TAlphaArray
      >
  : never
: never;

type A22 = [4, 3, 9, 1];

type _A22Result = SortTupleNumbers<A22>;
//         ^?

// type A23 = ['foo', 'adam', 'apple', 'ace', 'bar', 'baz', 'zoo', 'qux'];
type A23 = ['adapters', 'fileSystem', 'electron'];

type _A23Result = SortTupleNumbers<A23>;
//         ^?

type _A23ResultAlpha = SortTupleAlphabetical<A23>;
//         ^?

type SortTupleAlphaGetAlphaValue<TTuple extends unknown[]> = {
  [P in TTuple[number] extends PropertyKey ? TTuple[number]
  : never]: SortAlphaGetValueArray<P extends string ? P : never>;
};

type SortTupleGetMatches<TAlphaArray, TMatch> = keyof {
  [P in keyof TAlphaArray as TAlphaArray[P] extends [infer TFirst3, ...infer _TRest3] ?
    TFirst3 extends TMatch ?
      P
    : never
  : never]: true;
};

interface SortAlpha {
  a: 1;
  b: 2;
  c: 3;
  d: 4;
  e: 5;
  f: 6;
  g: 7;
  h: 8;
  i: 9;
  j: 10;
  k: 11;
  l: 12;
  m: 13;
  n: 14;
  o: 15;
  p: 16;
  q: 17;
  r: 18;
  s: 19;
  t: 20;
  u: 21;
  v: 22;
  w: 23;
  x: 24;
  y: 25;
  z: 26;
  A: 1;
  B: 2;
  C: 3;
  D: 4;
  E: 5;
  F: 6;
  G: 7;
  H: 8;
  I: 9;
  J: 10;
  K: 11;
  L: 12;
  M: 13;
  N: 14;
  O: 15;
  P: 16;
  Q: 17;
  R: 18;
  S: 19;
  T: 20;
  U: 21;
  V: 22;
  W: 23;
  X: 24;
  Y: 25;
  Z: 26;
}

type SortAlphaGetValue<TCharacter extends keyof SortAlpha> = SortAlpha[TCharacter];

type SortAlphaGetValueArray<
  TString extends string,
  TAcc extends unknown[] = [],
> = TString extends `${infer TFirst extends keyof SortAlpha}${infer TRest}` ?
  TRest extends string ?
    TRest extends '' ?
      [...TAcc, SortAlphaGetValue<TFirst>]
    : SortAlphaGetValueArray<TRest, [...TAcc, SortAlphaGetValue<TFirst>]>
  : never
: never;

// this is NOT going to work for what I need for sorting but is a cool calculation Type to keep
type _SortCalculateAlphaValue<
  TString extends string,
  TAcc extends number = 0,
> = TString extends `${infer TFirst extends keyof SortAlpha}${infer TRest}` ?
  _SortCalculateAlphaValue<
    TRest,
    UtilityConvertStringToNumber<UtilityNumberSum<SortAlphaGetValue<TFirst>, TAcc>>
  >
: TAcc;

type SortItemType = string | number | bigint;
type SortItemLength<
  TItem extends SortItemType,
  TCounter extends 1[] = [],
> = `${TItem}` extends (
  `${string}${string}${string}${string}${string}${string}${string}${string}${string}${string}${infer TInfer}`
) ?
  SortItemLength<TInfer, [...TCounter, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]>
: `${TItem}` extends `${string}${infer TInferB}` ?
  SortItemLength<TInferB, [...TCounter, 1]>
: TCounter['length'];

type SortGreaterThanDigits<
  TFirst extends SortItemType,
  TSecond extends SortItemType,
> = `0123456789` extends `${string}${TSecond}${string}${TFirst}${string}` ? true : false;

type SortGreaterThan<
  TX extends SortItemType,
  TY extends SortItemType,
  TXLen extends number = SortItemLength<TX>,
  TYLen extends number = SortItemLength<TY>,
> = TXLen extends TYLen ? SortGreaterThanDigits<TX, TY> : SortGreaterThan<TXLen, TYLen>;

type SortTupleInsertSorted<
  TEntries,
  TEntry extends SortItemType,
  TDescending extends boolean = false,
> = TEntries extends [infer TCurrent extends SortItemType, ...infer TRest] ?
  SortGreaterThan<TEntry, TCurrent> extends TDescending ?
    [TEntry, ...TEntries]
  : [TCurrent, ...SortTupleInsertSorted<TRest, TEntry, TDescending>]
: [TEntry];
