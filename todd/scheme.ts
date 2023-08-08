import { TypedOmit, arr, num, næ, obj, objectKeys, str, theunilog } from "./uti"
const log = theunilog

/*
json-schema-like SCHEME
*/
export type scheme =
	| { type: "literal"; yo: SNB }
	| { type: "undefined" }
	| { type: "boolean" }
	| { type: "string" }
	| { type: "number"; min?: num; max?: num }
	| { type: "object"; properties: obj<str, scheme> }
	| { type: "union"; cases: arr<scheme> }
	| { type: "array"; ofcases: arr<scheme> };
// type thatkindof<s extends scheme, k extends scheme['type']> = s extends { type: k } ? s : never
type thatkindof<s extends scheme, k extends scheme['type']> = s extends { type: k } & scheme ? s : never;
// type theSNBkindof<s extends scheme> = thatkindof<s, SNBstring>



/*
todd the scheme GENERATOR
*/
type GeneratorDictionary = {
	[k in scheme['type']]:
	k extends SNBstring | 'undefined' ? ((an?: TypedOmit<thatkindof<scheme, k>, 'type'>) => thatkindof<scheme, k>) :
	// k extends 'object' | 'array' | 'union' | 'literal' ?
	k extends 'object' | 'array' | 'union' | 'literal' ?
	<More extends TypedOmit<thatkindof<scheme, k>, "type">[keyof TypedOmit<thatkindof<scheme, k>, "type">]>(
		more: More) => thatkindof<scheme, k> & Record<keyof TypedOmit<thatkindof<scheme, k>, "type">, More> :
	// k extends 'object' ? <Ss extends scheme[], P extends obj<str, Ss[number]>, O extends UnpackSchema<{ type: 'object', properties: P }>>(p: P) => O :
	// ((an: TypedOmit<thatkindof<scheme, k>, 'type'>) => thatkindof<scheme, k>)
	never
}
export const todd = {
	literal: <C extends SNB>(yo: C) =>
		({ type: "literal", yo }),
	undefined: (args?) =>
		({ type: "undefined", ...args }),
	boolean: (args?) =>
		({ type: "boolean", ...args }),
	string: (args?) =>
		({ type: "string", ...args }),
	number: (args?) =>
		({ type: "number", ...args }),
	union: <cases extends arr<scheme>>(cases: cases) =>
		({ type: "union", cases }),
	array: <of extends arr<scheme>>(ofcases: of) =>
		({ type: "array", ofcases }),
	object: <p extends obj<str, scheme>>(properties: p) =>
		({ type: "object", properties }),
} satisfies GeneratorDictionary;

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

const g = todd
const exampleGenned = g.object({
	nam: g.number(), ssh: g.string(),
	uuh: g.array([g.boolean(), g.literal('shit')]),
	aha: g.array([g.number(), g.object({ lol: g.literal(42) })])
});


/*
UNPACK
*/
export type TypeStringMap = {
	string: string;
	number: number;
	boolean: boolean;
};
export type SNBstring = 'string' | 'number' | 'boolean'
export type SNB<which extends SNBstring = SNBstring> = TypeStringMap[which]
// type anySNB = SNB

type UnpackLiteral<S extends scheme> = S extends thatkindof<S, 'literal'>
	? S['yo'] : "nevercomment"

type JustUnpackLiteral<S extends thatkindof<scheme, 'literal'>> = S['yo']

type UnpackSNB<S extends scheme> = S extends thatkindof<S, SNBstring>
	? TypeStringMap[S["type"]]
	: "neverSNB";

// type JustUnpackSNB<S extends thatkindof<scheme, SNBstring>> = S['type'] extends SNBstring ? SNB<S['type']> : never

type UnpackObject<S extends scheme> = S extends thatkindof<S, 'object'>
	? { [k in keyof S['properties']]: UnpackSchema<S['properties'][k]> }
	: "neverobject";

type JustUnpackObject<S extends thatkindof<scheme, 'object'>> =
	{ [k in keyof S['properties']]: JustUnpackSchema<S['properties'][k]> }

