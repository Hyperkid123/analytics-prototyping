import { Container, Grid, Paper, Typography } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import defaultLayouts, {
  DefaultLayout,
  LayoutNode,
  NodeEventTypes,
} from "../src/Guides/default-layouts";
import objToString from "../src/utils/jsToCss";

const eventHandlers: { [key in NodeEventTypes]: (args: any[]) => any } = {
  [NodeEventTypes.click]: console.log,
};

const createHtml = (layout: LayoutNode) => {
  const element = document.createElement(layout.defaultElement);
  const cssString = objToString(layout.defaultStyle || {});
  element.style.cssText = cssString;
  const nodes: (Node | string)[] = [];
  if (layout.actions) {
    layout.actions.forEach(({ eventType, params = [] }) => {
      element.addEventListener(eventType, () =>
        // @ts-ignore
        eventHandlers[eventType](...params)
      );
    });
  }
  if (layout.children) {
    layout.children.forEach((childNode) => {
      if (typeof childNode === "string") {
        element.innerHTML = element.innerHTML + childNode;
      } else {
        element.append(createHtml(childNode));
      }
    });
  }
  element.append(...nodes);

  return element;
};

const RenderPreview = ({ layout }: { layout: DefaultLayout }) => {
  const mounted = useRef<boolean>(false);
  const rootRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!mounted.current) {
      rootRef.current?.appendChild(createHtml(layout));
      mounted.current = true;
    }
  }, [layout]);
  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h4" component="h2">
        {layout.title}
      </Typography>
      <div style={{ position: "relative" }} ref={rootRef} />
    </Paper>
  );
};

const CreateGuidePage = () => {
  return (
    <Container maxWidth="xl">
      <Grid container spacing={3}>
        <Grid item xs={12}>
          There will be dragons
        </Grid>
        <Grid item xs={3}>
          {defaultLayouts.map((item, index) => (
            <RenderPreview key={index} layout={item} />
          ))}
        </Grid>
      </Grid>
    </Container>
  );
};

export default CreateGuidePage;
