import { useEffect, useState } from "react";
import useApi from "../../../../hooks/useApi";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../../../contexts/UserContext";

const ExamShowInfo = ({ data: examData }) => {
  const request = useApi();
  const navigate = useNavigate();
  const {user} = useUser()
  const [locationPermisison, setLocationPermission] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    checkPermission();
  }, []);

  const checkPermission = () => {
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
              console.log(error);
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

  const handleStartExam = async () => {
    try {
      await request.apiCall("post", `Exam/StartExam`, {
        examId: examData?.id,
      });
      navigate(`/dashboard/exam/doing/${examData?.id}`);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex flex-col">
      <div className="flex flex-col space-y-2 text-sm my-4">
        <div className="flex flex-row items-center space-x-1 space-x-reverse">
          <div className="text-gray-500">{user?.role?.listSystemSet?.filter(item => item.number == 2 )[0]?.fieldValue ? user?.role?.listSystemSet?.filter(item => item.number == 2 )[0]?.fieldValue: 'پروژه'}: </div>
          <div>{examData?.projectTitle}</div>
        </div>
        {!locationPermisison && message && (
          <div className="text-center text-red-500 text-lg">{message}</div>
        )}
      </div>
      <div className="flex justify-center w-full -mb-6">
        {locationPermisison && (
          <button
            className="btn-primary w-fit"
            onClick={() => handleStartExam()}
          >
            شروع {user?.role?.listSystemSet?.filter(item => item.number == 4 )[0]?.fieldValue  ? user?.role?.listSystemSet?.filter(item => item.number == 4 )[0]?.fieldValue : 'ارزیابی'}
          </button>
        )}
      </div>
    </div>
  );
};

export default ExamShowInfo;
