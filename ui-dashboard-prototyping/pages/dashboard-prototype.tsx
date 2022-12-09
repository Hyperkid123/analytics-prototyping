import { Grid, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { Container } from "@mui/system";
import DnDLayout, { DnDLayoutItem } from "../src/Dashboard/DnDLayout";
import { DataContextValueType } from "../src/Dashboard/componentMapper";

const DashboardPrototype = () => {
  const [allEvents, setAllEvents] = useState<DataContextValueType | undefined>(
    undefined
  );
  useEffect(() => {
    fetch("/api/event/all")
      .then((r) => r.json())
      .then(({ events }: { events: any }) => {
        setAllEvents(events);
      });
  }, []);
  const initialLayout: DnDLayoutItem[] = [
    {
      component: "JourneyIndicator",
      i: "JourneyIndicator",
      h: 13,
      w: 6,
      x: 0,
      y: 0,
    },
    {
      component: "JourneyLastStep",
      i: "JourneyLastStep",
      h: 10,
      w: 6,
      x: 6,
      y: 0,
    },
    {
      component: "EventActivity",
      i: "EventActivity",
      h: 11,
      w: 6,
      x: 0,
      y: 1,
    },
    {
      component: "ActiveUsers",
      i: "ActiveUsers",
      h: 4,
      w: 6,
      x: 6,
      y: 0,
    },
    {
      component: "ActivityHeatmap",
      i: "ActivityHeatmap",
      h: 20,
      w: 12,
      x: 0,
      y: 4,
    },
    {
      component: "PageEventsGraph",
      i: "PageEventsGraph",
      h: 10,
      w: 6,
      x: 6,
      y: 1,
    },
  ];
  return (
    <Container maxWidth="lg">
      <Grid container spacing={3}>
        <Grid item sm={12}>
          <Typography variant="h1">Dashboard prototype</Typography>
        </Grid>
        <Grid item sm={12}>
          {allEvents ? (
            <DnDLayout layout={initialLayout} allEvents={allEvents} />
          ) : null}
        </Grid>
      </Grid>
    </Container>
  );
};

export default DashboardPrototype;
