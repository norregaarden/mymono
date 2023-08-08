
import { configDotenv } from "dotenv";

// const parseToIf = (parseme, to, if)=>
//   parseme
type ss = string
type næ = unknown
type ay = any
type ar<T> = Array<T>

const nn = <T>(t: T): NonNullable<T> => {
  if (t == null) throw new Error('wtf t')
  return t
}

type EsUlt<Ok, Err = ss> =
  | { result: 'ok', ok: Ok }
  | { result: 'err', err: Err }
const euErr = <T, E>(err: E): EsUlt<T, E> => ({ result: 'err', err })
const euOk = <T, E>(ok: T): EsUlt<T, E> => ({ result: 'ok', ok })
const euOkErr = <T, E>(ok: T, err: E, okonlyif: boolean): EsUlt<T, E> => okonlyif ? euOk(ok) : euErr(err)
type IOParser<Input, Output = any, Eh = ss> = OIParser<Output, Input, Eh>
type OIParser<O, I = næ, Eh = ss> = {
  parse: (i: I) => EsUlt<O, Eh>,
}
type IParser<I, O = ay, E = ss> = OIParser<O, I, E>
type OParser<O, I = næ, E = ss> = OIParser<O, I, E>
type Parser = IOParser<any, any>
type PrsGetO<P extends Parser> = P extends OParser<infer O> ? O : never
type PrsGetI<P extends Parser> = P extends IParser<infer I> ? I : never

type ListyAha<T, From extends ar<ay> = any[]> = [...From, T]
type aha<Head = næ, Tail extends ar<ay> = ay> = [Head, ...Tail]
// type wow = CheckedFor<[næ, 'lol'], [næ]>
// type wow2 = CheckedFor< [næ], [næ, 'lol']>
// type lol = aha<næ> extends aha<næ, [næ]> ? true : false
type OhIsFun<Oh, Is extends aha = aha> = (...is: Is) => Oh
type OhIsFunGen = <Oh, Is extends aha = aha>(...is: Is) => Oh
// type lol = Extends
type CheckedFor<T, For> = T extends For ? T : never
type chckA<a, b> = a extends b ? a : never
type chckB<a, b> = b extends a ? a : never
type ab<a, b> = { a: a, b: b }
type ALWAYS<T> = T extends T ? T : never
type DICTIONARY<T> = ALWAYS<{ [k in keyof T]: T[k] }>
// type falsE<T> = T extends object ? DICTIONARY<T & { is: false }> : 'falsE'
// type True<T> = T extends object ? DICTIONARY<T & { is: true }> : 'True'
// type hmm = chckA<object, næ>
type falsE<T = næ> = T extends object ? DICTIONARY<T & { is: false }> : 'falsE'
type True<T = næ> = T extends object ? DICTIONARY<T & { is: true }> : 'True'
type ccd<a, b extends a> = { a: a, b: b }
// type ChckOhIsPrs<Oh, Is> = OhIsPrs<Oh, CheckedFor<Is, ListyAha<ay>>>
type OhIsPrs<Oh, Is extends aha = aha> = OhIsFun<EsUlt<Oh>, Is>
type chckTF<a, b, reverse = false> = { [k in reverse extends false ? 'a-extends-b' : 'b-extends-a']: a extends b ? True<reverse extends false ? ab<a, b> : næ> : falsE<reverse extends false ? ab<a, b> : næ> }
type chckABBA<a, b> = { 'a-equal-b': {ab:DICTIONARY<chckTF<a, b> & chckTF<b, a, true>>, ba:DICTIONARY<chckTF<b, a> & chckTF<a, b, true>>} }
// type Check
type lol = chckTF<[næ], aha>
type lolz = chckABBA<aha<string, string[]>, aha<'yay'>>
type loly = chckABBA<aha<string, string[]>, aha<'yay'>>
type ccOhIsPrs<Oh, Is = [næ]> = OhIsPrs<Oh, chckA<Is, aha>>
// type LOlz<A,B> = ccd<A,chck<A,B>>
// type WOWz = LOlz<'yay', 42>

const parseWith =
  <W>(w: W) =>
    <P extends IParser<W>>(p: P) =>
      p.parse(w)
const wiiprs = <W extends { toString(): string }>(wii: W) => <P extends IParser<W>>(p: P) =>
  ({ [(wii).toString()]: { wii, prsd: p.parse(wii), ...p } })

type ErrorKeyVal = 'key' | 'val'
type Fun = (...args: any) => any
type Unu = 'unionlol'
type OOfFunUnu<T extends Fun> = T extends T ? ReturnType<T> : never
type IsOfFunUnu<T extends Fun> = T extends T ? Parameters<T> : never
const checkKey = <T extends object, K extends string, V, Has extends ((t: T & { [k in K]: V }) => any), Not extends ((t: T, kverr?: ErrorKeyVal) => any)>(
  t: T, key: K, val: V, ifhas: Has, ifnot: Not): OOfFunUnu<Has | Not> =>
  key in t ? (t as T & { [k in K]: V })[key] == val ? ifhas(t as T & { [k in K]: V }) : ifnot(t, 'val') : ifnot(t, 'key')

// const andParser = <P extends Parser>(p: P) =>
//   <Q extends IParser<PrsGetI<P>>>(q: Q): OIParser<PrsGetO<Q>, PrsGetI<P>> => ({
//     // parse: (i) => p.parse(i).result == "ok" ? q.parse(p.parse(i))
// })

type List<P, C, A = any> = { iam: P, see: List<C, A> }

// const onetwoParser =
// <With>(w:W)=>
// <P extends Parser, Q extends IParser<PrsGetO<P>>>(p:P, q:Q)=>i=>q(p(i)) 

const dotenv = configDotenv()
const dotenvparser: IOParser<typeof dotenv, NonNullable<typeof dotenv.parsed>, NonNullable<typeof dotenv.error>> =
  { parse: (i) => euOkErr(nn(i.parsed), nn(i.error), i.parsed != null) }
console.log(dotenv)
