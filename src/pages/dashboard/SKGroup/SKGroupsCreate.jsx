import * as React from "react";
import { useEffect } from "react";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Typography from "@mui/material/Typography";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import AddSKGroupStep from "../../../ui/components/SKGroups/createStepper/steps/AddSKGroupStep";
import AddQuestionStep from "../../../ui/components/SKGroups/createStepper/steps/AddQuestionStep";
import { useNavigate } from "react-router-dom";

const theme = createTheme({
  direction: "rtl",
  palette: {
    primary: {
      main: "#b20206",
    },
  },
});

const cacheRtl = createCache({
  key: "muirtl",
});

const steps = ["تعریف دسته بندی سوالات", "تعریف سوالات"];

export default function SKGroupsCreate() {
  const [activeStep, setActiveStep] = React.useState(0);
  const [skipped, setSkipped] = React.useState(new Set());
  const [skgroupId, setSkgroupId] = React.useState();
  const navigate = useNavigate();

  useEffect(() => {
    activeStep === steps.length && navigate("/dashboard/sk-groups");
  }, [activeStep]);

  const isStepOptional = (step) => {
    return step === 1 || step === 2;
  };

  const isStepSkipped = (step) => {
    return skipped.has(step);
  };

  const handleNext = () => {
    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped(newSkipped);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleSkip = () => {
    if (!isStepOptional(activeStep)) {
      throw new Error("You can't skip a step that isn't optional.");
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped((prevSkipped) => {
      const newSkipped = new Set(prevSkipped.values());
      newSkipped.add(activeStep);
      return newSkipped;
    });
  };

  const stepsComponents = [
    <AddSKGroupStep
      onNext={() => handleNext()}
      onBack={() => handleBack()}
      onSkip={() => handleSkip()}
      activeStep={activeStep}
      setSkgroupId={setSkgroupId}
    />,
    <AddQuestionStep
      skgroupId={skgroupId}
      onNext={() => handleNext()}
      onBack={() => handleBack()}
      onSkip={() => handleSkip()}
      isStepOptional={(step) => isStepOptional(step)}
    />,
  ];

  return (
    <CacheProvider value={cacheRtl}>
      <ThemeProvider theme={theme}>
        <div className="flex items-center mb-4">
          <div className="text-2xl font-black text-gray-600">
            تعریف دسته بندی سوالات
          </div>
          <div className="w-5"></div>
          <button
            type="button"
            className="btn-primary w-fit !mb-0"
            onClick={() => navigate("/dashboard/sk-groups")}
          >
            لیست دسته بندی سوالات
          </button>
        </div>
        <div className="flex justify-center w-full">
          <div dir="rtl" className="max-w-xl w-full">
            <Box sx={{ width: "100%" }}>
              <Stepper activeStep={activeStep}>
                {steps.map((label, index) => {
                  const stepProps = {};
                  const labelProps = {};
                  if (isStepOptional(index)) {
                    labelProps.optional = (
                      <Typography variant="caption">اختیاری</Typography>
                    );
                  }
                  if (isStepSkipped(index)) {
                    stepProps.completed = false;
                  }
                  return (
                    <Step key={label} {...stepProps}>
                      <StepLabel
                        {...labelProps}
                        sx={{
                          "& .MuiStepLabel-iconContainer": {
                            paddingLeft: "8px",
                          },
                        }}
                      >
                        {label}
                      </StepLabel>
                    </Step>
                  );
                })}
              </Stepper>
              <>
                <div className="bg-white p-4 sm:p-6 mt-8 rounded-xl shadow-sm">
                  {stepsComponents[activeStep]}
                </div>
              </>
            </Box>
          </div>
        </div>
      </ThemeProvider>
    </CacheProvider>
  );
}