type UnpackUnion<S extends scheme> = S extends thatkindof<S, 'union'>
	? (S['cases'][number] extends infer T extends scheme ? UnpackSchema<T> : never)
	: "neverunion";

// type JustDistributeSchemes<schemeunion extends scheme> = schemeunion extends thatkindof<scheme, infer kind> ? justunpackschemamap<kind, schemeunion> : never;
type JustUnpackUnion<S extends thatkindof<scheme, 'union'>> = S['cases'][number] extends infer s ? s extends scheme ? JustUnpackSchema<s> : never : never //extends S['cases'][number] ? JustUnpackSchema<S['cases'][number]> : never

type UnpackArray<S extends scheme> = S extends thatkindof<S, 'array'>
	? arr<(S['ofcases'][number] extends infer T extends scheme ? UnpackSchema<T> : never)>
	: "neverarray";

// type JustUnpackArray<S extends thatkindof<scheme, 'array'>> = arr<JustDistributeSchemes<S['ofcases'][number]>>
type JustUnpackArray<S extends thatkindof<scheme, 'array'>> = arr<JustUnpackSchema<S['ofcases'][number]>>;

// type OMGjust<S extends scheme> = S extends { type: keyof TheJustUnpackMap<S> } ? TheJustUnpackMap<S>[S['type']] : never;
// type JustUnpackSchema<S extends scheme> = OMGjust<S>;
export type JustUnpackSchema<S extends scheme> = UnpackSchema<S>

type TheJustUnpackMap<S extends scheme> = {
	array: JustUnpackArray<thatkindof<S, 'array'>>,
	object: JustUnpackObject<thatkindof<S, 'object'>>,
	union: JustUnpackUnion<thatkindof<S, 'union'>>,
	literal: JustUnpackLiteral<thatkindof<S, 'literal'>>,
	string: string,
	number: number,
	boolean: boolean
};

// type justunpackschemamap<T extends scheme['type'], S extends thatkindof<scheme, T>> =
// 	T extends SNBstring ? JustUnpackSNB<theSNBkindof<S>> :
// 	T extends 'literal' ? JustUnpackLiteral<S & thatkindof<scheme, 'literal'>> :
// 	T extends 'array' ? JustUnpackArray<thatkindof<S, 'array'>> :
// 	T extends 'union' ? JustUnpackUnion<thatkindof<S, 'union'>> :
// 	T extends 'object' ? JustUnpackObject<thatkindof<S, 'object'>> :
// 	// T extends 'number'? JustUnpackNumber<S & thatkindof<scheme, 'number'>>:
// 	// T extends 'boolean'? JustUnpackBoolean<S & thatkindof<scheme, 'boolean'>>:
// 	never;
// type JustUnpackSchema<S extends scheme> = justunpackschemamap<S['type'], thatkindof<S, S['type']>>;


type tryelse<a, b> =
	a extends `never${infer _suffix}` ? b : a
type tryelsepipe<ts extends næ[]> =
	ts extends [infer a, ...infer bcd]
	? tryelse<a, tryelsepipe<bcd>>
	: ts extends [infer a] ? a
	: never

// type UnpackSchema<S extends scheme>
// 	// = UnpackUnion<S>
// 	// | UnpackArray<S>
// 	= UnpackUnionArray<S>
// 	| UnpackObject<S>
// 	| UnpackSNB<S>
// 	| UnpackLiteral<S>
// type UnpackSchema<S extends scheme> = tryelsepipe<
// 	[UnpackLiteral<S>
// 		//, UnpackUnion<S>
// 		, UnpackObject<S>
// 		, UnpackArray<S>
// 		, UnpackSNB<S>
// 	]>
type UnpackSchema<S extends scheme> = tryelsepipe<
	[UnpackLiteral<S>
		, UnpackSNB<S>
		, UnpackUnion<S>
		, UnpackArray<S>
		, UnpackObject<S>
	]>


