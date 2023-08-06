import {
  JSX,
  Setter,
} from "solid-js";
import { UnionPick } from "../../../../todd/uti"
import { TypeStringMap } from "../../../../todd/scheme"
import { GetSet, GetSetUnidist } from "../../../../soft/ge";

export function InputLine<
  T extends UnionPick<keyof TypeStringMap, 'string' | 'number'>>(props: {
    type: T; signal: GetSetUnidist<TypeStringMap[typeof props.type & string]>;
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

type InputProps<T> = {
  getset: GetSet<T>,
  containerprops?: JSX.HTMLAttributes<HTMLDivElement>,
  inputprops?: JSX.HTMLAttributes<HTMLInputElement>
}

export function InputNumber(props: InputProps<number>) {
  const eventSetter: JSX.ChangeEventHandler<HTMLInputElement, Event> = (ev) => {
    const maybeNumber = parseFloat(ev.target.value)
    if (!isNaN(maybeNumber) && isFinite(maybeNumber)) {
      props.getset.set(maybeNumber)
    }
  }
  return <div>
    <input type="number" value={props.getset.get()} onChange={eventSetter} />
  </div>
}

export function InputString(props: InputProps<string>) {
  const eventSetter: JSX.ChangeEventHandler<HTMLInputElement, Event> = (ev) => {
    // const maybeNumber = parseFloat(ev.target.value)
    // if (!isNaN(maybeNumber) && isFinite(maybeNumber)) {
    props.getset.set(ev.target.value)
    // }
  }
  return <div>
    <input type="" value={props.getset.get()} onChange={eventSetter} />
  </div>
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

