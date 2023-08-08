import { JustUnpackSchema, todd } from "../../../../todd/scheme";

const g = todd
// const exampleGenned = g.object({
// 	nam: g.number(), ssh: g.string(),
// 	uuh: g.array([g.boolean(), g.literal('shit')]),
// 	aha: g.array([g.number(), g.object({ lol: g.literal(42) })])
// });
const vardef = { define: g.union([g.undefined(), g.string()]) }
const fordrendeEksempelFodrSchemaPrimitive = g.union([
  g.object({ type: g.literal('header'), value: g.string() }),
  g.object({ type: g.literal('paragraph'), value: g.string() }),
  g.object({ type: g.union([g.literal('linebreak'), g.literal('pagebreak')]) }),
  g.object({ type: g.literal('inputText'), ...vardef }),
  g.object({ type: g.literal('inputNumber'), ...vardef }),
  g.object({ type: g.literal('1toN'), values: g.array([g.string()]), ...vardef }),
]);
const udfordrendeEksempelGennedUnion = g.union([...fordrendeEksempelFodrSchemaPrimitive.cases,
g.object({ type: g.literal('audioCoding'), coding: fordrendeEksempelFodrSchemaPrimitive }),
])
const metaudfordretliste = g.array([...udfordrendeEksempelGennedUnion.cases,
g.object({ type: g.literal('conditional'), question: g.string(), condcases: g.array([g.array([udfordrendeEksempelGennedUnion])]) })
])
export type FordrendeExampleUnpacked = JustUnpackSchema<typeof metaudfordretliste>;
export const eksempelFodr = [
  { type: 'header', value: 'Velkommen til eksemplet' },
  { type: 'inputText', define: 'what yo name' },
  { type: 'paragraph', value: 'En introduktionstekst. blabla. blabla blabla' },
  { type: 'pagebreak' },
  { type: 'inputNumber', define: 'enter yo fav num' },
  { type: "1toN", values: ['met', 'eth', 'prop', 'but'], define: 'meeatpurpleberries' },
  {
    type: "conditional", question: 'audio eller video', condcases: [
      [
        { type: "header", value: 'the audio path' },
        { type: 'audioCoding', coding: { type: "1toN", values: ['patos', 'ethos'], define: 'patoethos' } },
      ],
      [
        { type: 'header', value: 'microcosmos' },
        // {type: 'videoCoding', coding: {type: "1toN", values: ['pænt pænt', 'ked af det kedeligt'], define: 'pæntkedes'}},
      ]
    ]
  }
] as const satisfies FordrendeExampleUnpacked;
