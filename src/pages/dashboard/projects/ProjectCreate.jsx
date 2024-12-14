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
import AddProjectStep from "../../../ui/components/projects/create-stepper/steps/AddProjectStep";
import AddKindDetailsStep from "../../../ui/components/projects/create-stepper/steps/AddKindDetailsStep";
import FillKindDetailsStep from "../../../ui/components/projects/create-stepper/steps/FillKindDetailsStep";
import AddContractorsStep from "../../../ui/components/projects/create-stepper/steps/AddContractorsStep";
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

const ProjectCreate = () => {
  const [activeStep, setActiveStep] = React.useState(0);
  const [skipped, setSkipped] = React.useState(new Set());
  const [projectId, setProjectId] = React.useState();
  const [kindId, setKindId] = React.useState();
  const navigate = useNavigate();
  const { user } = useUser();
  const steps = [
    `تعریف ${
      user?.role?.listSystemSet?.filter((item) => item.number == 2)[0]
        ?.fieldValue
        ? user?.role?.listSystemSet?.filter((item) => item.number == 2)[0]
            ?.fieldValue
        : "پروژه"
    }`,
    "تخصیص سربرگ",
    "پر کردن سربرگ",
    `تخصیص ${
      user?.role?.listSystemSet?.filter((item) => item.number == 5)[0]
        ?.fieldValue2
        ? user?.role?.listSystemSet?.filter((item) => item.number == 5)[0]
            ?.fieldValue2
        : "پیمانکار"
    }`,
  ];
  useEffect(() => {
    activeStep === steps.length && navigate("/dashboard/projects");
  }, [activeStep]);

  const isStepOptional = (step) => {
    return step === 2;
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
    <AddProjectStep
      onNext={() => handleNext()}
      onBack={() => handleBack()}
      onSkip={() => handleSkip()}
      activeStep={activeStep}
      setProjectId={setProjectId}
      setKindId={setKindId}
      projectId={projectId}
    />,

    <AddKindDetailsStep
      projectId={projectId}
      onNext={() => handleNext()}
      onBack={() => handleBack()}
      onSkip={() => handleSkip()}
      isStepOptional={isStepOptional}
      kindId={kindId}
    />,

    <FillKindDetailsStep
      projectId={projectId}
      onNext={() => handleNext()}
      onBack={() => handleBack()}
      onSkip={() => handleSkip()}
      isStepOptional={isStepOptional}
      kindId={kindId}
    />,

    <AddContractorsStep
      projectId={projectId}
      onNext={() => handleNext()}
      onBack={() => handleBack()}
    />,
  ];
  return (
    <CacheProvider value={cacheRtl}>
      <ThemeProvider theme={theme}>
        <div className="flex items-center mb-4">
          <div className="text-2xl font-black text-gray-600">
            تعریف{" "}
            {user?.role?.listSystemSet?.filter((item) => item.number == 2)[0]
              ?.fieldValue
              ? user?.role?.listSystemSet?.filter((item) => item.number == 2)[0]
                  ?.fieldValue
              : "پروژه"}
          </div>
          <div className="w-5 "></div>
          {activeStep == 2 ||
            (activeStep == 3 && (
              <button
                type="button"
                className="btn-primary w-fit !mb-0 "
                onClick={() => navigate("/dashboard/projects")}
              >
                لیست{" "}
                {user?.role?.listSystemSet?.filter(
                  (item) => item.number == 2
                )[0]?.fieldValue
                  ? user?.role?.listSystemSet?.filter(
                      (item) => item.number == 2
                    )[0]?.fieldValue
                  : "پروژه"}{" "}
                ها
              </button>
            ))}
        </div>
        <div className="flex justify-center w-full ">
          <div dir="rtl" className=" w-full ">
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
};

export default ProjectCreate;
