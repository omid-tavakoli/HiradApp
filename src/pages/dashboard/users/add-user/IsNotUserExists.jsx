import toast from "react-hot-toast";
import useApi from "../../../../hooks/useApi";
import { useUser } from "../../../../contexts/UserContext";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

const schema = yup.object().shape({
  nationalCode: yup
    .string()
    .required("لطفا کد ملی را وارد کنید")
    .matches(/^[0-9]{10}$/, "کد ملی معتبر نیست"),
});

const IsNotUserExists = ({ mobile, onClose, fetchData , role }) => {
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
      await request.apiCall("post", `User/AddSubUser`, {
        mobile: mobile,
        nationalcode: formData.nationalCode,
        subSysId: user?.subSysId,
        roleId : role,
        status : 4
      });
      toast.success("کاربر با موفقیت به سیستم اضافه شد");
      fetchData();
      onClose();
    } catch (error) {
      onClose();
      console.log(error);
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
            <p className="text-red-600 text-xs">{errors.mobile.message}</p>
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
            <p className="text-red-600 text-xs">
              {errors.nationalCode.message}
            </p>
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
