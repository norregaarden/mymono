import { Nat, Suc, Zero } from "./numbut"
/*
DEBUG
*/
type Wee<omg> = omg extends infer wtf ? { [k in keyof wtf]: wtf[k] } : never;
type WoW<omg> = omg extends infer wtf ? { [k in keyof wtf]: WoW<wtf[k]> } : omg;

export type WOW<T> =
	// T extends (...args: infer args) => infer ret ?
	// (...args: WOW<args>) => WOW<ret> :
	T extends (infer A)[] ? WOW<A>[] :
	keyof T extends never ? T :
	{ [k in keyof T]: WOW<T[k]> }

export type LazyWOW<T, n extends Nat = Suc<Zero>> = T extends null
	? { err: 'lazywownull', type: T } : n extends Zero ? T
	: n extends Suc<infer p> ? p extends Nat
	? T extends (...args: infer args) => infer ret
	? (...args: LazyWOW<args, p>) => LazyWOW<ret, p>
	: T extends (infer A)[] ? LazyWOW<A, p>[]
	: keyof T extends never ? T
	: { [k in keyof T]: LazyWOW<T[k], p> }
	: never : never

