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
import AddKindStep from "../../../ui/components/kinds/KindCreateStepper/steps/AddKindStep";
import AddKindDetailsStep from "../../../ui/components/kinds/KindCreateStepper/steps/AddKindDetailsStep";
import AddSupervisorsStep from "../../../ui/components/kinds/KindCreateStepper/steps/AddSupervisorsStep";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../../contexts/UserContext";

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


export default function KindCreate() {
  const [activeStep, setActiveStep] = React.useState(0);
  const [skipped, setSkipped] = React.useState(new Set());
  const [kindId, setKindId] = React.useState();
  const navigate = useNavigate();
  const {user} = useUser()
  const steps = [`تعریف ${user?.role?.listSystemSet?.filter(item => item.number == 11 )[0]?.fieldValue ? user?.role?.listSystemSet?.filter(item => item.number == 11 )[0]?.fieldValue : 'زیرمجموعه'}`, "تعریف سربرگ", `تخصیص ${user?.role?.listSystemSet?.filter(item => item.number == 5 )[0]?.fieldValue ? user?.role?.listSystemSet?.filter(item => item.number == 5 )[0]?.fieldValue : 'ناظر'}`];

  useEffect(() => {
    activeStep === steps.length && navigate("/dashboard/kinds");
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
    <AddKindStep
      onNext={() => handleNext()}
      onBack={() => handleBack()}
      onSkip={() => handleSkip()}
      activeStep={activeStep}
      kindId={kindId}
      setKindId={setKindId}
    />,
    <AddKindDetailsStep
      kindId={kindId}
      onNext={() => handleNext()}
      onBack={() => handleBack()}
      onSkip={() => handleSkip()}
      isStepOptional={(step) => isStepOptional(step)}
    />,
    <AddSupervisorsStep
      kindId={kindId}
      onNext={() => handleNext()}
      onBack={() => handleBack()}
    />,
  ];

  return (
    <CacheProvider value={cacheRtl}>
      <ThemeProvider theme={theme}>
        <div className="flex flex-col w-full">
          <div className="flex items-center mb-4">
            <div className="text-2xl font-black text-gray-600">
              تعریف {user?.role?.listSystemSet?.filter(item => item.number == 11 )[0]?.fieldValue ? user?.role?.listSystemSet?.filter(item => item.number == 11 )[0]?.fieldValue : 'زیرمجموعه'}
            </div>
            <div className="w-5"></div>
            <button
              type="button"
              className="btn-primary w-fit !mb-0"
              onClick={() => navigate("/dashboard/kinds")}
            >
              لیست {user?.role?.listSystemSet?.filter(item => item.number == 11 )[0]?.fieldValue ? user?.role?.listSystemSet?.filter(item => item.number == 11 )[0]?.fieldValue : 'زیرمجموعه'} ها
            </button>
          </div>
          <div className="flex justify-center mt-4">
            <div dir="rtl" className="max-w-xl w-full">
              <Box sx={{ width: "100%" }}>
                <Stepper activeStep={activeStep}>
                  {steps?.map((label, index) => {
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
                {!(activeStep === steps.length) && (
                  <div className="bg-white p-4 sm:p-6 mt-8 rounded-xl shadow-sm">
                    {stepsComponents[activeStep]}
                  </div>
                )}
              </Box>
            </div>
          </div>
        </div>
      </ThemeProvider>
    </CacheProvider>
  );
}
