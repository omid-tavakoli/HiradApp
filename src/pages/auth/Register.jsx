import AuthLayout from "../../ui/layout/AuthLayout";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import useApi from "../../hooks/useApi";
import { useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import BeatLoaderLoading from "../../ui/element/loading/BeatLoader";
import PasswordInput from "../../ui/element/input/PasswordInput";
import SelectboxForm from "../../ui/element/SelectboxForm";
import { useState, useEffect } from "react";
import * as yup from "yup";
import { PencilIcon } from "@heroicons/react/24/outline";
import PasswordChecker from "../../ui/element/PasswordChecker";
import { Checkbox } from "@mui/material";
import useAuth from "../../hooks/useAuth";

const schema = yup.object().shape({
  name: yup
    .string()
    .required("لطفا نام را وارد کنید")
    .min(2, "خیلی کوتاه است!")
    .max(50, "خیلی طولانی است!"),
  family: yup
    .string()
    .required("لطفا نام خانوادگی را وارد کنید")
    .min(2, "خیلی کوتاه است!")
    .max(50, "خیلی طولانی است!"),
  subSysTitle: yup
    .string("فقط میتوانید عدد وارد کنید")
    .required("لطفا نام را وارد کنید"),
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
  subSysCode: yup
    .string()
    .required("لطفا کد را وارد کنید")
    .matches(/^\d{11}$|^\d{15}$/, "عدد باید یازده یا پانزده رقمی باشد"),
  acceptRule: yup
    .boolean()
    .required("موافقت با قوانین و مقررات سایت الزامیست")
    .oneOf([true], "موافقت با قوانین و مقررات سایت الزامیست"),
});

const Register = () => {
  const [selectedList, setSelectedList] = useState(null);
  const [subTypeList, setSubTypeList] = useState([]);
  const { state: verifiMobileInfo } = useLocation();
  const navigate = useNavigate();

  const { userLogin } = useAuth();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const request = useApi();
  useEffect(() => {
    toast("وارد صفحه ثبت نام شده اید");
    getSubTypes();
  }, []);

  const password = watch("password");

  const getSubTypes = async () => {
    try {
      const { data } = await request.apiCall("get", `SubType/GetList`);
      const options = data.map((item) => ({
        label: item?.title,
        value: item?.id,
      }));
      setSubTypeList(options);
    } catch (error) {
      console.log(error);
    }
  };

  const onSubmit = async (formData) => {
    if (!formData.type) {
      try {
        const dataSent = {
          user: {
            userName: formData.name,
            userFamily: formData.family,
            mobile: verifiMobileInfo.mobile,
            password: formData.password,
            verificationCode: verifiMobileInfo.code,
          },
          subSys: {
            title: formData.subSysTitle,
            SystemCode: formData.subSysCode,
            subTypeIds: [selectedList.value],
          },
        };

        const { data } = await request.apiCall(
          "post",
          "User/CreateSubSysUser",
          dataSent
        );
        toast.success(
          `ثبت نام برای سیستم ${formData.subSysTitle} با موفقیت انجام شد`
        );
        userLogin(data);
        toast.error("پروفایل را تکمیل کنید");
      } catch (error) {
        error?.response?.data?.data["user.password"][0] &&
          toast.error(error?.response?.data?.data["user.password"][0]);
      }
    }
  };
  return (
    <AuthLayout title={" ثبت نام"}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col space-y-2"
      >
        <div className="space-y-2">
          <div className="flex flex-row items-center mb-4">
            <label htmlFor="mobile" className="text-xs text-gray-600">
              موبایل
            </label>
            <button onClick={() => navigate("/")}>
              <PencilIcon
                className="mr-1 h-4 w- text-gray-600"
                aria-hidden="true"
              />
            </button>
          </div>
          <input
            type="text"
            defaultValue={verifiMobileInfo.mobile}
            disabled={true}
            className="form-input block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-400 sm:text-sm sm:leading-6"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="name" className="text-xs text-gray-600 mb-4">
            نام
          </label>
          <input
            type="text"
            {...register("name")}
            className="form-input block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-400 sm:text-sm sm:leading-6"
          />
          {errors.name && (
            <p className="text-primary-600 text-xs">{errors.name.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="family" className="text-xs text-gray-600 mb-4">
            نام خانوادگی
          </label>
          <input
            type="text"
            {...register("family")}
            className="form-input block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-400 sm:text-sm sm:leading-6"
          />
          {errors.family && (
            <p className="text-primary-600 text-xs">{errors.family.message}</p>
          )}
        </div>

        <PasswordInput
          name={"password"}
          label={"رمز عبور"}
          register={register}
          error={errors["password"] && errors["password"].message}
        />
        {password && <PasswordChecker password={password} />}
        <PasswordInput
          name={"confirmPassword"}
          label={"تایید رمز عبور"}
          register={register}
          error={errors["confirmPassword"] && errors["confirmPassword"].message}
        />

        <div className="space-y-2">
          <label htmlFor="subSysTitle" className="text-xs text-gray-600 mb-4">
            نام سازمان شما
          </label>
          <input
            type="text"
            {...register("subSysTitle")}
            className="form-input block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-400 sm:text-sm sm:leading-6"
          />
          {errors.subSysTitle && (
            <p className="text-primary-600 text-xs">{errors.subSysTitle.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <label htmlFor="subSysCode" className="text-xs text-gray-600 mb-4">
            شناسه ملی سازمان شما
          </label>
          <input
            type="text"
            {...register("subSysCode")}
            className="form-input block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-400 sm:text-sm sm:leading-6"
          />
          {errors.subSysCode && (
            <p className="text-primary-600 text-xs">{errors.subSysCode.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <label htmlFor="subSysTitle" className="text-xs text-gray-600 mb-4">
            زمینه کار نظارت سازمان شما کدام یک از موارد زیر است
          </label>
          <SelectboxForm
            field={{
              value: selectedList,
              onChange: (value) => setSelectedList(value),
            }}
            options={subTypeList}
            placeholder="زمینه‌های کار نظارتی خود را انتخاب کنید"
            isMulti={false}
            disabled={false}
          />
        </div>

        <div className="flex flex-col space-y-2">
          <div>
            <Checkbox {...register("acceptRule")} size="small" />
            <label className="text-xs text-gray-600" htmlFor="acceptRule">
              <a
                href="/rules.pdf"
                className="font-medium text-primary-600 hover:underline"
                download
              >
                قوانین و مقررات
              </a>{" "}
              سایت را پذیرفته ام.
            </label>
          </div>
          {errors.acceptRule && (
            <p className="text-primary-600 text-xs">{errors.acceptRule.message}</p>
          )}
        </div>

        {!request.loading ? (
          <button
            type="submit"
            onClick={onSubmit}
            className="!mt-6 bg-primary-900 text-white py-3 px-4 rounded-xl font-bold hover:bg-primary-800"
            disabled={request.loading}
          >
            ثبت نام
          </button>
        ) : (
          <div className="w-full flex justify-center">
            <BeatLoaderLoading size={20} />
          </div>
        )}
      </form>
    </AuthLayout>
  );
};

export default Register;
