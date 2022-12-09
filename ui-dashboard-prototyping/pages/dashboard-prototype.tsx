import { Box, Grid, TextField, Typography } from "@mui/material";
import { Fragment, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { LocalizationProvider } from "@mui/x-date-pickers-pro";
import { AdapterDayjs } from "@mui/x-date-pickers-pro/AdapterDayjs";
import {
  DateRangePicker,
  DateRange,
} from "@mui/x-date-pickers-pro/DateRangePicker";
import { Container } from "@mui/system";
import DnDLayout, { DnDLayoutItem } from "../src/Dashboard/DnDLayout";
import { DataContextValueType } from "../src/Dashboard/componentMapper";

const DashboardPrototype = () => {
  const [allEvents, setAllEvents] = useState<DataContextValueType>(undefined);
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
      h: 4,
      w: 6,
      x: 0,
      y: 0,
    },
    {
      component: "JourneyLastStep",
      i: "JourneyLastStep",
      h: 3,
      w: 6,
      x: 6,
      y: 0,
    },
    {
      component: "EventActivity",
      i: "EventActivity",
      h: 4,
      w: 8,
      x: 0,
      y: 1,
    },
    {
      component: "ActiveUsers",
      i: "ActiveUsers",
      h: 1,
      w: 6,
      x: 6,
      y: 1,
    },
    {
      component: "ActivityHeatmap",
      i: "ActivityHeatmap",
      h: 5,
      w: 12,
      x: 0,
      y: 2,
    },
    {
      component: "PageEventsGraph",
      i: "PageEventsGraph",
      h: 3,
      w: 6,
      x: 0,
      y: 4,
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
        {/*
        <Grid item sm={6}>
          <PageEventsGraph data={pageData} />
        </Grid> */}
      </Grid>
    </Container>
  );
};

export default DashboardPrototype;
