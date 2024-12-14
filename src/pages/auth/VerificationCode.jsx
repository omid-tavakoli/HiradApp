import AuthLayout from "../../ui/layout/AuthLayout";
import useApi from "../../hooks/useApi";
import { useNavigate, useLocation } from "react-router-dom";
import { digitsEnToFa } from "@persian-tools/persian-tools";
import OTPInput, { ResendOTP } from "otp-input-react";
import { useEffect, useState } from "react";
import { PencilIcon, ChevronLeftIcon } from "@heroicons/react/24/outline";
import BeatLoaderLoading from "../../ui/element/loading/BeatLoader";

const VerificationCode = ({ mobile, onEnterCode, onBack }) => {
  const [OTP, setOTP] = useState("");

  const navigate = useNavigate();
  const mobileNumber = mobile || useLocation().state;

  const request = useApi();
  useEffect(() => {
    if (OTP.length == 4) onSubmit();
  }, [OTP]);
  const onSubmit = () => {
    if (onEnterCode) {
      onEnterCode(OTP);
    }
    else (async () => {
      const dataSent = {
        mobile: mobileNumber,
        code: OTP,
      };
      try {
        const { data } = await request.apiCall(
          "post",
          "User/CheckVerificationCodeSms",
          dataSent
        );
        navigate("/auth/register", {
          state: dataSent,
        });
      } catch (error) {
        console.log(error);
      }
    })();
  }

  const renderButton = (buttonProps) => {
    return (
      <button {...buttonProps} className="text-xs text-gray-600">
        ارسال مجدد کد تایید
      </button>
    );
  };
  const renderTime = (remaining) => {
    return remaining !== 0 ? (
      <span className="text-xs text-gray-600 mr-1">
        تا {digitsEnToFa(remaining)} ثانیه دیگر
      </span>
    ) : (
      <></>
    );
  };

  return (
    <AuthLayout title={"تایید کد"}>
      <div className="flex flex-row items-center text-xs mb-4">
        <p>{`کد تائید برای شماره موبایل ${digitsEnToFa(
          mobileNumber
        )} ارسال گردید`}</p>
        <button onClick={() => navigate("/")}>
          <PencilIcon
            className="mr-1 h-4 w- text-gray-600"
            aria-hidden="true"
          />
        </button>
      </div>

      <div className="flex flex-col space-y-4">
        <div dir="ltr">
          <OTPInput
            value={OTP}
            onChange={setOTP}
            autoFocus
            OTPLength={4}
            otpType="number"
            disabled={false}
            className="justify-center"
            inputClassName="border !border-gray-300 rounded-lg text-secondary-800 font-bold text-center focus:outline-none focus:border-sky-500 focus:shadow transition"
            inputStyles={{
              width: "3rem",
              height: "3rem",
              marginRight: ".5rem",
              flexDirection: "row-reverse",
            }}
          />
        </div>
        <ResendOTP
          onResendClick={() => console.log("Resend clicked")}
          className="mt-4 flex flex-row space-x-2 space-x-reverse"
          style={{ justifyContent: " flex-start" }}
          renderButton={renderButton}
          renderTime={renderTime}
          maxTime="100"
          dir="ltr"
        />

        {!request.loading ? (
          <button
            type="submit"
            onClick={onSubmit}
            className="!mt-6 bg-primary-900 text-white py-3 px-4 rounded-xl font-bold hover:bg-primary-800"
            disabled={request.loading}
          >
            تایید
          </button>
        ) : (
          <div className="w-full flex justify-center">
            <BeatLoaderLoading size={20} />
          </div>
        )}
      </div>
      <div className="w-full flex justify-end mt-4">
        <button
          onClick={() => (onBack ? onBack() : navigate(-1))}
          className="text-xs font-medium flex flex-row items-center text-primary-800"
        >
          <span>بازگشت</span>
          <ChevronLeftIcon className="w-3 h-3 mr-1" />
        </button>
      </div>
    </AuthLayout>
  );
};

export default VerificationCode;
