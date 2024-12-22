import toast from "react-hot-toast";
import useApi from "../../../../hooks/useApi";
import { useUser } from "../../../../contexts/UserContext";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import DatePicker from "react-multi-date-picker";
import persian_fa from "react-date-object/locales/persian_fa";
import persian from "react-date-object/calendars/persian";
import transition from "react-element-popper/animations/transition";
import { Controller } from "react-hook-form";

const schema = yup.object().shape({
  nationalCode: yup
    .string()
    .required("لطفا کد ملی را وارد کنید")
    .matches(/^[0-9]{10}$/, "کد ملی معتبر نیست"),
  startDate: yup.string().required("لطفا تاریخ شروع را وارد کنید"),
  endDate: yup.string().required("لطفا تاریخ پایان را وارد کنید"),
});

const IsNotUserExists = ({
  mobile,
  onClose,
  companyCode,
  projectId,
  refetch,
}) => {
  const request = useApi();
  const { user } = useUser();

  const {
    handleSubmit,
    register,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const handleSubmitForm = async (formData) => {
    if (!formData.type) {
      handleAddUser(formData);
    }
  };

  const handleAddUser = async (formData) => {
    try {
      const { data } = await request.apiCall("post", `User/Create`, {
        mobile,
        nationalcode: formData.nationalCode,
      });

      if (data.userId) {
        const dataSent = {
          legal: true,
          companyCode: companyCode,
          subSysId: user?.subSysId,
          status : 4,
          admin: {
            projectId: projectId,
            userId: data?.userId,
            startDate: formData.startDate,
            endDate: formData.endDate,
          },
        };
        try {
          const { data } = await request.apiCall(
            "post",
            `Contractor/CreateContractorAndAdmin`,
            dataSent
          );
          toast.success(`مدیر ${user?.role?.listSystemSet?.filter(item => item.number == 5 )[0]?.fieldValue2 ? user?.role?.listSystemSet?.filter(item => item.number == 5 )[0]?.fieldValue2 : 'پیمانکار'} با موفقیت اضافه شد`);
          refetch();
          onClose();
        } catch (error) {
          console.log(error);
        }
      }
    } catch (error) {
      console.log(error?.response?.status === 404);
    }
  };
  return (
    <>
      <span className="text-sm text-gray-700">
        شخصی با این مشخصات در سیستم موجود نیست،در صورت تمایل از شخص برای عضویت
        دعوت می شود
      </span>
      <form
        onSubmit={handleSubmit(handleSubmitForm)}
        className="sm:grid sm:grid-cols-2 gap-4"
      >
        <div className="mb-2 space-y-2">
          <label htmlFor="mobile" className="text-xs text-gray-600 mb-4">
            شماره موبایل
          </label>
          <input
            type="number"
            {...register("mobile")}
            defaultValue={mobile}
            disabled
            className="form-input block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-400 sm:text-sm sm:leading-6"
          />
          {errors.mobile && (
            <p className="text-primary-600 text-xs">{errors.mobile.message}</p>
          )}
        </div>
        <div className="mb-2 space-y-2">
          <label htmlFor="mobile" className="text-xs text-gray-600 mb-4">
            کد ملی
          </label>
          <input
            type="number"
            {...register("nationalCode")}
            className="form-input block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-400 sm:text-sm sm:leading-6"
          />
          {errors.nationalCode && (
            <p className="text-primary-600 text-xs">
              {errors.nationalCode.message}
            </p>
          )}
        </div>
        <div className="mb-2 space-y-2 ">
          <label htmlFor="startDate" className="text-xs text-gray-600 mb-4">
            تاریخ شروع
          </label>
          <Controller
            control={control}
            name={"startDate"}
            rules={{ required: true }}
            render={({
              field: { onChange, name, value },
              fieldState: { invalid, isDirty },
              formState: { errors }, 
            }) => (
              <>
                <DatePicker
                  animations={[transition()]}
                  inputClass="form-input block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-400 sm:text-sm sm:leading-6"
                  value={value || ""}
                  onChange={(date) => {
                    onChange(date?.isValid ? date : "");
                  }}
                  locale={persian_fa}
                  calendar={persian}
                  calendarPosition="bottom-right"
                />
              </>
            )}
          />
          {errors.startDate && (
            <p className="text-primary-600 text-xs">{errors.startDate.message}</p>
          )}
        </div>
        <div className="mb-2 space-y-2 ">
          <label htmlFor="endDate" className="text-xs text-gray-600 mb-4">
            تاریخ پایان
          </label>
          <Controller
            control={control}
            name={"endDate"}
            rules={{ required: true }}
            render={({
              field: { onChange, name, value },
              fieldState: { invalid, isDirty }, 
              formState: { errors },
            }) => (
              <>
                <DatePicker
                  animations={[transition()]}
                  inputClass="form-input block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-400 sm:text-sm sm:leading-6"
                  value={value || ""}
                  onChange={(date) => {
                    onChange(date?.isValid ? date : "");
                  }}
                  locale={persian_fa}
                  calendar={persian}
                  calendarPosition="bottom-right"
                />
              </>
            )}
          />
          {errors.endDate && (
            <p className="text-primary-600 text-xs">{errors.endDate.message}</p>
          )}
        </div>
      </form>
      <div className=" px-4 pt-3 sm:flex sm:flex-row sm:justify-center sm:px-6">
        <button
          type="button"
          className="btn-primary !m-0 sm:!ml-4"
          onClick={handleSubmit(handleSubmitForm)}
        >
          دعوت
        </button>
        <button
          type="button"
          className="btn-secondary !m-0"
          onClick={onClose}
        >
          بستن
        </button>
      </div>
    </>
  );
};

export default IsNotUserExists;
