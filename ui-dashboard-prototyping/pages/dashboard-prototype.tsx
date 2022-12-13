import { Grid, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { Container } from "@mui/system";
import DnDLayout, { DnDLayoutItem } from "../src/Dashboard/DnDLayout";
import {
  ComponentTypes,
  DataContextValueType,
} from "../src/Dashboard/componentMapper";
import WidgetSelector from "../src/Dashboard/WidgetSelector";

const DashboardPrototype = () => {
  const [allEvents, setAllEvents] = useState<DataContextValueType | undefined>(
    undefined
  );
  const [layout, setLayout] = useState<
    | {
        gridLayout: DnDLayoutItem[];
        componentMapping: { [key: string]: ComponentTypes };
      }
    | undefined
  >(undefined);
  const [widgets, setWidgets] = useState<ComponentTypes[]>([]);
  useEffect(() => {
    fetch("http://localhost:8000/events")
      .then((r) => r.json())
      .then((events: DataContextValueType) => {
        setAllEvents(events);
      });
    fetch("/api/layout")
      .then((r) => r.json())
      .then(
        ({
          layout: { gridLayout, componentMapping },
        }: {
          layout: {
            componentMapping: { [key: string]: ComponentTypes };
            gridLayout: DnDLayoutItem[];
          };
        }) => setLayout({ gridLayout, componentMapping })
      );
    fetch("/api/widgets")
      .then((r) => r.json())
      .then(({ widgets }: { widgets: ComponentTypes[] }) =>
        setWidgets(widgets)
      );
  }, []);

  const handleLayoutUpdate = (
    gridLayout: DnDLayoutItem[],
    componentMapping: { [key: string]: ComponentTypes }
  ) => {
    fetch("/api/layout", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        gridLayout,
        componentMapping,
      }),
    });
  };

  const handleAddWidget = (widgetType: ComponentTypes) => {
    const i = `${widgetType}-${Date.now()}`;
    const newWidget = {
      w: 6,
      h: 6,
      x: 0,
      y: 0,
      i,
    };
    setLayout((prev) => ({
      componentMapping: {
        ...prev?.componentMapping,
        [i]: widgetType,
      },
      gridLayout: [newWidget, ...(prev?.gridLayout || [])],
    }));
  };

  const handleRemoveItem = (itemId: string) => {
    setLayout((prev) => ({
      gridLayout: prev?.gridLayout.filter(({ i }) => i !== itemId) || [],
      componentMapping: Object.entries(prev?.componentMapping || {}).reduce<{
        [key: string]: ComponentTypes;
      }>((acc, [key, value]) => {
        if (key !== itemId) {
          return {
            ...acc,
            [key]: value,
          };
        }
        return acc;
      }, {}),
    }));
  };

  return (
    <Container maxWidth="lg">
      <Grid container spacing={3}>
        <Grid item sm={12}>
          <WidgetSelector
            handleAddWidget={handleAddWidget}
            widgetList={widgets}
          />
        </Grid>
        <Grid item sm={12}>
          {allEvents && layout ? (
            <DnDLayout
              handleRemoveItem={handleRemoveItem}
              handleLayoutUpdate={handleLayoutUpdate}
              layout={layout}
              allEvents={allEvents}
            />
          ) : null}
        </Grid>
      </Grid>
    </Container>
  );
};

export default DashboardPrototype;
