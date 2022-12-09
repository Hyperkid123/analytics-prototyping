import { Grid, TextField, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { DateRangePicker, LocalizationProvider } from "@mui/x-date-pickers-pro";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dynamic from "next/dynamic";
import { Fragment, useEffect, useRef, useState } from "react";

export type EventType = {
  sessionId: string;
  timestamp: number;
  type: string;
  journeyName?: string;
  journeyId?: string;
  journeyStep?: string;
  payload: {
    pathname?: string;
  };
};

export type DataContextValueType = EventType[];

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

const parseToJourney = (journeyName: string, data: DataContextValueType) => {
  const journeys = data.filter(
    (entry) =>
      entry?.type.match(/^journey-/) && entry?.journeyName === journeyName
  );
  const groups = journeys.reduce<{
    [key: string]: EventType[];
  }>((acc, curr) => {
    if (!acc[curr.journeyId!]) {
      return {
        ...acc,
        [curr.journeyId!]: [curr],
      };
    }

    return {
      ...acc,
      [curr.journeyId!]: [...acc[curr.journeyId!], curr],
    };
  }, {});
  return groups;
};

const JourneyIndicator = ({ data }: { data: DataContextValueType }) => {
  const groups = parseToJourney("journey-events", data);
  const journeyGroups = Object.values(groups).reduce(
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

  const internalData = Object.entries(journeyGroups).map(([key, value]) => ({
    name: key,
    value,
  }));
  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Journey completion for {`"journey-events"`} journey.
      </Typography>
      <ReactApexChart
        options={{
          chart: {
            height: "100%",
            type: "donut",
          },
          labels: internalData.map(({ name }) => name),
        }}
        series={internalData.map(({ value }) => value)}
        type="donut"
      />
    </div>
  );
};

const JourneyLastStep = ({ data }: { data: DataContextValueType }) => {
  const journeys = parseToJourney("journey-events", data);
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

      return acc[curr.journeyStep!]
        ? {
            ...acc,
            [curr.journeyStep!]: acc[curr.journeyStep!] + 1,
          }
        : {
            ...acc,
            [curr.journeyStep!]: 1,
          };
    }, {});
  const parsedData = Object.entries(lastSteps).map(([name, value]) => ({
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
            height: "100%",
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

const EventActivity = ({ data = [] }: { data: DataContextValueType }) => {
  const eventActivity = data.reduce<{ [key: number]: number }>((acc, curr) => {
    const hour = new Date(curr.timestamp).getHours();
    return {
      ...acc,
      [hour]: acc[hour] ? acc[hour] + 1 : 1,
    };
  }, {});

  const graphData = Object.values(eventActivity);
  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="h4">Active events count by hour</Typography>
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

const ActiveUsers = ({ data = [] }: { data: DataContextValueType }) => {
  const count = new Set(data.map(({ sessionId }) => sessionId)).size;
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

const generateEmptyHeatMap = () =>
  [...Array(7)].reduce<{
    [key: number]: {
      count: number;
      activeSessions: string[];
    }[];
  }>((acc, _, index) => {
    return {
      ...acc,
      [index + 1]: [...Array(24)].fill({ count: 0, activeSessions: [] }),
    };
  }, {});

const getUserActivityHeatmap = (events: EventType[]) => {
  const activeByDays = events.reduce((acc, curr) => {
    const eventDate = new Date(curr.timestamp);
    const eventDay = eventDate.getDay();
    const eventHour = eventDate.getHours();
    const eventSession = curr.sessionId;
    const sessionDatapoint = { ...acc[eventDay][eventHour] };
    if (!sessionDatapoint.activeSessions.includes(eventSession)) {
      sessionDatapoint.activeSessions.push(eventSession);
      sessionDatapoint.count += 1;
    }
    return {
      ...acc,
      [eventDay]: acc[eventDay].map((val, index) =>
        index === eventHour ? sessionDatapoint : val
      ),
    };
  }, generateEmptyHeatMap());
  return activeByDays;
};

const ActivityHeatmap = ({ data = [] }: { data: DataContextValueType }) => {
  const internalData = useRef(getUserActivityHeatmap(data));
  const maximumAcitvity = Object.entries(internalData.current).reduce<number>(
    (acc, [, dayData]) => {
      const dayMax = Math.max(...dayData.map(({ count }) => count));
      return Math.max(acc, dayMax);
    },
    0
  );
  const step = maximumAcitvity / colorScale.length;

  const heatmapData = Object.entries(internalData.current).reduce<
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

const PageEventsGraph = ({ data = [] }: { data: DataContextValueType }) => {
  const pathnames = data
    .filter(({ type }) => type === "page")
    .map(({ payload: { pathname } }) => pathname as string);
  const sum = Object.entries(
    pathnames.reduce<{ [key: string]: number }>((acc, curr) => {
      return {
        ...acc,
        [curr]: acc[curr] ? acc[curr] + 1 : 1,
      };
    }, {})
  )
    .map(([pathname, count]) => ({ pathname, count }))
    .sort((a, b) => (a.count < b.count ? 1 : -1));
  const series = sum.map(({ pathname, count }) => ({
    x: pathname,
    y: count,
  }));
  return (
    <div>
      <Typography variant="h4">Most visited pages</Typography>
      <ReactApexChart
        type="bar"
        options={{
          series: [
            {
              data: series,
            },
          ],
        }}
        series={[{ name: "visited pages", data: series }]}
      />
    </div>
  );
};

const componentMapper = {
  PageEventsGraph,
  ActivityHeatmap,
  ActiveUsers,
  EventActivity,
  JourneyLastStep,
  JourneyIndicator,
};

export type ComponentTypes = keyof typeof componentMapper;

export default componentMapper;
