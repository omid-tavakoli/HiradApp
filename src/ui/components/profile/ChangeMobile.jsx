import NumberInput from "../../element/input/NumberInput";
import useApi from "../../../hooks/useApi";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import toast from "react-hot-toast";
import { digitsEnToFa } from "@persian-tools/persian-tools";
import BeatLoaderLoading from "../../element/loading/BeatLoader";
import { useState, useEffect } from "react";
import * as yup from "yup";
import VerificationCode from "../../../pages/auth/VerificationCode";

const schema = yup.object().shape({
  newMobile: yup
    .string()
    .required("لطفا شماره موبایل را وارد کنید")
    .matches(/^(\+98|0)?9\d{9}$/i, "شماره موبایل معتبر نیست"),
});

const ChangeMobile = ({ userData }) => {
  const [showVerifyCode, setShowVerifyCode] = useState(false);
  const [newMobile, setNewMobile] = useState(null);

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
        const response = await request.apiCall(
          "post",
          `User/SendVerificationCodeSms`,
          {
            mobile: data?.newMobile,
          }
        );
        if (response?.isSuccess) {
          toast.success("کد تایید با موقیت ارسال شد");
          setNewMobile(data?.newMobile);
          setShowVerifyCode(true);
        }
      } catch (error) {
        console.log("ERR", error);
      }
    }
  };

  const handleChangeMobile = async (code) => {
    try {
      const response = await request.apiCall("post", `/User/ChangeMobile`, {
        newMobile: newMobile,
        id: userData?.id,
        code: code,
      });
      if (response?.isSuccess) {
        toast.success("شماره موبایل با موقیت ویرایش شد");
        setNewMobile(null);
        setShowVerifyCode(false);
      }
    } catch (error) {
      console.log("ERR", error);
    }
  };

  return (
    <div>
      <div className="text-xl font-black text-gray-600 mb-4">
        تغییر شماره موبایل
      </div>
      {!showVerifyCode ? (
        <>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="sm:grid sm:grid-cols-2 gap-4"
          >
            <NumberInput
              name={"mobile"}
              label="شماره موبایل فعلی"
              placeholder={"لطفا شماره موبایل خود را وارد کنید"}
              register={register}
              error={null}
              defaultValue={userData?.mobile}
              disable={true}
            />
            <NumberInput
              name={"newMobile"}
              label="شماره موبایل جدید"
              placeholder={"لطفا شماره موبایل جدید خود را وارد کنید"}
              register={register}
              error={errors.newMobile && errors.newMobile.message}
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
                ثبت
              </button>
            ) : (
              <div className="w-full flex justify-center">
                <BeatLoaderLoading size={20} />
              </div>
            )}
          </div>
        </>
      ) : (
        <VerificationCode
          mobile={newMobile}
          onEnterCode={handleChangeMobile}
          onBack={() => setShowVerifyCode(false)}
        />
      )}
    </div>
  );
};

export default ChangeMobile;