type ExampleUnpacked = UnpackSchema<typeof exampleGenned>
const exampleChecked: ExampleUnpacked = {
	nam: 42, ssh: 'lol',
	uuh: [true,],
	aha: [41,]
};
log('exampleChecked', exampleChecked);
const alsoexampleChecked = {
	nam: NaN, ssh: null as any,
	uuh: ['shit', false],
	aha: [{ lol: 43 as any }]
} satisfies ExampleUnpacked;
log('alsoexampleChecked', alsoexampleChecked);
// const yay = 








/*
RESULT
*/
type Result<oktype = næ, errmsg = string> =
	| ({ result: "ok"; ok: oktype })
	| ({ result: "err"; msg: errmsg })
const resultok = <ok>(ok: ok) =>
	({ result: "ok" as const, ok }) satisfies Result<ok, any>;
const resultmsgerror = <oktype, msg = string>(msg: msg): Result<oktype, msg> =>
	({ result: "err" as const, msg, }) satisfies Result<any, msg>;



/*
PARSER
*/
// type parser = <i, o>(i: i) => o
// type schemaparser<s> = (s: s) => parser

type Parser<In, Out> =
	(input: In) => Result<Out>
type SchemaParser<in S extends scheme = scheme, In = næ, O = UnpackSchema<S>> =
	<sss extends S>(scheme: sss) => Parser<In, O>
type ThatKindOfSchemaParser<kind extends scheme['type'], In = næ, O = UnpackSchema<thatkindof<scheme, kind>>> =
	<sss extends thatkindof<scheme, kind>>(scheme: sss) => Parser<In, O>



const conditionalResult =
	<ok>(cond: ((næ: næ) => boolean), msg?: string) =>
		(input: næ) => cond(input) ? resultok(input as ok)
			: resultmsgerror<ok>(msg ?? 'plsputerrmsg')
