import { Grid, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { Container } from "@mui/system";
import DnDLayout, { DnDLayoutItem } from "../src/Dashboard/DnDLayout";
import {
  ComponentTypes,
  DataContextValueType,
} from "../src/Dashboard/componentMapper";

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
  useEffect(() => {
    fetch("/api/event/all")
      .then((r) => r.json())
      .then(({ events }: { events: any }) => {
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

  return (
    <Container maxWidth="lg">
      <Grid container spacing={3}>
        <Grid item sm={12}>
          <Typography variant="h1">Dashboard prototype</Typography>
        </Grid>
        <Grid item sm={12}>
          {allEvents && layout ? (
            <DnDLayout
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
