import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useUser } from "../../../contexts/UserContext";
import TextInput from "../../../ui/forms/dynamic-form/fields/TextInput";
import DateInput from "../../../ui/forms/dynamic-form/fields/DateInput";
import BeatLoaderLoading from "../../../ui/element/loading/BeatLoader";
import useApi from "../../../hooks/useApi";
import toast from "react-hot-toast";

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
  systemName: yup
    .string()
    .required("لطفا نام سازمان را وارد کنید")
    .min(2, "خیلی کوتاه است!")
    .max(50, "خیلی طولانی است!"),
  nationalCode: yup
    .string()
    .required("لطفا کد ملی را وارد کنید")
    .matches(/^[0-9]{10}$/, "کد ملی معتبر نیست"),
  paymentCode: yup.string().required("لطفا شناسه پرداخت را وارد کنید"),
  trackingNumber: yup.string().required("لطفا شناسه پرداخت را وارد کنید"),
  date: yup.string().required("لطفا تاریخ را وارد کنید"),
});

export default function AddFactor({ defaultNationalCode }) {
  const request = useApi();
  const { user } = useUser();
  const { 
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmitForm = async (data) => {
    if (!data.type) {
      const dataSent = {
        name: data.name,
        family: data.family,
        nationalcode: data.nationalCode,
        date: data.date,
        systemName: data.systemName,
        paymentCode: data.paymentCode,
        trackingCode: data.trackingNumber,
        status: 1,
      };
      try {
        const response = await request.apiCall(
          "post",
          `Factor/CreatePayment`,
          dataSent
        );
        if (response?.isSuccess) {
          toast.success("پکیج شما در انتظار تایید می باشد");
        }
      } catch (error) {
        console.log("ERR", error);
      }
    }
  };

  return (
    <>
      <div className="flex flex-wrap gap-x-4 gap-y-2">
        <div className="space-y-2 col-span-2">
          <label htmlFor="name" className="text-xs text-gray-600 mb-4">
            نام
          </label>
          <TextInput
            name={"name"}
            register={register}
            defaultValue={user.name}
          />
          {errors.name && (
            <p className="text-primary-600 text-xs">{errors.name.message}</p>
          )}
        </div>
        <div className="space-y-2 col-span-2">
          <label className="text-xs text-gray-600 mb-4" htmlFor="family">
            نام خانوادگی
          </label>
          <TextInput
            name={"family"}
            register={register}
            defaultValue={user.family}
          />
          {errors.family && (
            <p className="text-primary-600 text-xs">{errors.family.message}</p>
          )}
        </div>
        <div className="space-y-2 col-span-2">
          <label htmlFor="nationalCode" className="text-xs text-gray-600 mb-4">
            کد ملی
          </label>
          <TextInput
            name={"nationalCode"}
            register={register}
            defaultValue={defaultNationalCode}
          />
          {errors.nationalCode && (
            <p className="text-primary-600 text-xs">
              {errors.nationalCode.message}
            </p>
          )}
        </div>
        <div className="space-y-2 col-span-2">
          <label htmlFor="systemName" className="text-xs text-gray-600 mb-4">
            نام سازمان
          </label>
          <TextInput
            name={"systemName"}
            register={register}
            defaultValue={user.subSyses[0].title}
          />
          {errors.systemName && (
            <p className="text-primary-600 text-xs">{errors.systemName.message}</p>
          )}
        </div>
        <div className="flex flex-col space-y-2">
          <label className="text-xs text-gray-600 mb-2" htmlFor="date">
            تاریخ
          </label>
          <DateInput name={"date"} register={register} control={control} />
          {errors.date && (
            <p className="text-primary-600 text-xs">{errors.date.message}</p>
          )}
        </div>
        <div className="space-y-2 col-span-2">
          <label htmlFor="paymentCode" className="text-xs text-gray-600 mb-4">
            شناسه پرداخت
          </label>
          <TextInput name={"paymentCode"} register={register} />
          {errors.paymentCode && (
            <p className="text-primary-600 text-xs">{errors.paymentCode.message}</p>
          )}
        </div>
        <div className="flex flex-col space-y-2">
          <label className="text-xs text-gray-600" htmlFor="trackingNumber">
            شماره پیگیری
          </label>
          <TextInput name={"trackingNumber"} register={register} />
          {errors.trackingNumber && (
            <p className="text-primary-600 text-xs">
              {errors.trackingNumber.message}
            </p>
          )}
        </div>
      </div>
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={request.loading}
          className="btn-primary mt-6 !mb-0"
          onClick={handleSubmit(onSubmitForm)}
        >
          {!request.loading ? (
            " پرداخت فاکتور"
          ) : (
            <BeatLoaderLoading size={20} color="#fff" />
          )}
        </button>
      </div>
    </>
  );
}
