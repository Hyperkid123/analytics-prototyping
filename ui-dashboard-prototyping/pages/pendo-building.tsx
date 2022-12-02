import { useLayoutEffect } from "react";
import { init } from "@analytics-prototyping/pendo-like-overlay-prototype";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Container,
  Grid,
  Typography,
} from "@mui/material";

const PendoBuilding = () => {
  useLayoutEffect(() => {
    const { render, unmount } = init();
    render();
    return () => {
      unmount();
    };
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
