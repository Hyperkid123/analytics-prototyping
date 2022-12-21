import { Paper } from "@mui/material";

const AlertsBar = ({ alerts }: { alerts: string[] }) => {
  if (alerts.length === 0) {
    return null;
  }

  return <Paper sx={{ p: 2 }}>There will be dragons</Paper>;
};

export default AlertsBar;
