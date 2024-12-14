import { useState, useEffect } from "react";
import { useTheme } from "@mui/material/styles";
import MobileStepper from "@mui/material/MobileStepper";
import Button from "@mui/material/Button";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Question from "../../../ui/components/exams/exam-doing/Question";
import toast from "react-hot-toast";
import useApi from "../../../hooks/useApi";
import { useNavigate, useParams } from "react-router-dom";
import { format } from "date-fns-jalali";
import { useUser } from "../../../contexts/UserContext";

const themeNavbar = createTheme({
  direction: "rtl",
  palette: {
    primary: {
      main: "#b20206",
    },
  },
});

const ExamDoing = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [exam, setExam] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [latitude, setLatitude] = useState();
  const [longitude, setLongitude] = useState();
  const [isErrors, setIsErrors] = useState(false);
  let { examId } = useParams();
  const { user } = useUser();
  const theme = useTheme();

  const navigate = useNavigate();

  const requestGetExam = useApi();
  const requestGetQuestions = useApi();
  const requestSubmit = useApi();

  const endOfQuestion = activeStep === questions.length - 1;

  useEffect(() => {
    checkLocationPermission();
  }, []);

  const checkLocationPermission = async () => {
    try {
      const { state } = await navigator.permissions.query({
        name: "geolocation",
      });

      if (state !== "granted") backToExams();

      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude);
          setLongitude(position.coords.longitude);
          // setLocation({
          // coords: {
          // accuracy: position.coords.accuracy,
          // altitude: position.coords.altitude,
          // altitudeAccuracy: position.coords.altitudeAccuracy,
          // heading: position.coords.heading,
          // latitude: position.coords.latitude,
          // longitude: position.coords.longitude,
          // speed: position.coords.speed,
          // },
          // timestamp: position.timestamp,
          // });
          startExam();
        },
        (err) => {
          console.log(err);
          backToExams();
        }
      );
    } catch (error) {
      console.log(error);
      backToExams();
    }
  };

  const startExam = () => {
    toast.success(
      `${
        user?.role?.listSystemSet?.filter((item) => item.number == 4)[0]
          ?.fieldValue
          ? user?.role?.listSystemSet?.filter((item) => item.number == 4)[0]
              ?.fieldValue
          : "ارزیابی"
      } شروع شد`
    );
    if (navigator.onLine) {
      getExamAndQuestionList();
    } else {
      getExamLocal();
    }
  };
  const backToExams = () => {
    toast.error("لطفا درخواست موقعیت را تایید کنید");
    navigate("/dashboard/exams");
  };

  const getExamLocal = () => {
    const savedData = localStorage.getItem(`Questions`);
    setQuestions(JSON.parse(savedData));
  };

  const getExamAndQuestionList = async () => {
    try {
      const [{ data: examData }, { data }] = await Promise.all([
        requestGetExam.apiCall("get", `Exam/Get/${examId}`),
        requestGetQuestions.apiCall(
          "get",
          `Question/GetExamQuestionList?examId=${examId}`
        ),
      ]);
      setExam(examData);
      setQuestions(data || []);
    } catch (error) {
      console.log(error);
    }
  };

  const handleAnswersChange = (ans) => {
    setAnswers((prevAns) => {
      return { ...prevAns, [ans.questionId]: ans };
    });
  };

  const forceOffline = false;

  const handleSubmit = async () => {
    const currentAnswer = answers[questions[activeStep]?.id];
    if (!currentAnswer) return;

    if (navigator.onLine && !forceOffline) {
      await submitAnswerOnline(currentAnswer);
    } else {
      saveAnswerOffline(currentAnswer);
    }
  };

  const submitAnswerOnline = async (currentAnswer) => {
    const fd = new FormData();
    fd.append("examId", examId);
    fd.append("Time", format(new Date(), "yyyy/MM/dd HH:mm:ss"));
    fd.append("longitude", longitude);
    fd.append("latitude", latitude);

    Object.entries(currentAnswer).forEach(([key, value]) => {
      if (value instanceof FileList) {
        [...value].forEach((file) => fd.append(key, file));
      } else {
        fd.append(key, value);
      }
    });

    try {
      await requestSubmit.apiCall("post", "Question/UserAnswerQuestion", fd);
      toast.success("پاسخ با موفقیت ارسال شد");
      handleNext();
    } catch (error) {
      console.log("خطا در ارسال پاسخ:", error);
    }
  };

  const saveAnswerOffline = (currentAnswer) => {
    toast.error("اتصال به اینترنت برقرار نیست. پاسخ به‌صورت موقت ذخیره شد");
    const updatedAnswers = {
      ...answers,
      [questions[activeStep]?.id]: currentAnswer,
    };
    localStorage.setItem(`Answers_${examId}`, JSON.stringify(updatedAnswers));
    handleNext();
  };

  const handleNext = () => {
    if (endOfQuestion) {
      navigate("/dashboard/exams");
    } else {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 h-[85dvh] flex flex-col">
      <div className="text-sm font-medium mb-4 border-b border-gray-200 pb-2 ">
        {exam?.title}
      </div>
      {questions && (
        <>
          <div className="grow text-xs">
            <Question
              key={activeStep}
              data={questions[activeStep]}
              onChangeAnswer={handleAnswersChange}
              setIsErrors={setIsErrors}
              questionCount={questions.length}
              questionCurrent={activeStep + 1}
              answers={answers}
            />
          </div>

          <ThemeProvider theme={themeNavbar}>
            <MobileStepper
              variant="progress"
              steps={questions.length}
              position="static"
              activeStep={activeStep}
              nextButton={
                <Button size="small" onClick={handleSubmit} disabled={isErrors}>
                  {endOfQuestion
                    ? `اتمام ${
                        user?.role?.listSystemSet?.filter(
                          (item) => item.number == 4
                        )[0]?.fieldValue
                          ? user?.role?.listSystemSet?.filter(
                              (item) => item.number == 4
                            )[0]?.fieldValue
                          : "ارزیابی"
                      }`
                    : "بعدی"}
                  {theme.direction === "rtl" ? (
                    <KeyboardArrowRight />
                  ) : (
                    <KeyboardArrowLeft />
                  )}
                </Button>
              }
              backButton={
                <Button
                  size="small"
                  onClick={handleBack}
                  disabled={isErrors || activeStep === 0}
                >
                  {theme.direction === "rtl" ? (
                    <KeyboardArrowLeft />
                  ) : (
                    <KeyboardArrowRight />
                  )}
                  قبلی
                </Button>
              }
            />
          </ThemeProvider>
        </>
      )}
    </div>
  );
};

export default ExamDoing;