const parseSNB = <K extends SNBstring>(whatnow: K): (() => Parser<næ, TypeStringMap[K]>) => () =>
	conditionalResult<TypeStringMap[K]>((inp => typeof inp == whatnow),
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
function alwaysfailfunction(errmsg = 'alwaysfail'): Parser<næ, næ> { return () => resultmsgerror(errmsg) }

const switchcasealwaysfail = <S extends scheme, I>(): SchemaParser<S, I> => () => alwaysfail('switchcaseparseralwaysfail') as any
const schemespecific_switchcaseparsers = <S extends scheme>(schema: S) =>
	(...caseparsers: [S['type'], SchemaParser<S, næ, næ>][]) =>
		caseparsers.reduce((
			(acc, [_case, parser]) =>
				_case == schema.type ? (parser as SchemaParser<S, næ>) : acc),
			switchcasealwaysfail() as SchemaParser<S, næ>)

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
		(input) => (parsers.find(p => p(input).result == 'ok')
			?? (alwaysfail('') as any)).apply(input)

const allOfParser =
	<Input, P extends Parser<Input, næ>[], InputParsers extends [number, P[number]][]>(
		...indexparsers: InputParsers): Parser<Input[], (P[number] extends Parser<Input, infer Out> ? Out : never)> =>
		(input: Input[]) => (indexparsers.every(([i, p], _i) => p(input[i]).result == 'ok')
			? resultok<ReturnType<typeof indexparsers[number][1]>> : alwaysfail('') as any).apply(input)
// needs all Parsers to have same Input
// but its fine cause Input = string | næ
// const allOfParser =
// 	<Input, Parsers extends Parser<Input, næ>[]>(
// 		...parsers: Parsers) =>//: Parser<Input, ReturnType<Parsers[number]>[]> =>
// 		(...inputs: Input[]) => {
// 			if (parsers.length != inputs.length) throw new Error('allOfParser expects parsers.length == inputs.length')
// 			const help = parser_help<Input, Parsers>(parsers)(inputs)
// 			if (help.foundFirstErr) {
// 				const yoiamstring = 'allOfParser on ' + JSON.stringify(inputs)
// 				const yoIam = resultmsgerror(yoiamstring)
// 				const parentError: Tree<Result> = {
// 					yoIam,
// 					note: 'failed because of all of these kids',
// 					children: help.listAllErr
// 				}
// 				return resulttreeerror(parentError)
// 			}
// 		}



/*
yo this is text	
*/
// const todo: TODO = 'todo'
const parseObject: SchemaParser<thatkindof<scheme, 'object'>, næ> = (s) => (input) => {
	if (input == null) return resultmsgerror('parseObject: input is null');
	if (typeof input != 'object') return resultmsgerror('parseObject: not object');
	// const keys = objectKeys(s.properties)
	const parsedEntries = []
	for (const key in s.properties) {
		if (!(Object.keys(input).includes(key))) return resultmsgerror(
			'parseObject: key not found ' + key +
			' ssh: ' + JSON.stringify(input)
		)
		const ischeme = s.properties[key]
		const iparser = (switchschematype as any)(ischeme)
		const ival = (input as any)[key]
		const tryParseKeyVal = iparser(ival)
		if (tryParseKeyVal.result == 'err') return tryParseKeyVal
		const parsedResult = [key, tryParseKeyVal.ok] as const
		parsedEntries.push(parsedResult)
	}
	const parsedResult = Object.fromEntries(parsedEntries)
	return resultok(parsedResult as any)
};

const parseLiteral = <S extends thatkindof<scheme, 'literal'>>(s: S): Parser<næ, JustUnpackLiteral<S>> => conditionalResult(input => input == s.yo) as any

// const parseArray = null as næ as SchemaParser<thatkindof<scheme, 'array'>>;
// const parseUnion = null as næ as SchemaParser<thatkindof<scheme, 'union'>>;
const parseArray = <S extends thatkindof<scheme, 'array'>>(s: S): Parser<næ, JustUnpackArray<S>> => (input) => {
	if (!Array.isArray(input)) return resultmsgerror('input not array')
	if (allOfParser(...input.map(() => anyOfParser(...(s as any).ofcases)))(input)) return resultok<JustUnpackArray<S>>(input)
	return resultmsgerror('array') as any
} //satisfies ThatKindOfSchemaParser<'array', næ, JustUnpackArray<thatkindof<scheme, 'array'>>>;
const parseUnion = <S extends thatkindof<scheme, 'union'>>(s: S): Parser<næ, JustUnpackUnion<S>> => //(input) => {
	anyOfParser(...(s as any).cases.map(switchschematype))
//satisfies SchemaParser<thatkindof<scheme, 'union'>, næ, JustUnpackSchema<thatkindof<scheme, 'union'>>>
// return resultmsgerror('union')
// }

const parseUndefined = () => conditionalResult(i => i == null)

export const neverever = (no: never): any => no

const switchschematype = <k extends scheme['type'], S extends thatkindof<scheme, k>>(s: scheme): Parser<næ, JustUnpackSchema<S>> => {
	switch (s.type) {
		case "string": return parseString() as any
		case "number": return parseNumber() as any
		case "boolean": return parseBoolean() as any
		case "object": return parseObject(s) as any
		case "literal": return parseLiteral(s) as any
		case 'undefined': return parseUndefined() as any
		case "union": return (parseUnion as any)(s) as any
		case "array": return (parseArray as any)(s) as any
		// default: return alwaysfail(`${s.type} not implemented`) as any
		default: return neverever(s)
	}
}// satisfies Parser<næ, JustUnpackSchema<S>>;
// schemespecific_switchcaseparsers(s)
// 	(
// 		["boolean", parseBoolean]
// 		, ["string", parseString]
// 		, ["number", parseNumber]
// 		, ["object", parseObject]
// 		, ["array", parseArray]
// 		, ["union", parseUnion]
// 	)(s)

/*
	
*/

const schemeparser = <S extends scheme>(schema: S,) => ({
	parse: (switchschematype as any)(schema) as Parser<næ, JustUnpackSchema<S>>,
});

const yatzy = schemeparser(exampleGenned).parse({});
console.log('yatzy', yatzy);

// const metethpropbut = todd.array
const meeatpurpleberries = schemeparser(exampleGenned).parse({});
console.log('meeatpurpleberries', meeatpurpleberries);

export { yatzy, meeatpurpleberries }
