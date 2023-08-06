export type TODO = any
export const theunilog = console.log

/*
handy shorts
*/
export type todo = any
export type nvr = never
export type næ = unknown
export type boo = boolean
export type num = number
export type nah = null | undefined
export type str = string
export type _str = bigint | num | str | boo | nah
export type _key = symbol | num | str
export type obj<key extends _key, val> = Record<key, val>
export type arr<t = næ> = t[]


/*
UTILS object
*/
export const objectKeys = <T extends object>(t: T) => Object.keys(t) as (keyof T)[];

export type ObjectVal<T, k = keyof T> = k extends keyof T ? T[k] : never
export const objectVals = <T extends object>(t: T) => Object.values(t) as ObjectVal<T>[];
// export type ObjectValues<T, k = keyof T> = ObjectValue<T, k>[]
// export type abcObjectValues<T, k extends keyof T> = ObjectValues<T, k>
export type abcObjectVal<T, k extends keyof T> = ObjectVal<T, k>

export type ObjectEnt<T, k = keyof T, v = ObjectVal<T>> = k extends keyof T ? T[k] extends v ? [k, T[k]] : never : never
export const objectEnts = <T extends object>(t: T) => Object.entries(t) as ObjectEnt<T>[];
// export type ObjectEntries<T, k = keyof T, v = ObjectValue<T>> = ObjectEntry<T, k, v>[]
// export type abcObjectEntries<T, k extends keyof T, v extends ObjectValue<T>> = ObjectEntry<T, k, v>[]
export type abcObjectEnt<T, k extends keyof T = keyof T, v extends ObjectVal<T> = ObjectVal<T, k>> = ObjectEnt<T, k, v>

export type ReverseMap<T, V extends ObjectVal<T>> = keyof T extends infer k ? k extends keyof T ?
	T[k] extends infer v ? V extends v ? k
	: never : never : never : never;

/*
UTILS union
*/
export type TypedOmit<T, K extends keyof T> = Omit<T, K>;
export type UnionOmit<U, O> = U extends U ? U extends O ? never : U : never;
export type StrictUnionOmit<U, O extends U> = U extends U ? U extends O ? never : U : never;
export type UnionPick<U, P extends U> = U extends U ? U extends P ? U : never : never;

