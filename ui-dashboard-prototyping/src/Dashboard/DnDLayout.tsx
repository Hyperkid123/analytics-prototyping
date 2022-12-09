import { Box, Card, CardContent, CardHeader, Paper } from "@mui/material";
import React, { useContext, useState } from "react";
import GridLayout, { Layout } from "react-grid-layout";
import DragHandleIcon from "@mui/icons-material/DragHandle";
import componentMapper, {
  ComponentTypes,
  DataContextValueType,
} from "./componentMapper";

export type DnDLayoutItem = Layout;

const DataContext = React.createContext<DataContextValueType>([]);

const LayoutComponentWrapper = ({
  component,
}: {
  component: ComponentTypes;
}) => {
  const Cmp = componentMapper[component];
  const data = useContext(DataContext);
  return <Cmp data={data} />;
};

const DragHandle = () => {
  const [isDragging, setIsDragging] = useState(false);
  return (
    <Box
      onMouseDown={() => setIsDragging(true)}
      onMouseUp={() => setIsDragging(false)}
      className="drag-handle"
      sx={{
        display: "flex",
        justifyContent: "center",
        p: 1,
        cursor: isDragging ? "grabbing" : "grab",
        transition: "backgroundColor, .15s ease-in",
        ":hover": {
          backgroundColor: "#E6E6E6",
        },
      }}
    >
      <DragHandleIcon />
    </Box>
  );
};

const DnDLayout = ({
  allEvents,
  layout,
  handleLayoutUpdate,
}: {
  allEvents: DataContextValueType;
  layout: {
    componentMapping: { [key: string]: ComponentTypes };
    gridLayout: DnDLayoutItem[];
  };
  handleLayoutUpdate: (
    gridLayout: DnDLayoutItem[],
    componentMapping: { [key: string]: ComponentTypes }
  ) => void;
}) => {
  return (
    <div className="grid-dashboard">
      <DataContext.Provider value={allEvents}>
        <GridLayout
          draggableHandle=".drag-handle"
          margin={[16, 16]}
          containerPadding={[8, 8]}
          className="layout"
          cols={12}
          width={1200}
          rowHeight={30}
          onLayoutChange={(newLayout) =>
            handleLayoutUpdate(newLayout, layout.componentMapping)
          }
        >
          {layout.gridLayout.map(({ i, ...rest }) => (
            <Card key={i} data-grid={rest} sx={{ overflow: "hidden" }}>
              <DragHandle />
              <CardContent>
                <LayoutComponentWrapper
                  component={layout.componentMapping[i]}
                />
              </CardContent>
            </Card>
          ))}
        </GridLayout>
      </DataContext.Provider>
    </div>
  );
};

export default DnDLayout;
