import * as React from "react";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useCreateJourney } from "../ReactClient";
import { Dialog, DialogTitle, Modal } from "@mui/material";

const steps = [
  "Select campaign settings",
  "Create an ad group",
  "Create an ad",
];

// https://mui.com/material-ui/react-stepper/#linear
function HorizontalLinearStepper() {
  const [activeStep, setActiveStep] = React.useState(0);
  const { finish, cancel, event, start } = useCreateJourney("journey-events");
  const [started, setStarted] = React.useState(false);

  const isStepOptional = (step: number) => {
    return step === 1;
  };

  const handleNext = () => {
    setActiveStep((prevActiveStep) => {
      const newStep = prevActiveStep + 1;
      if (newStep === steps.length) {
        finish();
      } else {
        event(steps[newStep], { action: "going-next" });
      }
      return newStep;
    });
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => {
      const newStep = prevActiveStep - 1;
      event(steps[newStep], { action: "going-back" });
      return newStep;
    });
  };

  const handleCancel = () => {
    setStarted(false);
    cancel();
  };

  const handleReset = () => {
    event(steps[0], { action: "reset" });
    setActiveStep(0);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Dialog
        fullWidth
        maxWidth="xl"
        onClose={() => {
          setStarted(false);
          cancel();
        }}
        open={started}
      >
        <Box sx={{ p: 2 }}>
          <DialogTitle>Journey event</DialogTitle>
          <Stepper activeStep={activeStep}>
            {steps.map((label, index) => {
              const stepProps: { completed?: boolean } = {};
              const labelProps: {
                optional?: React.ReactNode;
              } = {};
              if (isStepOptional(index)) {
                labelProps.optional = (
                  <Typography variant="caption">Optional</Typography>
                );
              }
              return (
                <Step key={label} {...stepProps}>
                  <StepLabel {...labelProps}>{label}</StepLabel>
                </Step>
              );
            })}
          </Stepper>
          {activeStep === steps.length ? (
            <React.Fragment>
              <Typography sx={{ mt: 2, mb: 1 }}>
                All steps completed - you&apos;re finished
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
                <Box sx={{ flex: "1 1 auto" }} />
                <Button onClick={handleReset}>Reset</Button>
              </Box>
            </React.Fragment>
          ) : (
            <React.Fragment>
              <Typography sx={{ mt: 2, mb: 1 }}>
                Step {activeStep + 1}
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
                <Button
                  color="inherit"
                  disabled={activeStep === 0}
                  onClick={handleBack}
                  sx={{ mr: 1 }}
                >
                  Back
                </Button>
                <Box sx={{ flex: "1 1 auto" }} />
                <Button color="inherit" onClick={handleCancel} sx={{ mr: 1 }}>
                  Cancel
                </Button>
                <Button onClick={handleNext}>
                  {activeStep === steps.length - 1 ? "Finish" : "Next"}
                </Button>
              </Box>
            </React.Fragment>
          )}
        </Box>
      </Dialog>
      <div style={{ margin: "auto" }}>
        <Button
          onClick={() => {
            start();
            setStarted(true);
          }}
          variant="outlined"
          color="secondary"
        >
          Click button to start
        </Button>
      </div>
    </Box>
  );
}

export default HorizontalLinearStepper;
