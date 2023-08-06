import { Title } from "solid-start";
import { InputNumber, InputString } from "~/components/Input";
import { GetSetAny, createGetSet } from "../../../../soft/ge";

import { For } from "solid-js";
import { objectEnts } from "../../../../todd/uti";
// const log = theunilog

const toTest = {
  number: InputNumber,
  text: InputString
} as const
const testInputs = {
  number: createGetSet(0),
  text: createGetSet('-')
} satisfies Record<keyof typeof toTest, GetSetAny>;

export default function Index() {
  return (
    <div>
      <Title>mymono/web/lol</Title>
      <div>
        <For each={objectEnts(toTest)}>
          {([key, Val], _ig) =>
            <div>{key}<br /><Val getset={testInputs[key] as any} /></div>}
        </For>
      </div>
    </div>
  );
}
