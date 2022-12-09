import { Paper } from "@mui/material";
import GridLayout, { Layout } from "react-grid-layout";
import { ComponentTypes } from "./componentMapper";

export type DnDLayoutItem = Layout & {
  component: ComponentTypes;
};

const DnDLayout = ({
  allEvents,
  layout,
}: {
  allEvents?: {}[];
  layout: DnDLayoutItem[];
}) => {
  return (
    <div>
      <GridLayout className="layout" cols={12} width={1200}>
        {layout.map(({ i, component, ...rest }) => (
          <Paper key={i} data-grid={rest}>
            {component}
          </Paper>
        ))}
      </GridLayout>
    </div>
  );
};

export default DnDLayout;
