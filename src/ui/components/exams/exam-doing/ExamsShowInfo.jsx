import { Fragment, useEffect, useState } from "react";
import useApi from "../../../../hooks/useApi";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../../../contexts/UserContext";

const ExamsShowInfo = ({ data: examsData, date }) => {
  const request = useApi();
  const navigate = useNavigate();
  const {user} = useUser()
  const [locationPermisison, setLocationPermission] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    checkLocationPermission();
  }, []);

  const checkLocationPermission = () => {
    if (!("geolocation" in navigator)) {
      setMessage(`امکان انجام ${user?.role?.listSystemSet?.filter(item => item.number == 4 )[0]?.fieldValue  ? user?.role?.listSystemSet?.filter(item => item.number == 4 )[0]?.fieldValue : 'ارزیابی'} در این مرورگر وجود ندارد.`);
      return;
    }
    navigator.permissions
      .query({
        name: "geolocation",
      })
      .then(({ state }) => {
        if (state === "granted") {
          setLocationPermission(true);
        } else {
          setMessage(
            state === "denied"
              ? "لطفا دسترسی به موقعیت مکانی را در مرورگر خود فعال کنید"
              : "لطفا درخواست موقعیت مکانی را تایید کنید"
          );
          navigator.geolocation.getCurrentPosition(
            () => {
              setLocationPermission(true);
            },
            (error) => {
              setMessage(
                error.code === error.PERMISSION_DENIED
                  ? "لطفا دسترسی به موقعیت مکانی را در مرورگر خود فعال کنید"
                  : "خطایی رخ داده است. لطفا با مرورگر دیگری امتحان کنید."
              );
            },
            { enableHighAccuracy: true }
          );
        }
      });
  };

  const handleStartExam = async (exam) => {
    try {
      await request.apiCall("post", `Exam/StartExam`, {
        examId: exam.examId,
      });

      navigate(`/dashboard/exam/doing/${exam.examId}`);
    } catch (error) {
      console.log(error);
    }
  };

  const handleAddExam = () => {
    navigate("/dashboard/exams-management/create", {
      state: {
        date,
      },
    });
  };

  const { checkPermission } = useUser();

  const hasAddExamPermission = checkPermission("Exam-Create");

  return (
    <div className="flex flex-col">
      {!locationPermisison && message && (
        <div className="text-center text-red-500 text-lg">{message}</div>
      )}

      {examsData.map((exam, index) => (
        <Fragment key={index}>
          <div className="flex justify-between items-center h-20">
            <div className="text-sm">
              <div className="flex flex-row items-center space-x-1 space-x-reverse">
                <div className="text-gray-500">{user?.role?.listSystemSet?.filter(item => item.number == 2 )[0]?.fieldValue ? user?.role?.listSystemSet?.filter(item => item.number == 2 )[0]?.fieldValue: 'پروژه'}: </div>
                <div>{exam.projectTitle}</div>
              </div>
            </div>
            <div>
              {locationPermisison && (
                <button
                  className="btn-primary mt-2"
                  onClick={() => handleStartExam(exam)}
                >
                  شروع {user?.role?.listSystemSet?.filter(item => item.number == 4 )[0]?.fieldValue  ? user?.role?.listSystemSet?.filter(item => item.number == 4 )[0]?.fieldValue : 'ارزیابی'}
                </button>
              )}
            </div>
          </div>
          <hr />
        </Fragment>
      ))}

      {!examsData.length && (
        <div className="flex justify-center h-10">
          <div className="text-red-700">{user?.role?.listSystemSet?.filter(item => item.number == 4 )[0]?.fieldValue  ? user?.role?.listSystemSet?.filter(item => item.number == 4 )[0]?.fieldValue : 'ارزیابی'} برای این تاریخ وجود ندارد.</div>
        </div>
      )}

      {hasAddExamPermission && (
        <div className="flex justify-center h-10">
          <div>
            <button
              className="btn-primary mt-2"
              onClick={() => handleAddExam()}
            >
              ایجاد {user?.role?.listSystemSet?.filter(item => item.number == 4 )[0]?.fieldValue  ? user?.role?.listSystemSet?.filter(item => item.number == 4 )[0]?.fieldValue : 'ارزیابی'} جدید
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExamsShowInfo;
