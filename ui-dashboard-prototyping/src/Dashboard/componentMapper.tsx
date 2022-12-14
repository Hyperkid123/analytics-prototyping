import { Grid, Stack, Typography } from "@mui/material";
import dynamic from "next/dynamic";
import { useEffect, useMemo, useRef } from "react";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import { Box } from "@mui/system";

export type EventType = {
  data: {
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
  userID: string;
};

export type DataContextValueType = EventType[];

export type DashboardComponentProps = {
  widgetId: string;
  handleAddAlert: (id: string, message: string) => void;
  handleRemoveAlert: (id: string) => void;
  data: DataContextValueType;
};

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

const parseToJourney = (journeyName: string, data: DataContextValueType) => {
  const journeys = data.filter(
    (entry) =>
      entry?.data?.type.match(/^journey-/) &&
      entry?.data?.journeyName === journeyName
  );
  const groups = journeys.reduce<{
    [key: string]: EventType[];
  }>((acc, curr) => {
    if (!acc[curr.data.journeyId!]) {
      return {
        ...acc,
        [curr.data.journeyId!]: [curr],
      };
    }

    return {
      ...acc,
      [curr.data.journeyId!]: [...acc[curr.data.journeyId!], curr],
    };
  }, {});
  return groups;
};

const JourneyIndicator = ({ data }: DashboardComponentProps) => {
  const groups = parseToJourney("journey-events", data);
  const journeyGroups = Object.values(groups).reduce(
    (acc, curr) => {
      let resolved = false;
      curr.forEach(({ data: { type } }) => {
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

const JourneyLastStep = ({ data }: DashboardComponentProps) => {
  const journeys = parseToJourney("journey-events", data);
  const lastSteps = Object.values(journeys)
    .map((group) => group.slice(group.length - 1))
    .flat()
    .reduce<{ [key: string]: number }>((acc, curr) => {
      if (
        curr.data.type === "journey-start" ||
        curr.data.type === "journey-finish" ||
        curr.data.type === "journey-cancel"
      ) {
        return acc[curr.data.type]
          ? { ...acc, [curr.data.type]: (acc[curr.data.type] += 1) }
          : { ...acc, [curr.data.type]: 1 };
      }

      return acc[curr.data.journeyStep!]
        ? {
            ...acc,
            [curr.data.journeyStep!]: acc[curr.data.journeyStep!] + 1,
          }
        : {
            ...acc,
            [curr.data.journeyStep!]: 1,
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
          plotOptions: {
            bar: {
              horizontal: true,
            },
          },
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

const EventActivityHours = ({ data = [] }: DashboardComponentProps) => {
  const eventActivity = data.reduce<{ [key: number]: number }>((acc, curr) => {
    const hour = new Date(curr.data.timestamp).getHours();
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

const EventDelta = ({
  data = [],
  handleRemoveAlert,
  handleAddAlert,
  widgetId,
}: DashboardComponentProps) => {
  const today = new Date().getDate();
  const prevWeekLimit = today - 7;
  const hardLimit = today - 14;
  const { currentSessions, prevSessions } = useMemo(() => {
    const { currentWeek, prevWeek } = data.reduce<{
      currentWeek: EventType[];
      prevWeek: EventType[];
    }>(
      (acc, curr) => {
        const currentDay = new Date(curr.data.timestamp).getDate();
        if (currentDay >= prevWeekLimit) {
          acc.currentWeek.push(curr);
        } else if (currentDay < prevWeekLimit && currentDay > hardLimit) {
          acc.prevWeek.push(curr);
        }
        return {
          ...acc,
        };
      },
      {
        currentWeek: [],
        prevWeek: [],
      }
    );
    const currentSessions = Array.from(
      new Set(currentWeek.map(({ data: { sessionId } }) => sessionId))
    );
    const prevSessions = Array.from(
      new Set(prevWeek.map(({ data: { sessionId } }) => sessionId))
    );
    return {
      currentSessions,
      prevSessions,
    };
  }, [data, hardLimit, prevWeekLimit]);

  const delta = currentSessions.length / (prevSessions.length / 100);
  useEffect(() => {
    if (delta > 100) {
      handleRemoveAlert(widgetId);
    } else {
      handleAddAlert(widgetId, "Weekly users decrease");
    }
  }, [delta]);

  return (
    <div>
      <Typography component="h2" variant="h4" sx={{ mb: 2 }}>
        Weekly users
      </Typography>
      <Stack direction="row" spacing={3}>
        <Stack>
          <Typography>Last week</Typography>
          <Typography component="h3" variant="h2">
            {prevSessions.length}
          </Typography>
        </Stack>
        <Stack>
          <Typography>This week</Typography>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Typography
              component="h3"
              variant="h2"
              sx={{ overflowWrap: "normal", whiteSpace: "nowrap", mr: 1 }}
            >
              {currentSessions.length}
            </Typography>
            <div>
              {delta > 100 ? (
                <ArrowUpwardIcon fontSize="large" color="success" />
              ) : (
                <ArrowDownwardIcon fontSize="large" color="error" />
              )}
              <Typography
                variant="subtitle2"
                color={delta > 100 ? "#2e7d32" : "#ff1744"}
              >
                {delta}&nbsp;%
              </Typography>
            </div>
          </Box>
        </Stack>
      </Stack>
    </div>
  );
};

const ActiveUsers = ({ data = [] }: DashboardComponentProps) => {
  const count = new Set(data.map(({ data: { sessionId } }) => sessionId)).size;
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
    const eventDate = new Date(curr.data.timestamp);
    const eventDay = eventDate.getDay();
    const eventHour = eventDate.getHours();
    const eventSession = curr.data.sessionId;
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

const ActivityHeatmap = ({ data = [] }: DashboardComponentProps) => {
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

const PageEventsGraph = ({ data = [] }: DashboardComponentProps) => {
  const pathnames = data
    .filter(({ data: { type } }) => type === "page")
    .map(
      ({
        data: {
          payload: { pathname },
        },
      }) => pathname as string
    );
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
          xaxis: {
            labels: {
              rotate: 0,
            },
          },
          plotOptions: {
            bar: {
              horizontal: true,
            },
          },
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
  EventActivityHours,
  JourneyLastStep,
  JourneyIndicator,
  EventDelta,
};

export type ComponentTypes = keyof typeof componentMapper;

export default componentMapper;
