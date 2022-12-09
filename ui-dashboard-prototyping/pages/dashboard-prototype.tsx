import { Grid, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { Container } from "@mui/system";
import DnDLayout, { DnDLayoutItem } from "../src/Dashboard/DnDLayout";
import { DataContextValueType } from "../src/Dashboard/componentMapper";

const DashboardPrototype = () => {
  const [allEvents, setAllEvents] = useState<DataContextValueType | undefined>(
    undefined
  );
  const [layout, setLayout] = useState<DnDLayoutItem[] | undefined>(undefined);
  useEffect(() => {
    fetch("/api/event/all")
      .then((r) => r.json())
      .then(({ events }: { events: any }) => {
        setAllEvents(events);
      });
    fetch("/api/layout")
      .then((r) => r.json())
      .then(({ layout }: { layout: DnDLayoutItem[] }) => setLayout(layout));
  }, []);

  const handleLayoutUpdate = (layout: DnDLayoutItem[]) => {
    fetch("/api/layout", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(
        layout.map(({ i, ...rest }) => ({
          ...rest,
          i,
          component: i,
        }))
      ),
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
