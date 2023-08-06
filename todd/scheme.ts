import { TODO, næ, obj, theunilog } from "./uti"
const log = theunilog

/*
SCHEME
*/
export type scheme =
	| { type: "comment"; yo: string }
	| { type: "boolean" }
	| { type: "string" }
	| { type: "number"; min?: number; max?: number }
	| { type: "object"; properties: obj<string, scheme> }
	| { type: "array"; of: scheme }
// | { type: "union"; cases: scheme[] };
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
	// union: <cases extends scheme[]>(...cases: cases) =>
	// 	({ type: "union", cases, }),
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
	// uuh: todd.union(todd.array(todd.boolean()), todd.comment('shit'))
})




/*
UNPACK
*/
export type TypeStringMap = {
	string: string;
	number: number;
	boolean: boolean;
};
export type SNBstring = 'string' | 'number' | 'boolean'
export type SNB = TypeStringMap[SNBstring]

type UnpackComment<S extends scheme> = S extends thatkindof<S, 'comment'>
	? `//comment/${S['yo']}/` : "nevercomment"
type UnpackSNB<S extends scheme> = S extends thatkindof<S, SNBstring>
	? TypeStringMap[S["type"]]
	: "neverSNB";
type UnpackObject<S extends scheme> = S extends thatkindof<S, 'object'>
	? { [k in keyof S['properties']]: UnpackSchema<S['properties'][k]> }
	: "neverobject";
type UnpackArray<S extends scheme> = S extends thatkindof<S, 'array'>
	? UnpackSchema<S['of']>[]
	: "neverarray";
// type UnpackUnion<S extends scheme> = S extends thatkindof<S, 'union'>
// 	? S["cases"][number] extends infer C
// 	? C extends scheme
// 	? UnpackSchema<C>
// 	: "neverunion1" : "neverunion2" : 'neverunion3'

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
	[UnpackComment<S>
		//, UnpackUnion<S>
		, UnpackObject<S>
		, UnpackArray<S>
		, UnpackSNB<S>
	]>

type ExampleUnpacked = UnpackSchema<typeof exampleGenned>
const exampleChecked: ExampleUnpacked =
{
	nam: 42, ssh: 'lol',
	// uuh: [true] 
}
log(exampleChecked)
const alsoexampleChecked: ExampleUnpacked =
{
	nam: NaN, ssh: null as any,
	// uuh: '//comment/shit/' 
}
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
type SchemaParser<in S extends scheme = scheme, In = næ, O = UnpackSchema<S>> =
	<sss extends S>(scheme: sss) => Parser<In, O>



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
		if (!(key in input)) return resultmsgerror('parseObject: key not found ' + key)
		const ischeme = s.properties[key]
		const iparser = switchschematype(ischeme)
		const ival = (input as any)[key]
		const tryParseKeyVal = iparser(ival)
		if (tryParseKeyVal.result == 'err') return tryParseKeyVal
		const parsedResult = [key, tryParseKeyVal.ok] as const
		parsedEntries.push(parsedResult)
	}
	const parsedResult = Object.fromEntries(parsedEntries)
	return resultok(parsedResult as any)
};

const parseArray = null as næ as SchemaParser<thatkindof<scheme, 'array'>>;
// const parseUnion = null as næ as SchemaParser<thatkindof<scheme, 'union'>>;


const switchschematype = <S extends scheme>(s: S) => {
	switch (s.type) {
		case "string": return parseString()
		case "number": return parseNumber()
		case "boolean": return parseBoolean()
		case "object": return parseObject(s)
		// case "comment":return parseComment
		case "array": return parseArray(s)
		// case "union": return parseUnion(s)
		default: return alwaysfail(`${s.type} not implemented`)
	}
}
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

const parser = <S extends scheme>(schema: S,) => ({
	parse: switchschematype(schema),
});

const yatzy = parser(exampleGenned).parse({});
console.log(yatzy);
