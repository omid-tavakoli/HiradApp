import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import useApi from "../../../../hooks/useApi";
import { useUser } from "../../../../contexts/UserContext";
import IsNotUserExists from "./IsNotUserExists";
import IsUserExists from "./IsUserExists";

const schema = yup.object().shape({
  mobile: yup.string().required("شماره موبایل را وارد کنید"),
});

const IsNotCompanyExists = ({
  LegalId,
  onClose,
  setModalContent,
  projectId,
  companyCode,
}) => {
  const request = useApi();
  const { user } = useUser();

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const handleSubmitForm = async (data) => {
    if (!data.type) {
      isUserExists(data);
    }
  };

  const isUserExists = async (data) => {
    try {
      const { data: user } = await request.apiCall(
        "get",
        `User/GetByMobile?mobile=${data?.mobile}`
      );

      if (isUserExists) {
        setModalContent({
          title: "افزودن کاربر",
          children: (
            <IsUserExists
              name={user?.family ? user.name + " " + user.family : user?.mobile}
              userId={user?.id}
              companyCode={companyCode}
              projectId={projectId}
              onClose={onClose}
            />
          ),
        });
      }
    } catch (error) {
      error?.response?.status === 404 &&
        setModalContent({
          title: "افزودن کاربر",
          children: (
            <IsNotUserExists
              mobile={data?.mobile}
              companyCode={companyCode}
              onClose={onClose}
              projectId={projectId}
            />
          ),
        });
    }
  };

  return (
    <>
      <span className="text-sm text-gray-700 text-justify">
        شرکتی با این شناسه حقوقی در سیستم موجود نمی باشد، در صورت تمایل می
        توانید با وارد کردن مشخصات کاربر شرکت مورد نظر از آن شرکت دعوت به عضویت
        بکنید
      </span>
      <form
        onSubmit={handleSubmit(handleSubmitForm)}
        className="flex flex-col space-y-2 sm:flex-row sm:justify-between sm:space-y-0 sm:space-x-2 sm:space-x-reverse mt-4"
      >
        <div className="mb-2 space-y-2">
          <label htmlFor="mobile" className="text-xs text-gray-600 mb-4">
            شماره موبایل کاربر
          </label>
          <input
            type="number"
            {...register("mobile")}
            className="form-input block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-400 sm:text-sm sm:leading-6"
          />
          {errors.mobile && (
            <p className="text-red-600 text-xs">{errors.mobile.message}</p>
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

export default IsNotCompanyExists;
