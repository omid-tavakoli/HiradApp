import PasswordInput from "../../element/input/PasswordInput";
import useApi from "../../../hooks/useApi";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import toast from "react-hot-toast";
import BeatLoaderLoading from "../../element/loading/BeatLoader";
import { useState } from "react";
import * as yup from "yup";
import VerificationCode from "../../../pages/auth/VerificationCode";

const schema = yup.object().shape({
  oldPassword: yup
  .string()
  .required("لطفا رمز عبور را وارد کنید")
  .min(8, "رمز عبور باید 8 کاراکتر باشد")
  .matches(/[0-9]/, "رمز عبور نیاز به یک عدد دارد")
  .matches(/[a-z]/, "رمز عبور به یک حرف کوچک نیاز دارد")
  .matches(/[A-Z]/, "رمز عبور به یک حرف بزرگ نیاز دارد")
  .matches(/[^\w]/, "رمز عبور نیاز به یک نماد دارد"),
  password: yup
    .string()
    .required("لطفا رمز عبور را وارد کنید")
    .min(8, "رمز عبور باید 8 کاراکتر باشد")
    .matches(/[0-9]/, "رمز عبور نیاز به یک عدد دارد")
    .matches(/[a-z]/, "رمز عبور به یک حرف کوچک نیاز دارد")
    .matches(/[A-Z]/, "رمز عبور به یک حرف بزرگ نیاز دارد")
    .matches(/[^\w]/, "رمز عبور نیاز به یک نماد دارد"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "تایید رمز عبور مطابقت ندارد"),
});
const ChangePassword = ({ userData }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const request = useApi();

  const onSubmit = async (data) => {
    if (!data.type) {
      try {
        const response = await request.apiCall("post", `User/ChangePassword`, {
          id: userData?.id,
          oldPassword: data?.oldPassword,
          password: data?.password,
        });
        if (response?.isSuccess) {
          toast.success("رمز عبور با موفقیت تغییر کرد");
        }
      } catch (error) {
        error?.response?.data?.data?.password[0] && toast.error( error?.response?.data?.data?.password[0]);
        error?.response?.data?.data?.password[1] && toast.error( error?.response?.data?.data?.password[1]);
      }
    }
  };

  return (
    <div>
      <div className="text-xl font-black text-gray-600 mb-4">
        تغییر رمز عبور
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="sm:grid sm:grid-cols-2 gap-4"
      >
        <PasswordInput
          name={"oldPassword"}
          label={"رمز عبور فعلی"}
          placeholder={"لطفا رمز عبور فعلی خود را وارد کنید"}
          register={register}
          error={errors["oldPassword"] && errors["oldPassword"].message}
        />
        <PasswordInput
          name={"password"}
          label={"رمز عبور جدید"}
          placeholder={"لطفا رمز عبور جدید خود را وارد کنید"}
          register={register}
          error={errors["password"] && errors["password"].message}
        />
        <PasswordInput
          name={"confirmPassword"}
          label={"تایید رمز عبور جدید"}
          placeholder={"لطفا تایید رمز عبور جدید خود را وارد کنید"}
          register={register}
          error={errors["confirmPassword"] && errors["confirmPassword"].message}
        />
      </form>
      <div className="flex justify-end w-full">
      {!request.loading ? (
        <button
          type="submit"
          onClick={handleSubmit(onSubmit)}
          className="btn-primary mt-6"
          disabled={request.loading}
        >
          ثبت تغییرات
        </button>
      ) : (
        <div className="w-full flex justify-center">
          <BeatLoaderLoading size={20} />
        </div>
      )}
      </div>
    </div>
  );
};

export default ChangePassword;
