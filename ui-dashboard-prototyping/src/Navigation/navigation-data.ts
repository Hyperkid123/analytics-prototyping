import DashboardIcon from "@mui/icons-material/Dashboard";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import BuildIcon from "@mui/icons-material/Build";
import BiotechIcon from "@mui/icons-material/Biotech";

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
    href: "/create-guide",
    primary: "Create pendo guide",
    secondary: "create pendo guides",
    Icon: BuildIcon,
  },
  {
    href: "/pendo-building",
    primary: "Pendo overlay testing page",
    secondary: "test pendo guide components",
    Icon: BiotechIcon,
  },
];

export default navigationData;
