import AuthLayout from "../../ui/layout/AuthLayout";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import loginSchema from "../../utils/models/validation/auth/login";
import PasswordInput from "../../ui/element/input/PasswordInput";
import useApi from "../../hooks/useApi";
import { useNavigate, useLocation, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { digitsEnToFa } from "@persian-tools/persian-tools";
import BeatLoaderLoading from "../../ui/element/loading/BeatLoader";
import useAuth from "../../hooks/useAuth";
import { useEffect } from "react";
import { ChevronLeftIcon } from "@heroicons/react/24/outline";

const Login = () => {
  const navigate = useNavigate();
  const { state: dataTransfer } = useLocation();
  const {
    register,
    handleSubmit,
    setFocus,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(loginSchema),
  });

  const { error, apiCall, loading } = useApi();
  const { userLogin } = useAuth();

  useEffect(() => {
    setFocus("password");
  }, [setFocus]);

  const onSubmit = async (formData) => {
    if (!formData.type) {
      const dataReq = {
        mobile: dataTransfer?.mobile,
        password: formData?.password,
      };
      try {
        const { data } = await apiCall("POST", "user/login", dataReq);
        userLogin(data);
      } catch (error) {}
    }
  };

  const handleForgetPassword = async () => {
    try {
      await apiCall("POST", "User/SendVerificationCodeSms", {
        mobile: dataTransfer?.mobile,
      });

      navigate("/auth/forget-password", { state: dataTransfer });
      toast.success(
        `کد تایید برای شماره موبایل ${digitsEnToFa(
          dataTransfer?.mobile
        )} ارسال گردید`
      );
    } catch (error) {
      error?.response?.data?.data["password"][0] &&
        toast.error(error?.response?.data?.data["password"][0]);
    }
  };

  return (
    <AuthLayout>
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
      <div className="flex flex-row justify-between items-center mt-4 ">
        <button
          className="text-xs font-medium text-primary-800"
          onClick={handleForgetPassword}
        >
          فراموشی رمز عبور
        </button>
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

export default Login;
