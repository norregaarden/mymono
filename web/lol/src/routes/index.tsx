import { Title } from "solid-start";
import {  InputFodrExample,  } from "~/components/Input";

// const log = theunilog
import * as toddscheme from '../../../../todd/scheme';
console.log(toddscheme)


export default function Index() {
  return (
    <div>
      <Title>mymono/web/lol</Title>
      <InputFodrExample />
    </div>
  );
}

// const toTest = {
//   number: InputNumber,
//   text: InputString
// } as const
// const testInputs = {
//   number: createGetSet(0),
//   text: createGetSet('-')
// } satisfies Record<keyof typeof toTest, GetSetAny>;
// const Testing = () => {
//   return <div>
//     <For each={objectEnts(toTest)}>
//       {([key, Val], _ig) =>
//         <div>{key}<br /><Val getset={testInputs[key] as any} /></div>}
//     </For>
//   </div>
// }
