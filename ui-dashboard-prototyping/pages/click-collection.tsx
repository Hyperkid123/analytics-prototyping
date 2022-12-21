import { Button, Grid } from "@mui/material";
import { Stack } from "@mui/system";
import { createRandomContext, EventContext } from "../mock/context";
import { createRandomUser, User } from "../mock/user";
import HorizontalLinearStepper from "../src/EventStepper";
import {
  useCustomEvent,
  useIdentify,
  useUpdateContext,
} from "../src/ReactClient";

const ClickCollection = () => {
  const event = useCustomEvent();
  const identify = useIdentify();
  const updateContext = useUpdateContext();
  return (
    <Grid container spacing={4}>
      <Grid item xs={4}>
        <Stack spacing={3}>
          <Button
            onClick={() => {
              event("foo", { foo: "bar" });
            }}
          >
            Click to collect foo event
          </Button>
          <Button
            onClick={() => {
              event("bar-event", { 1: 1 });
            }}
          >
            Click to collect bar event
          </Button>
        </Stack>
      </Grid>
      <Grid item xs={4}>
        <Button
          onClick={() => {
            identify(createRandomUser());
          }}
        >
          Click to identify new user
        </Button>
      </Grid>
      <Grid item xs={4}>
        <Button
          onClick={() => {
            updateContext(createRandomContext());
          }}
        >
          Click to update client context
        </Button>
      </Grid>
      <Grid item xs={12}>
        <HorizontalLinearStepper />
      </Grid>
    </Grid>
  );
};

export default ClickCollection;
