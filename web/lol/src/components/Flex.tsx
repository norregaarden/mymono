import { JSX, ParentProps } from "solid-js";

const objectifyThatStyle = (style: JSX.HTMLAttributes<HTMLDivElement>['style']) => style == null ? {} : typeof style == 'string' ? JSON.parse(style) as JSX.CSSProperties : style
type Style = (JSX.HTMLAttributes<HTMLDivElement>['style'] extends infer style ? style extends undefined | string ? never : style : never);
type NiceDivStyleKeys = keyof Style extends infer yo extends string ?
	yo extends `-ms-${infer _suffix}` ? never :
	yo extends `-moz-${infer _suffix}` ? never :
	yo : never;
// type DivStyleProp = JSX.HTMLAttributes<HTMLDivElement>['style'] extends string|undefined ? never:JSX.HTMLAttributes<HTMLDivElement>['style'] 
type DivishProps = ParentProps<
	{ reverse?: boolean } &
	Omit<JSX.HTMLAttributes<HTMLDivElement>, 'style'> &
	{ style?: { [k in NiceDivStyleKeys]?: (Style)[k] } }
>
export const Row = (props: DivishProps) =>
	<div {...props} style={{
		...objectifyThatStyle(props.style),
		display: 'flex',
		"flex-direction": props.reverse ? 'row-reverse' : 'row'
	}} >{props.children}</div>
export const Column = (props: DivishProps) =>
	<div {...props} style={{
		...objectifyThatStyle(props.style),
		display: 'flex',
		"flex-direction": props.reverse ? 'column-reverse' : 'column'
	}} >{props.children}</div>
export const Inline = (props: ParentProps<JSX.HTMLAttributes<HTMLSpanElement>>) => <span {...props} >{props.children}</span>;
export const Block = (props: DivishProps) => <div {...props} >{props.children}</div>;

