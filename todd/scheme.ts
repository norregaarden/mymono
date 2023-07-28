export const conlog = console.log
const log = conlog

/*
HANDY
*/
export type næ = unknown
export type keyable = string | number | symbol
export type dict<key extends keyable, val> = Record<key, val>
export type arr<t> = t[]
type TODO = any | 'todo'

/*
UTIL
*/
type Wee<omg> = omg extends infer wtf ? { [k in keyof wtf]: wtf[k] } : never;
type WoW<omg> = omg extends infer wtf ? { [k in keyof wtf]: WoW<wtf[k]> } : omg;

const keysof = <T extends object>(t: T) => Object.keys(t) as (keyof T)[];

type TypedOmit<T, K extends keyof T> = Omit<T, K>;
type UnionOmit<U, O extends U> = U extends U ? U extends O ? never : U : never;
type UnionPick<U, P extends U> = U extends U ? U extends P ? U : never : never;

type TypeStringMap = {
	string: string;
	number: number;
	boolean: boolean;
};
type ValuesOf<T> = keyof T extends infer k ? k extends keyof T ?
	T[k]
	: never : never
type ReverseMap<T, V extends ValuesOf<T>> = keyof T extends infer k ? k extends keyof T ?
	T[k] extends infer v ? V extends v ? k
	: never : never : never : never;






/*
SCHEME
*/
export type scheme =
	| { type: "comment"; yo: string }
	| { type: "boolean" }
	| { type: "string" }
	| { type: "number"; min?: number; max?: number }
	| { type: "object"; properties: dict<string, scheme> }
	| { type: "array"; of: scheme }
	| { type: "union"; cases: scheme[] };
type thatkindof<s extends scheme, k extends scheme['type']> = k extends k ? s & { type: k } : never


/*
GENERATOR
*/
export const todd = {
	comment: <C extends string>(yo: C) =>
		({ type: "comment", yo }),
	boolean: () => ({ type: "boolean" }),
	string: () => ({ type: "string" }),
	number: () => ({ type: "number" }),
	object: <p extends (thatkindof<scheme, 'object'>)["properties"]>(properties: p) =>
		({ type: "object", properties }),
	array: <of>(of: of) => ({ type: "array", of }),
	union: <cases extends scheme[]>(...cases: cases) =>
		({ type: "union", cases, }),
} satisfies {
		[k in scheme['type']]:
		(an: any) => thatkindof<scheme, k>
	}

export type objectscheme = thatkindof<scheme, 'object'>;
export const chavez = {
	mergetwo: <a extends objectscheme, b extends objectscheme>(a: a, b: b) => ({
		type: "object",
		properties: { ...a.properties, ...b.properties },
	} as a & b),
	lolmerge: <ojbs extends objectscheme[]>(...ojbs: ojbs): ojbs[number] =>
		ojbs.reduce<ojbs[number]>((acc, o, _i) => ({
			...acc,
			properties: { ...acc.properties, ...o.properties },
		}), { type: "object", properties: {} }),
}

const exampleGenned = todd.object({
	nam: todd.number(), ssh: todd.string(),
	uuh: todd.union(todd.array(todd.boolean()), todd.comment('shit'))
})




/*
UNPACK
*/
type UnpackComment<S extends scheme> = S extends thatkindof<S, 'comment'>
	? `//comment/${S['yo']}/` : "nevercomment"
type SNBstring = 'string' | 'number' | 'boolean'
type SNB = TypeStringMap[SNBstring]
type UnpackSNB<S extends scheme> = S extends thatkindof<S, SNBstring>
	? TypeStringMap[S["type"]]
	: "neverSNB";
type UnpackObject<S extends scheme> = S extends thatkindof<S, 'object'>
	? { [k in keyof S['properties']]: UnpackSchema<S['properties'][k]> }
	: "neverobject";
type UnpackArray<S extends scheme> = S extends thatkindof<S, 'array'>
	? UnpackSchema<S['of']>[]
	: "neverarray";
type UnpackUnion<S extends scheme> = S extends thatkindof<S, 'union'>
	? S["cases"][number] extends infer C
	? C extends scheme
	? UnpackSchema<C>
	: "neverunion1" : "neverunion2" : 'neverunion3'

type tryelse<a, b> =
	a extends `never${infer _suffix}` ? b : a
type tryelsepipe<ts extends næ[]> =
	ts extends [infer a, ...infer bcd]
	? tryelse<a, tryelsepipe<bcd>>
	: ts extends [infer a] ? a
	: never

// type UnpackSchema<S extends scheme>
// 	= UnpackUnion<S>
// 	| UnpackObject<S>
// 	| UnpackArray<S>
// 	| UnpackSNB<S>
type UnpackSchema<S extends scheme> = tryelsepipe<
	[UnpackComment<S>,
		UnpackUnion<S>
		, UnpackObject<S>
		, UnpackArray<S>
		, UnpackSNB<S>
	]>

type ExampleUnpacked = UnpackSchema<typeof exampleGenned>
const exampleChecked: ExampleUnpacked =
	{ nam: 42, ssh: 'lol', uuh: [true] }
log(exampleChecked)
const alsoexampleChecked: ExampleUnpacked =
	{ nam: NaN, ssh: null as any, uuh: '//comment/shit/' }
log(alsoexampleChecked)





/*
RESULT
*/
type Tree<type> = {
	yoIam: type,
	note?: string,
	children: (Tree<type> | type)[]
}
type OKresult<type> = { ok: type }
type Result<oktype = næ, treeerr = string> =
	| ({ result: "ok"; } & OKresult<oktype>)
	| ({ result: "err"; } & ({ msg: string } | Tree<treeerr>))
const resultok = <ok>(ok: ok) => ({ result: "ok" as const, ok });
const resultmsgerror = <msg = string>(msg: msg) =>
	({ result: "err" as const, msg, });
