import {
  Box,
  Card,
  CardContent,
  IconButton,
  styled,
  Tooltip,
} from "@mui/material";
import React, { useContext, useState } from "react";
import GridLayout, { Layout } from "react-grid-layout";
import DragHandleIcon from "@mui/icons-material/DragHandle";
import WarningIcon from "@mui/icons-material/Warning";
import DeleteIcon from "@mui/icons-material/Delete";
import componentMapper, {
  ComponentTypes,
  DataContextValueType,
} from "./componentMapper";

export type DnDLayoutItem = Layout;

const DataContext = React.createContext<DataContextValueType>([]);

const LayoutComponentWrapper = ({
  component,
  handleAddAlert,
  handleRemoveAlert,
  widgetId,
}: {
  component: ComponentTypes;
  handleAddAlert: (id: string, message: string) => void;
  handleRemoveAlert: (id: string) => void;
  widgetId: string;
}) => {
  const Cmp = componentMapper[component];
  const data = useContext(DataContext);
  return (
    <Cmp
      widgetId={widgetId}
      handleAddAlert={handleAddAlert}
      handleRemoveAlert={handleRemoveAlert}
      data={data}
    />
  );
};

const DragHandle = ({
  handleRemoveItem,
  alert,
}: {
  alert?: string;
  handleRemoveItem: () => void;
}) => {
  const [isDragging, setIsDragging] = useState(false);
  return (
    <Box
      onMouseDown={() => setIsDragging(true)}
      onMouseUp={() => setIsDragging(false)}
      className="drag-handle"
      sx={{
        position: "relative",
        display: "flex",
        justifyContent: "space-between",
        p: 1,
        cursor: isDragging ? "grabbing" : "grab",
        transition: "backgroundColor, .15s ease-in",
        ":hover": {
          backgroundColor: "#E6E6E6",
          ".remove-container": {
            opacity: "0.8",
          },
        },
      }}
    >
      {alert && (
        <Box sx={{ position: "absolute", left: 0, top: 0 }}>
          <Tooltip placement="bottom" title={<Box>{alert}</Box>}>
            <IconButton
              onMouseDown={(e) => e.stopPropagation()}
              color="warning"
              sx={{ cursor: "help" }}
            >
              <WarningIcon />
            </IconButton>
          </Tooltip>
        </Box>
      )}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          flex: 1,
        }}
      >
        <DragHandleIcon />
      </Box>
      <Box
        sx={{ opacity: 0, position: "absolute", right: 0, top: 0 }}
        className="remove-container"
      >
        <IconButton
          onClick={(e) => {
            e.stopPropagation();
            handleRemoveItem();
          }}
          color="error"
          aria-label="delete"
        >
          <DeleteIcon />
        </IconButton>
      </Box>
    </Box>
  );
};

const LayoutWrapper = styled("div")({
  transform: "translate(-10px)",
});

const DnDLayout = ({
  allEvents,
  layout,
  handleLayoutUpdate,
  handleRemoveItem,
  handleAddAlert,
  handleRemoveAlert,
  alerts,
}: {
  allEvents: DataContextValueType;
  layout: {
    componentMapping: { [key: string]: ComponentTypes };
    gridLayout: DnDLayoutItem[];
  };
  handleAddAlert: (id: string, message: string) => void;
  handleRemoveAlert: (id: string) => void;
  handleLayoutUpdate: (
    gridLayout: DnDLayoutItem[],
    componentMapping: { [key: string]: ComponentTypes }
  ) => void;
  handleRemoveItem: (itemId: string) => void;
  alerts: { [key: string]: string };
}) => {
  return (
    <LayoutWrapper>
      <DataContext.Provider value={allEvents}>
        <GridLayout
          draggableHandle=".drag-handle"
          className="layout"
          cols={12}
          width={1173}
          rowHeight={30}
          onLayoutChange={(newLayout) =>
            handleLayoutUpdate(newLayout, layout.componentMapping)
          }
        >
          {layout.gridLayout.map(({ i, ...rest }) => (
            <Card key={i} data-grid={rest} sx={{ overflow: "hidden" }}>
              <DragHandle
                alert={alerts[i]}
                handleRemoveItem={() => handleRemoveItem(i)}
              />
              <CardContent>
                <LayoutComponentWrapper
                  widgetId={i}
                  handleAddAlert={handleAddAlert}
                  handleRemoveAlert={handleRemoveAlert}
                  component={layout.componentMapping[i]}
                />
              </CardContent>
            </Card>
          ))}
        </GridLayout>
      </DataContext.Provider>
    </LayoutWrapper>
  );
};

export default DnDLayout;
