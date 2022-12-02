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

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

const JourneyIndicator = ({
  data,
}: {
  data?: { name: string; value: number }[];
}) => {
  if (!data) {
    return null;
  }
  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Journey completion for {`"journey-events"`} journey.
      </Typography>
      <ReactApexChart
        options={{
          chart: {
            width: 400,
            type: "donut",
          },
          labels: data.map(({ name }) => name),
        }}
        series={data.map(({ value }) => value)}
        type="donut"
      />
    </div>
  );
};

const JourneyLastStep = ({ data }: { data: { [key: string]: number } }) => {
  const parsedData = Object.entries(data).map(([name, value]) => ({
    name,
    value,
  }));
  return (
    <div>
      <Typography variant="h4" gutterBottom>
        {`"journey-events"`} ending events
      </Typography>
      <ReactApexChart
        options={{
          chart: {
            type: "bar",
            height: 350,
          },
          labels: parsedData.map(({ name }) => name),
        }}
        type="bar"
        series={[
          {
            name: "Journey steps",
            data: parsedData.map(({ value }) => value),
          },
        ]}
      />
    </div>
  );
};

const EventActivity = () => {
  const [eventActivity, setEventActivity] = useState<{ [key: number]: number }>(
    {}
  );
  const [range, setRange] = useState<[number | null, number | null]>([
    null,
    null,
  ]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (range[0]) {
      params.append("start", `${new Date(range[0]?.toString()).getTime()}`);
    }

    if (range[1]) {
      params.append("end", `${new Date(range[1]?.toString()).getTime()}`);
    }

    fetch(`/api/event/activity?${params.toString()}`)
      .then((r) => r.json())
      .then(({ events }: { events: { timestamp: number }[] }) => {
        const groupedEvents = events.reduce<{ [key: number]: number }>(
          (acc, curr) => {
            const hour = new Date(curr.timestamp).getHours();
            return {
              ...acc,
              [hour]: acc[hour] ? acc[hour] + 1 : 1,
            };
          },
          {}
        );
        setEventActivity(groupedEvents);
      });
  }, [range]);

  const graphData = Object.values(eventActivity);
  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="h4">Active events count by hour</Typography>
      </Grid>
      <Grid item xs={12}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DateRangePicker
            value={range}
            onChange={(newValue) => {
              setRange(newValue);
            }}
            renderInput={(startProps, endProps) => (
              <Fragment>
                <TextField {...startProps} />
                <Box sx={{ mx: 2 }}> to </Box>
                <TextField {...endProps} />
              </Fragment>
            )}
          />
        </LocalizationProvider>
      </Grid>
      <Grid item xs={12}>
        <ReactApexChart
          type="line"
          series={[
            {
              name: "Events by hour",
              data: graphData,
            },
          ]}
          options={{
            stroke: {
              curve: "smooth",
            },
            xaxis: {
              categories: Object.keys(eventActivity).map((h) => `${h}h`),
            },
          }}
        />
      </Grid>
    </Grid>
  );
};

const ActiveUsers = ({ count }: { count: number }) => {
  return (
    <div>
      <Typography variant="h4">Active Users</Typography>
      <Typography variant="h3">{count}</Typography>
    </div>
  );
};

const colorScale = [
  "#0A2F51",
  "#0E4D64",
  "#137177",
  "#188977",
  "#1D9A6C",
  "#39A96B",
  "#56B870",
  "#74C67A",
  "#99D492",
  "#BFE1B0",
  "#DEEDCF",
].reverse();

