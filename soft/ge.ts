import { Signal, createSignal } from "solid-js";
import { næ } from "todd/uti";

export const getSetFrom = <T>([get, set]: Signal<T>) => ({ get, set });
export type GetSet<T> = ReturnType<typeof getSetFrom<T>>;
export type GetSetAny = {
  get: () => næ,
  set: (an: any) => any
}
export type GetSetUnidist<T> = T extends T ? ReturnType<typeof getSetFrom<T>> : never;
export const createGetSet = <T>(defaultValue: T) => getSetFrom(createSignal(defaultValue));

