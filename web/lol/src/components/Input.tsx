import {
  JSX,
} from "solid-js";
import { GetSet, } from "../../../../soft/ge";

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
    props.getset.set(ev.target.value)
  }
  return <div>
    <input type="" value={props.getset.get()} onChange={eventSetter} />
  </div>
}

