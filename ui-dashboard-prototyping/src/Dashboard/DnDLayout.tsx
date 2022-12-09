import { Box, Card, CardContent, IconButton, styled } from "@mui/material";
import React, { useContext, useState } from "react";
import GridLayout, { Layout } from "react-grid-layout";
import DragHandleIcon from "@mui/icons-material/DragHandle";
import DeleteIcon from "@mui/icons-material/Delete";
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

const DragHandle = ({ handleRemoveItem }: { handleRemoveItem: () => void }) => {
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
  handleRemoveItem: (itemId: string) => void;
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
              <DragHandle handleRemoveItem={() => handleRemoveItem(i)} />
              <CardContent>
                <LayoutComponentWrapper
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
