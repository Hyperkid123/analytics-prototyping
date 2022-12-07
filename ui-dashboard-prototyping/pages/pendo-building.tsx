import { useEffect, useLayoutEffect, useRef } from "react";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Container,
  Grid,
  Typography,
} from "@mui/material";

// this script would be hosted on CDN and inject into DOM if a correct query param is in the URL after mount
const importGuideBuildingBundle = async () => {
  const SCRIPT_ID = "guide-building-entry";
  const prevScript = document.getElementById(SCRIPT_ID);
  if (prevScript) {
    return;
  }
  const base = "http://localhost:9009";
  const manifest = await fetch(`${base}/manifest.json`).then((r) => r.json());
  const jsEntry = manifest["index.html"].file;
  const cssFiles = manifest["index.html"].css || [];
  cssFiles.forEach((file: string) => {
    const linkElement = document.createElement("link");
    linkElement.href = `${base}/${file}`;
    linkElement.rel = "stylesheet";
    document.head.appendChild(linkElement);
  });
  const script = document.createElement("script");
  script.src = `${base}/${jsEntry}`;
  script.id = SCRIPT_ID;
  document.body.appendChild(script);
};

const PendoBuilding = () => {
  const isMounted = useRef(false);
  useEffect(() => {
    if (!isMounted.current) {
      importGuideBuildingBundle();
      isMounted.current = true;
    }
  }, []);
  return (
    <Container maxWidth="xl" style={{ paddingTop: 36 }}>
      <Grid container spacing={3}>
        <Card>
          <CardContent>
            <Typography variant="h4">Dummy element for pop up</Typography>
          </CardContent>
          <CardActions>
            <Button size="small">Learn More</Button>
          </CardActions>
        </Card>
      </Grid>
    </Container>
  );
};

export default PendoBuilding;
