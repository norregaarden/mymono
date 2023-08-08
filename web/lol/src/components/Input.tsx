import {
  For,
  Index,
  JSX,
} from "solid-js";
import { GetSet, createGetSet, } from "../../../../soft/ge";
import { FordrendeExampleUnpacked, eksempelFodr } from "~/types/fodr";
import { arr, næ } from "../../../../todd/uti";
import { neverever } from "../../../../todd/scheme";
import { Row } from "./Flex";

export const InputFodrExample = () => <InputFodr fscheme={eksempelFodr} />

type TimeCodedArray<T> = arr<{
  utcTime: number,
  audioTime: number,
  data: T
}>
const makeGetSettersFromFodrScheme = <S extends FordrendeExampleUnpacked>(fs: S) =>
  fs.map(f => {
    switch (f.type) {
      case "header":
      case "paragraph":
      case "linebreak":
      case "pagebreak":
        return 'nah'
      case "inputText":
        return createGetSet<null | string>(null)
      case "inputNumber":
        return createGetSet<null | number>(null)
      case "1toN":
        return createGetSet<null | typeof f['values'][number]>(f['values'][0])
      case "audioCoding":
        const lol = f['coding']
        if (lol.type == '1toN') return createGetSet<TimeCodedArray<typeof lol['values'][number]>>([])
        if (lol.type == 'inputText') return createGetSet<TimeCodedArray<string>>([])
        // if (lol.type == '1toN') return createGetSet<arr<typeof lol['values'][number]>>([])
        else throw new Error('yo please implement this?')
      case "conditional":
        return createGetSet<null | boolean>(null)
      default: neverever(f)
    }
  })


export function InputFodr<S extends FordrendeExampleUnpacked>(props: { fscheme: S }) {
  // const [first, ...rest] = props.fscheme
  // if (first)
  const theffscheme = createGetSet(props.fscheme)
  const getsetters = makeGetSettersFromFodrScheme(props.fscheme)
  // <For each={props.fscheme}>
  return <div>
    <textarea id='thetextarea'>{JSON.stringify(theffscheme.get())}</textarea><button onClick={(_ev) => {
      console.log(document.getElementById('thetextarea')!.innerHTML)
      theffscheme.set(JSON.parse(document.getElementById('thetextarea')!.innerHTML))
    }}>click</button>
    <InputFodrInner fscheme={theffscheme.get()} />
  </div>
}
export function InputFodrInner<S extends FordrendeExampleUnpacked>(props: { fscheme: S }) {
  // const [first, ...rest] = props.fscheme
  // if (first)
  // const theffscheme = createGetSet(props.fscheme)
  const getsetters = makeGetSettersFromFodrScheme(props.fscheme)
  // return <For each={(theffscheme.get())}>
  return <For each={props.fscheme}>
    {(fs, i) => {
      switch (fs.type) {
        case "header": return <ShowHeader {...fs} />
        case "paragraph": return <ShowParagraph {...fs} />
        case "linebreak":
        case "pagebreak":
          return <ShowLineBreak {...fs} />
        case "inputText": return <InputString {...fs} getset={getsetters[i()] as GetSet<string | null>} />
        case "inputNumber": return <InputNumber {...fs} getset={getsetters[i()] as GetSet<number | null>} />
        case "1toN":
          return <Input1toN {...fs} getset={getsetters[i()] as GetSet<null | (FodrKind<'1toN'>)['values'][number]>} />
        case "audioCoding":
          return <InputAudioCoding {...fs} getset={getsetters[i()] as GetSet<null | TimeCodedArray<næ>>} />
        case "conditional":
      }
    }}
  </For>
}

type FodrKind<T extends FordrendeExampleUnpacked[number]['type']> = FordrendeExampleUnpacked[number] & { type: T }
const ShowHeader = (props: FodrKind<'header'>) => <h3>{props.value}</h3>
const ShowParagraph = (props: FodrKind<'paragraph'>) => <p>{props.value}</p>
const ShowLineBreak = (props: FodrKind<'linebreak' | 'pagebreak'>) => <hr />
// const ShowPagebreak= (props: FodrKind<'pagebreak'>) => <br />

type InputProps<T> = {
  getset: GetSet<T>,
  containerprops?: JSX.HTMLAttributes<HTMLDivElement>,
  inputprops?: JSX.HTMLAttributes<HTMLInputElement>
}
type FodrInputProps<F extends FordrendeExampleUnpacked[number]['type'], T> = (FordrendeExampleUnpacked[number] & { type: F }) & {
  getset: GetSet<T | null>,
  containerprops?: JSX.HTMLAttributes<HTMLDivElement>,
  inputprops?: JSX.HTMLAttributes<HTMLInputElement>
}
export function InputNumber(props: FodrInputProps<'inputNumber', number>) {
  const eventSetter: JSX.ChangeEventHandler<HTMLInputElement, Event> = (ev) => {
    const maybeNumber = parseFloat(ev.target.value)
    if (!isNaN(maybeNumber) && isFinite(maybeNumber)) {
      props.getset.set(maybeNumber)
    }
  }
  // inputNumber
  return <div {...props.containerprops}>
    {props.define}
    <input {...props.inputprops} type="number" value={props.getset.get() ?? NaN} onChange={eventSetter} />
  </div>
}

export function InputString(props: FodrInputProps<'inputText', string>) {
  const eventSetter: JSX.ChangeEventHandler<HTMLInputElement, Event> = (ev) => {
    props.getset.set(ev.target.value)
  }
  // inputString
  return <div {...props.containerprops}>
    {props.define}
    <input {...props.inputprops} type="" value={props.getset.get() ?? ''} placeholder={'yo write stuff here'} onChange={eventSetter} />
  </div>
}

export function Input1toN(props: FodrInputProps<'1toN', string>) {
  // input1toN
  return <div {...props.containerprops}>
    {props.define}
    <Row>
      <For each={props.values}>
        {(v, _i) => <div
          onClick={(_ev) => props.getset.set(v)}
          style={{
            width: '42px', height: '42px', "border-radius": '50%',
            border: props.getset.get() == v ? '2px solid green' : '2px dotted black',
            display: 'flex', "align-items": 'center', "justify-content": 'center'
          }}>{v}</div>}
      </For>
    </Row>
  </div>
  // <select>
  //   <For each={props.values}>
  //     {(v, i) =>
  //       <option value={v}>{v}</option>
  //     }
  //   </For>
  // </select>
}

export function InputAudioCoding<T>(props: FodrInputProps<'audioCoding', TimeCodedArray<næ>>) {
  return 'audio...'
}
