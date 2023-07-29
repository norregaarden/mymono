import { Signal, createSignal } from "solid-js";

export const getSetFrom = <T>([get, set]: Signal<T>) => ({ get, set });
export type GetSet<T> = T extends T ? ReturnType<typeof getSetFrom<T>> : never;
export const createGetSet = <T>(defaultValue: T) => getSetFrom(createSignal(defaultValue));

