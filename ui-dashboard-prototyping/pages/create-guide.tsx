import { Box, Container, Grid, Paper, Typography } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";

import {
  DefaultLayout,
  LayoutNode,
  NodeEventTypes,
} from "../src/Guides/default-layouts";
import objToString from "../src/utils/jsToCss";
import GuideBuildTrigger from "../src/Guides/BuilderTrigger";

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

const RenderPreview = ({
  layout,
  handleSelect,
  isSelected,
}: {
  layout: DefaultLayout;
  handleSelect: () => void;
  isSelected: boolean;
}) => {
  const mounted = useRef<boolean>(false);
  const rootRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!mounted.current) {
      rootRef.current?.appendChild(createHtml(layout));
      mounted.current = true;
    }
  }, [layout]);
  return (
    <Paper
      variant={isSelected ? "outlined" : "elevation"}
      sx={{ p: 3, cursor: "pointer" }}
      onClick={handleSelect}
    >
      <Typography variant="h4" component="h2">
        {layout.title}
      </Typography>
      <div style={{ position: "relative" }} ref={rootRef} />
    </Paper>
  );
};

const CreateGuidePage = () => {
  const [layouts, setLayouts] = useState<DefaultLayout[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedLayout, setSelectedLayout] = useState<string | undefined>(
    undefined
  );
  useEffect(() => {
    fetch("/api/layout")
      .then((r) => r.json())
      .then(({ layouts }: { layouts: DefaultLayout[] }) => {
        setLayouts(layouts);
        setIsLoading(false);
      });
  }, []);
  return (
    <Container maxWidth="xl">
      {isLoading ? (
        <Box
          sx={{
            display: "flex",
            p: 8,
            justifyContent: "center",
            alignItems: "center",
            height: "calc(100vh - 64px)",
          }}
        >
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            {!selectedLayout ? (
              <Typography variant="h2" component="h4">
                Select guide layout
              </Typography>
            ) : (
              <GuideBuildTrigger layoutId={selectedLayout} />
            )}
          </Grid>
          <Grid item xs={3}>
            {layouts.map((item, index) => (
              <RenderPreview
                isSelected={selectedLayout === item.id}
                handleSelect={() => setSelectedLayout(item.id)}
                key={index}
                layout={item}
              />
            ))}
          </Grid>
        </Grid>
      )}
    </Container>
  );
};

export default CreateGuidePage;
