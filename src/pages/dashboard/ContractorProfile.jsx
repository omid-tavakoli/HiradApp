import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import useApi from "../../hooks/useApi";
import BeatLoaderLoading from "../../ui/element/loading/BeatLoader";
import * as yup from "yup";
import TextInput from "../../ui/forms/dynamic-form/fields/TextInput";
import TextArea from "../../ui/forms/dynamic-form/fields/TextArea";
import { useState, useEffect } from "react";
import { useUser } from "../../contexts/UserContext";
import { Checkbox } from "@mui/material";

const schema = yup.object().shape({
  companyName: yup
    .string()
    .required("لطفا نام شرکت را وارد کنید")
    .min(2, "خیلی کوتاه است!")
    .max(50, "خیلی طولانی است!"),
  companyCode: yup
    .string()
    .required("لطفا کد شرکت را وارد کنید")
    .matches(/\d/, "کد تلفن معتبر نیست"),
  telephone: yup
    .string()
    .required("لطفا شماره تلفن را وارد کنید")
    .matches(/^0\d{2}3\d{7}$/, "شماره تلفن معتبر نیست"),
  address: yup
    .string()
    .required("لطفا آدرس را وارد کنید")
    .min(2, "خیلی کوتاه است!")
    .max(50, "خیلی طولانی است!"),
  ceoName: yup.string(),
  ceoFamily: yup.string(),
  ceoNationalCode: yup
    .string()
    .required("لطفا کد ملی را وارد کنید")
    .matches(/^[0-9]{10}$/, "کد ملی معتبر نیست"),
  mobile: yup
    .string()
    .required("لطفا شماره تلفن را وارد کنید")
    .matches(/^(\+98|0)?9\d{9}$/i, "شماره تلفن معتبر نیست"),
  legal: yup.boolean(),
});

const ContractortemProfile = () => {
  const [contractorInfo, setContractorInfo] = useState();
  const requestGet = useApi();
  const request = useApi();
  const { user } = useUser();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    reset(contractorInfo);
  }, [contractorInfo, reset]);

  useEffect(() => {
    user && getContractor();
  }, [user]);

  const getContractor = async () => {
    try {
      const { data } = await requestGet.apiCall(
        "get",
        `Contractor/Get/${user?.userId}`
      );
      setContractorInfo(data);
    } catch (error) {
      console.log(error);
    }
  };

  const onSubmit = async (formData) => {
    const reqData = {
      id: contractorInfo.id,
      companyName: formData?.companyName,
      companyCode: formData?.companyCode,
      telephone: formData?.telephone,
      address: formData?.address,
      ceoName: formData?.ceoName,
      ceoFamily: formData?.ceoFamily,
      ceoNationalCode: formData?.ceoNationalCode,
      mobile: formData?.mobile,
      legal: formData?.legal,
    };
    if (!formData.type) {
      try {
        const { data } = await request.apiCall(
          "post",
          "Contractor/Edit",
          reqData
        );
      } catch (error) {
        console.log(error);
      }
    }
  };
  return (
    <div className="flex flex-col space-y-4">
      <div className="flex flex-col space-y-4  mb-4">
        <div className="text-2xl font-black text-gray-600">
          پروفایل{" "}
          {user?.role?.listSystemSet?.filter((item) => item.number == 5)[0]
            ?.fieldValue2
            ? user?.role?.listSystemSet?.filter((item) => item.number == 5)[0]
                ?.fieldValue2
            : "پیمانکار"}
        </div>
        <span className="mr-2  text-gray-500">
          اطلاعات{" "}
          {user?.role?.listSystemSet?.filter((item) => item.number == 5)[0]
            ?.fieldValue2
            ? user?.role?.listSystemSet?.filter((item) => item.number == 5)[0]
                ?.fieldValue2
            : "پیمانکار"}{" "}
          را تکمیل کنید و برای تایید آن دکمه ثبت تغییرات را بزنید
        </span>
      </div>
      <div className="flex flex-col rounded-xl bg-white shadow-sm p-4 h-full w-full">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="sm:grid sm:grid-cols-2 gap-4 text-right">
            <div className="flex flex-col space-y-2">
              <label className="text-xs text-gray-600" htmlFor="companyName">
                نام شرکت
              </label>
              <TextInput name={"companyName"} register={register} />
              {errors.companyName && (
                <p className="text-red-600 text-xs">
                  {errors.companyName.message}
                </p>
              )}
            </div>
            <div className="flex flex-col space-y-2">
              <label className="text-xs text-gray-600" htmlFor="companyCode">
                کد شرکت
              </label>
              <TextInput name={"companyCode"} register={register} />
              {errors.companyCode && (
                <p className="text-red-600 text-xs">
                  {errors.companyCode.message}
                </p>
              )}
            </div>
            <div className="flex flex-col space-y-2">
              <label className="text-xs text-gray-600" htmlFor="telephone">
                شماره تلفن
              </label>
              <TextInput name={"telephone"} register={register} />
              {errors.telephone && (
                <p className="text-red-600 text-xs">
                  {errors.telephone.message}
                </p>
              )}
            </div>

            <div className="flex flex-col space-y-2">
              <label className="text-xs text-gray-600" htmlFor="ceoName">
                نام مدیرعامل
              </label>
              <TextInput name={"ceoName"} register={register} />
              {errors.ceoName && (
                <p className="text-red-600 text-xs">{errors.ceoName.message}</p>
              )}
            </div>

            <div className="flex flex-col space-y-2">
              <label className="text-xs text-gray-600" htmlFor="ceoFamily">
                نام خانوادگی مدیرعامل
              </label>
              <TextInput name={"ceoFamily"} register={register} />
              {errors.ceoFamily && (
                <p className="text-red-600 text-xs">
                  {errors.ceoFamily.message}
                </p>
              )}
            </div>

            <div className="flex flex-col space-y-2">
              <label
                className="text-xs text-gray-600"
                htmlFor="ceoNationalCode"
              >
                کدملی مدیرعامل
              </label>
              <TextInput name={"ceoNationalCode"} register={register} />
              {errors.ceoNationalCode && (
                <p className="text-red-600 text-xs">
                  {errors.ceoNationalCode.message}
                </p>
              )}
            </div>

            <div className="flex flex-col space-y-2">
              <label className="text-xs text-gray-600" htmlFor="mobile">
                شماره موبایل
              </label>
              <TextInput name={"mobile"} register={register} />
              {errors.mobile && (
                <p className="text-red-600 text-xs">{errors.mobile.message}</p>
              )}
            </div>

            <div className="flex flex-col space-y-2">
              <label className="text-xs text-gray-600" htmlFor="legal">
                شخص حقوقی
              </label>
              <div>
                <Checkbox name={"legal"} register={register} size="small" />
              </div>
              {errors.legal && (
                <p className="text-red-600 text-xs">{errors.legal.message}</p>
              )}
            </div>
            <div className="flex flex-col space-y-2">
              <label className="text-xs text-gray-600" htmlFor="address">
                آدرس
              </label>
              <TextArea name={"address"} register={register} />
              {errors.address && (
                <p className="text-red-600 text-xs">{errors.address.message}</p>
              )}
            </div>
          </div>
        </form>
        <div className="flex justify-end w-full">
          <button
            type="submit"
            disabled={request.loading}
            className="btn-primary my-4 w-fit"
            onClick={handleSubmit(onSubmit)}
          >
            {!request.loading ? (
              " ثبت تغییرات"
            ) : (
              <BeatLoaderLoading size={20} color="#fff" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContractortemProfile;
