import AuthLayout from "../../ui/layout/AuthLayout";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import forgetPasswordSchema from "../../utils/models/validation/forgetPassword";
import PasswordInput from "../../ui/element/input/PasswordInput";
import useApi from "../../hooks/useApi";
import { useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import { digitsEnToFa } from "@persian-tools/persian-tools";
import BeatLoaderLoading from "../../ui/element/loading/BeatLoader";
import OTPInput, { ResendOTP } from "otp-input-react";
import { useState, useEffect } from "react";
import { PencilIcon, ChevronLeftIcon } from "@heroicons/react/24/outline";
import PasswordChecker from "../../ui/element/PasswordChecker";

const ForgetPassword = () => {
  const [OTP, setOTP] = useState("");

  const navigate = useNavigate();
  const { state: dataTransfer } = useLocation();
  const {
    register,
    handleSubmit,
    formState: { errors },
    trigger,
    watch,
  } = useForm({
    resolver: yupResolver(forgetPasswordSchema),
  });

  const password = watch("password");

  const { error, apiCall, loading } = useApi();

  useEffect(() => {
    if (OTP.length == 4)
      trigger().then((valid) => {
        if (valid) handleSubmit(onSubmit);
      });
  }, [OTP]);

  const onSubmit = async (formData) => {
    if (!formData.type) {
      const reqData = {
        id: dataTransfer?.userId,
        password: formData?.password,
        smsCode: OTP,
      };

      try {
        await apiCall("POST", "User/ForgetPassword", reqData);
        navigate("/");
        toast.success("رمز عبور با موفقیت تغیبر کرد");
      } catch (error) {
        error?.response?.data?.data['password'][0] &&
        toast.error(error?.response?.data?.data['password'][0]);
      }
    }
  };

  const renderButton = (buttonProps) => {
    return (
      <button {...buttonProps} className="text-xs text-gray-600">
        ارسال مجدد کد تایید
      </button>
    );
  };
  const renderTime = (remainingTime) => {
    return (
      remainingTime !== 0 && (
        <span className="text-xs text-gray-600 mr-1">
          تا {digitsEnToFa(remainingTime)} ثانیه دیگر
        </span>
      )
    );
  };

  return (
    <AuthLayout title={"فراموشی رمز عبور"}>
      <div className="flex flex-row items-center text-xs mb-4">
        {dataTransfer?.mobile && (
          <p>{`کد تائید برای شماره موبایل ${digitsEnToFa(
            dataTransfer?.mobile
          )} ارسال گردید`}</p>
        )}
        <button onClick={() => navigate("/")}>
          <PencilIcon
            className="mr-1 h-4 w- text-gray-600"
            aria-hidden="true"
          />
        </button>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col space-y-4"
      >
        
        <PasswordInput
          name={"password"}
          label={"رمز عبور"}
          placeholder={"لطفا رمز عبور خود را وارد کنید"}
          register={register}
          error={errors["password"] && errors["password"].message}
        />
        {password && <PasswordChecker password={password} />}
        <PasswordInput
          name={"confirmPassword"}
          label={"تایید رمز عبور"}
          placeholder={"لطفا تایید رمز عبور خود را وارد کنید"}
          register={register}
          error={errors["confirmPassword"] && errors["confirmPassword"].message}
        />

        <div dir="ltr">
          <OTPInput
            value={OTP}
            onChange={setOTP}
            autoFocus
            OTPLength={4}
            otpType="number"
            disabled={false}
            className="justify-center"
            inputClassName="border rounded-lg text-secondary-800 font-bold text-center focus:outline-none focus:border-sky-500 focus:shadow transition"
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
          style={{ "justify-content": " flex-start" }}
          renderButton={renderButton}
          renderTime={renderTime}
          maxTime="100"
          dir="ltr"
        />

        {!loading ? (
          <button
            type="submit"
            onClick={onSubmit}
            className="!mt-6 bg-primary-900 text-white py-3 px-4 rounded-xl font-bold hover:bg-primary-800"
            disabled={loading}
          >
            ورود
          </button>
        ) : (
          <div className="w-full flex justify-center">
            <BeatLoaderLoading size={20} />
          </div>
        )}
      </form>
      <div className="w-full flex justify-end mt-4">
        <button
          onClick={() => navigate(-1)}
          className="text-xs font-medium flex flex-row items-center text-primary-800"
        >
          <span>بازگشت</span>
          <ChevronLeftIcon className="w-3 h-3 mr-1" />
        </button>
      </div>
    </AuthLayout>
  );
};

export default ForgetPassword;