const ActivityHeatmap = ({
  data,
}: {
  data: {
    [key: number]: {
      count: number;
      activeSessions: string[];
    }[];
  };
}) => {
  const maximumAcitvity = Object.entries(data).reduce<number>(
    (acc, [, dayData]) => {
      const dayMax = Math.max(...dayData.map(({ count }) => count));
      return Math.max(acc, dayMax);
    },
    0
  );
  const step = maximumAcitvity / colorScale.length;

  const heatmapData = Object.entries(data).reduce<
    {
      name: string;
      data: {
        x: string;
        y: number;
      }[];
    }[]
  >((acc, [dayNumber, dayData]) => {
    const baseDate = new Date(Date.UTC(2017, 0, Number(dayNumber)));
    const name = baseDate.toLocaleDateString("en-Us", { weekday: "long" });
    return [
      ...acc,
      {
        name,
        data: dayData.map(({ count }, index) => ({ x: `${index}`, y: count })),
        min: 0,
        max: maximumAcitvity,
      },
    ];
  }, []);
  return (
    <div>
      <Typography variant="h4">User activity heatmap</Typography>
      <ReactApexChart
        options={{
          legend: {
            position: "right",
          },
          dataLabels: {
            enabled: true,
            style: {
              colors: ["white"],
            },
          },
          chart: {
            type: "heatmap",
          },
          plotOptions: {
            heatmap: {
              shadeIntensity: 0.5,
              radius: 0,
              useFillColorAsStroke: true,
              colorScale: {
                ranges: colorScale.map((color, index) => ({
                  from: index * step,
                  to:
                    index + 1 === colorScale.length
                      ? Number.MAX_SAFE_INTEGER
                      : (index + 1) * step,
                  name: `${
                    index + 1 === colorScale.length
                      ? maximumAcitvity
                      : Math.trunc(index * step) + 1
                  } users`,
                  color,
                })),
              },
            },
          },
          // bug with the x has to be a string but TS says it has to be a number
          series: heatmapData as unknown as ApexAxisChartSeries,
          labels: [...Array(24)].map((_, index) => `${index}h`),
          stroke: {
            width: 1,
          },
        }}
        type="heatmap"
        series={heatmapData as unknown as ApexAxisChartSeries}
      />
    </div>
  );
};

const DashboardPrototype = () => {
  const [data, setData] = useState<
    { name: string; value: number }[] | undefined
  >(undefined);
  const [lastSteps, setLastSteps] = useState<{ [key: string]: number }>({});
  const [activeUsersCount, setActiveUsersCount] = useState(0);
  const [heatmap, setheatmap] = useState<{
    [key: number]: {
      count: number;
      activeSessions: string[];
    }[];
  }>({});
  useEffect(() => {
    fetch("/api/event/active/users")
      .then((r) => r.json())
      .then(({ users }: { [key: string]: number }) => {
        setActiveUsersCount(Object.keys(users).length);
      });
    fetch("/api/event/users/heatmap")
      .then((r) => r.json())
      .then(
        ({
          heatmap,
        }: {
          heatmap: {
            [key: number]: {
              count: number;
              activeSessions: string[];
            }[];
          };
        }) => {
          setheatmap(heatmap);
        }
      );
    fetch("/api/event/journeys?journey=journey-events")
      .then((r) => r.json())
      .then(
        ({
          journeys,
        }: {
          journeys: { [key: string]: { type: string; journeyStep: string }[] };
        }) => {
          const lastSteps = Object.values(journeys)
            .map((group) => group.slice(group.length - 1))
            .flat()
            .reduce<{ [key: string]: number }>((acc, curr) => {
              if (
                curr.type === "journey-start" ||
                curr.type === "journey-finish" ||
                curr.type === "journey-cancel"
              ) {
                return acc[curr.type]
                  ? { ...acc, [curr.type]: (acc[curr.type] += 1) }
                  : { ...acc, [curr.type]: 1 };
              }

              return acc[curr.journeyStep]
                ? {
                    ...acc,
                    [curr.journeyStep]: acc[curr.journeyStep] + 1,
                  }
                : {
                    ...acc,
                    [curr.journeyStep]: 1,
                  };
            }, {});
          setLastSteps(lastSteps);
          const data = Object.values(journeys).reduce(
            (acc, curr) => {
              let resolved = false;
              curr.forEach(({ type }) => {
                if (type === "journey-start") {
                  // acc.started += 1
                }
                if (type === "journey-finish") {
                  acc.finished += 1;
                  resolved = true;
                }
                if (type === "journey-cancel") {
                  acc.canceled += 1;
                  resolved = true;
                }
              });
              if (!resolved) {
                acc.unresolved += 1;
              }
              return acc;
            },
            {
              // started: 0,
              canceled: 0,
              finished: 0,
              unresolved: 0,
            }
          );
          setData(
            Object.entries(data).map(([key, value]) => ({
              name: key,
              value,
            }))
          );
        }
      );
  }, []);
  return (
    <Container maxWidth="lg">
      <Grid container spacing={3}>
        <Grid item sm={12}>
          <Typography variant="h1">Dashboard prototype</Typography>
        </Grid>
        <Grid item sm={6}>
          <JourneyIndicator data={data} />
        </Grid>
        <Grid item sm={6}>
          <JourneyLastStep data={lastSteps} />
        </Grid>
        <Grid item sm={8}>
          <EventActivity />
        </Grid>
        <Grid item sm={4}>
          <ActiveUsers count={activeUsersCount} />
        </Grid>
        <Grid item sm={12}>
          <ActivityHeatmap data={heatmap} />
        </Grid>
      </Grid>
    </Container>
  );
};

export default DashboardPrototype;
