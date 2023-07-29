import {
  JSX,
  Setter,
} from "solid-js";
import { UnionPick } from "../../../../todd/uti"
import { TypeStringMap } from "../../../../todd/scheme"
import { GetSet } from "../../../../soft/ge";

export function InputLine<
  T extends UnionPick<keyof TypeStringMap, 'string' | 'number'>>(props: {
    type: T; signal: GetSet<TypeStringMap[typeof props.type & string]>;
  }) {
  // const onChangeSetter: JSX.EventHandler<HTMLInputElement, InputEvent> = (ev) =>
  // const onChangeSetter: JSX.InputEventHandlerUnion<HTMLInputElement, InputEvent> = (ev) =>
  const onChangeSetter: JSX.ChangeEventHandlerUnion<HTMLInputElement, Event> = (ev) =>
    props.type == 'number'
      ? (props.signal.set as Setter<number>)(parseFloat(ev.target.value))
      : (props.signal.set as Setter<string>)(ev.target.value)

  return (
    <div>
      <div>
        <input
          type={props.type}
          value={props.signal.get()}
          onChange={onChangeSetter}
        />
      </div>
    </div>
  );
}

// export function InputArea(props: {
//   signal: GetSet<TypeStringMap["text"]>;
// }) {
//   return (
//     <div>
//       <div>
//         <textarea
//           value={props.signal.get()}
//           onChange={(ev) => props.signal.set(ev.target.value)}
//         />
//       </div>
//     </div>
//   );
// }

