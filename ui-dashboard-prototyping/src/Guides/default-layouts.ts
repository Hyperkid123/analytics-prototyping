export enum NodeEventTypes {
  "click" = "click",
}

interface NodeAction {
  type: "close"; // add more types in the future
  eventType: NodeEventTypes; // add more events later
  params?: any[];
}

export interface LayoutNode {
  defaultElement: string;
  defaultStyle?: Partial<ElementCSSInlineStyle["style"]>;
  children?: LayoutNode[] | string[];
  actions?: NodeAction[];
}

export interface DefaultLayout extends LayoutNode {
  id: string;
  title: string;
}

const defaultLayouts: DefaultLayout[] = [
  {
    id: "simple-banner",
    title: "Simple banner",
    defaultElement: "div",
    defaultStyle: {
      position: "relative",
      width: "200px",
      height: "50px",
      boxShadow: "2px 2px 5px 0px rgba(0,0,0,0.2)",
      padding: "8px",
    },
    children: [
      {
        defaultElement: "span",
        children: ["&times;"],
        actions: [
          {
            type: "close",
            eventType: NodeEventTypes.click,
            params: ["foo", "bar"],
          },
        ],
        defaultStyle: {
          position: "absolute",
          right: "0",
          marginRight: "8px",
          fontSize: "1.5em",
          cursor: "pointer",
        },
      },
    ],
  },
];

export default defaultLayouts;
