import { næ } from "./uti"

/*
 Nat= Zero | (Suc n:Nat)
*/
export type Zero = { nat: 'zero' }
export type Nat = Zero | { nat: 'suc', prev: Nat }
export type Suc<prev> = { nat: 'suc', prev: prev }

/*
 Add: (Nat x Nat) => Nat
*/
export type Add<n, m> = m extends Zero ? n
	: m extends Suc<infer p> ? p extends Nat
	? Suc<Add<n, p>>
	: never : never
// Also Known As "Add"?
type ReplaceZero<newzero, natnat> =
	natnat extends Zero ? newzero
	: natnat extends Suc<infer p> ? Suc<ReplaceZero<newzero, p>> : never
// Also Known As "Subtract"?
type Withdraw<from, many>
	= from extends Zero ? Zero
	: from extends Suc<infer p>
	? many extends Zero ? from
	: many extends Suc<infer m>
	? Withdraw<p, m>
	: never : never

/*
 Mul: (Nat x Nat) => Nat
*/
export type Mul<n, m> = m extends Zero ? Zero
	: m extends Suc<infer p> ? p extends Nat
	? Add<n, Mul<n, p>>
	: never : never

/*
1,2,3,4,5,6
*/
export type One = Suc<Zero>
export type Two = Suc<One>
export type three = Suc<Two>
export type four = Mul<Two, Two> & Add<Two, Two>
export type five = Add<three, Two> & Add<Two, three>
export type six = NatTo<(Mul<Two, three> & Mul<three, Two>)>

export type LessThanEq<n, m>
	= [n, m] extends [Suc<infer pn>, Suc<infer pm>]
	? LessThanEq<pn, pm>
	: [n, m] extends [Zero, næ]
	? true
	: false



type NatTo<n>
	= n extends Zero ? ''
	: n extends Suc<infer p>
	? LessThanEq<ten, n> extends true
	? `X${NatTo<Withdraw<n, ten>>}`
	: LessThanEq<five, n> extends true
	? `V${NatTo<Withdraw<n, five>>}`
	: `I${NatTo<p>}` : never
type ten = Mul<five, Two> & Mul<Two, five>
export type NatFrom<s extends string> = s extends '' ? Zero
	: s extends `X${infer p}` ? ReplaceZero<ten, NatFrom<p>>
	: s extends `V${infer p}` ? ReplaceZero<five, NatFrom<p>>
	: s extends `I${infer p}` ? Suc<NatFrom<p>>
	: 'nevernumber'

type Test___NatFromTo = { [k in ['', 'I', 'II', 'III', 'IIII', 'V', 'VI', 'VII', 'VIII', 'VIIII', 'VV', 'X'][number]]: NatTo<NatFrom<k>> }
type fiiveeve = Test___NatFromTo['V']

