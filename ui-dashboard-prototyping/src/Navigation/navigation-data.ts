import DashboardIcon from "@mui/icons-material/Dashboard";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import BuildIcon from "@mui/icons-material/Build";

const navigationData = [
  {
    href: "/dashboard-prototype",
    primary: "Admin UI dashboard proptotypes",
    secondary: "Create event data visualization",
    Icon: DashboardIcon,
  },
  {
    href: "/click-collection",
    primary: "Page with custom events setup",
    secondary: "event collection",
    Icon: CloudUploadIcon,
  },
  {
    href: "/pendo-building",
    primary: "Pendo overlay building page",
    secondary: "create pendo components",
    Icon: BuildIcon,
  },
];

export default navigationData;
