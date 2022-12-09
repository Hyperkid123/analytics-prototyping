import { Paper } from "@mui/material";
import React, { useContext } from "react";
import GridLayout, { Layout } from "react-grid-layout";
import componentMapper, {
  ComponentTypes,
  DataContextValueType,
} from "./componentMapper";

export type DnDLayoutItem = Layout & {
  component: ComponentTypes;
};

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

const DnDLayout = ({
  allEvents,
  layout,
}: {
  allEvents: DataContextValueType;
  layout: DnDLayoutItem[];
}) => {
  return (
    <div>
      <DataContext.Provider value={allEvents}>
        <GridLayout className="layout" cols={12} width={1200} rowHeight={30}>
          {layout.map(({ i, component, ...rest }) => (
            <Paper sx={{ overflow: "hidden" }} key={i} data-grid={rest}>
              <LayoutComponentWrapper component={component} />
            </Paper>
          ))}
        </GridLayout>
      </DataContext.Provider>
    </div>
  );
};

export default DnDLayout;