const resulttreeerror = <err>(treeerr: Tree<err>) =>
	({ ...treeerr, result: 'err' as const })



/*
PARSER
*/
type parser = <i, o>(i: i) => o
type schemaparser<s> = (s: s) => parser

type Parser<In, Out> =
	(input: In) => Result<Out>
type SchemaParser<S extends scheme = scheme, In = næ, O = næ> =
	(scheme: S) => Parser<In, O>



const conditionalResult =
	<ok>(cond: ((næ: næ) => boolean), msg?: string) =>
		(input: næ) => cond(input) ? resultok(input as ok)
			: resultmsgerror(msg ?? 'plsputerrmsg')
const parseSNB = <K extends SNBstring>(whatnow: K): () => Parser<næ, TypeStringMap[K]> => () =>
	conditionalResult((inp => typeof inp == whatnow),
		`{parseSNBerror:${whatnow}}`)

const parseString = parseSNB("string") satisfies SchemaParser<scheme, næ, string>; //<S>(s: S) => (no: næ) => Result<string>;
const parseNumber = parseSNB("number") satisfies SchemaParser<scheme, næ, number>;
const parseBoolean = parseSNB("boolean") satisfies SchemaParser<scheme, næ, boolean>;

// const tryElseParser = <I, A, B>(a: Parser<I, A>, b: Parser<I, B>): Parser<I, A | B> => {
// 	// return (a && b) as TODO
// 	return (i: I) => {
// 		const tried = a(i)
// 		return tried.result == "err" ? b(i) : tried
// 	}
// }

// const conditionalParser = <I, A, B>(a: Parser<I, A>, b: Parser<I, B>) => (cond: boolean): Parser<I, A> | Parser<I, B> => cond ? a : b

const alwaysfail = (errmsg = 'alwaysfail'): Parser<næ, næ> => () => resultmsgerror(errmsg)

const switchcasealwaysfail = <S extends scheme, I, O>(): SchemaParser<S, I, O> => () => alwaysfail('switchcaseparseralwaysfail') as any
const schemespecific_switchcaseparsers = (schema: scheme) =>
	(...caseparsers: [scheme['type'], SchemaParser][]) =>
		caseparsers.reduce((
			(acc, [_case, parser]) =>
				_case == schema.type ? parser : acc),
			switchcasealwaysfail() as SchemaParser<scheme, næ>)

// const andThen = (a)=>(b)=>
type ArrayType<argh> = argh extends (infer type)[] ? type : never
// type ParseHelper = <Input, Parsers extends Parser<Input, næ>[]>(...ps: Parsers) => (i: Input) => næ;
const parser_help = <Input, Parsers extends Parser<Input, næ>[]>(parsers: Parsers) => function(inputs: Input[]) {
	const doneAllParsers = (parsers.map((p, i) => p(inputs[i])))
	const listAllOK = (doneAllParsers.filter(r => r.result = 'ok'))
	const listAllErr = (doneAllParsers.filter(r => r.result = 'err'))
	type done = ArrayType<typeof doneAllParsers>
	const findFirst = (what: (r: done) => boolean) => {
		const found = doneAllParsers.find(what)
		const foundIndex = doneAllParsers.findIndex(what)
		if (found == null && foundIndex != -1) throw 'impossible to find this error'
		if (found != null && foundIndex == -1) throw 'impossible to find this errr2'
		return [found, foundIndex] as [undefined, -1] | [done, number]
	}
	const foundFirstOK = //([doneAllParsers.find(r => r.result = 'ok'), doneAllParsers.findIndex(r => r.result = 'ok')] as const)
		findFirst(r => r.result == 'ok')
	const foundFirstErr = //(doneAllParsers.find)
		findFirst(r => r.result == 'err')
	return { doneAllParsers, foundFirstOK, foundFirstErr, listAllOK, listAllErr }
}

// try all in that order
const anyOfParser =
	<Input, Parsers extends Parser<Input, næ>[]>(
		...parsers: Parsers): Parsers[number] =>
		(input) => (
			parsers.find(p => p(input).result == 'ok')
			?? alwaysfail('')).apply(input)

// needs all Parsers to have same Input
// but its fine cause Input = string | næ
const allOfParser =
	<Input, Parsers extends Parser<Input, næ>[]>(
		...parsers: Parsers) =>//: Parser<Input, ReturnType<Parsers[number]>[]> =>
		(...inputs: Input[]) => {
			if (parsers.length != inputs.length) throw new Error('allOfParser expects parsers.length == inputs.length')
			const help = parser_help<Input, Parsers>(parsers)(inputs)
			if (help.foundFirstErr) {
				const yoiamstring = 'allOfParser on ' + JSON.stringify(inputs)
				const yoIam = resultmsgerror(yoiamstring)
				const parentError: Tree<Result> = {
					yoIam,
					note: 'failed because of all of these kids',
					children: help.listAllErr
				}
				return resulttreeerror(parentError)
			}
		}



/*
yo this is text	
*/
const todo: TODO = 'todo'
const parseObject: SchemaParser<thatkindof<scheme, 'object'>, næ> = (s) => (i) => {
	return resultok(todo)
};

const parseArray = null as any;
const parseUnion = null as any;


const switchschematype = (s: scheme) => schemespecific_switchcaseparsers(s)
	(
		["boolean", parseBoolean]
		, ["string", parseString]
		, ["number", parseNumber]
		// , ["object", parseObject]
		, ["array", parseArray]
		, ["union", parseUnion]
	)(s)

/*
	
*/

const parser = <S extends scheme>(schema: S,) => ({
	parse: switchschematype(schema),
});

const yatzy = parser(exampleGenned).parse({});
console.log(yatzy);