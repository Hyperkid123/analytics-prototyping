import { Grid, TextField, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { DateRangePicker, LocalizationProvider } from "@mui/x-date-pickers-pro";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dynamic from "next/dynamic";
import { Fragment, useEffect, useState } from "react";

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

const PageEventsGraph = ({ data }: { data: string[] }) => {
  const sum = Object.entries(
    data.reduce<{ [key: string]: number }>((acc, curr) => {
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
