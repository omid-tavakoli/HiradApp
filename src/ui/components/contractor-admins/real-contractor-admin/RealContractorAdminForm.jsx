import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import BeatLoaderLoading from "../../../element/loading/BeatLoader";
import IsNotUserExists from "./IsNotUserExists";
import IsUserExists from "./IsUserExists";
import useApi from "../../../../hooks/useApi";
import { useEffect } from "react";

const schema = yup.object().shape({
  mobile: yup
    .string()
    .required("لطفا شماره تلفن را وارد کنید")
    .matches(/^(\+98|0)?9\d{9}$/i, "شماره تلفن معتبر نیست"),
});

const RealContractorAdminForm = ({
  onClose,
  setModalContent,
  projectId,
  refetch,
  defaulteValue,
}) => {
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const request = useApi();

  useEffect(() => {
    reset({mobile : defaulteValue});
  }, [defaulteValue]);
  
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
              data={{
                name: user?.family
                  ? user.name + " " + user.family
                  : user?.mobile,
                id: user?.id,
              }}
              projectId={projectId}
              onClose={onClose}
              refetch={refetch}
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
              data={data}
              onClose={onClose}
              projectId={projectId}
              refetch={refetch}
            />
          ),
        });
    }
  };

  return (
    <>
      <div className="flex flex-col">
        <form
          onSubmit={handleSubmit(handleSubmitForm)}
          className="flex flex-col space-y-2 sm:flex-row sm:justify-between sm:space-y-0 sm:space-x-2 sm:space-x-reverse"
        >
          <div className="mb-2 space-y-2 w-full">
            <label htmlFor="mobile" className="text-xs text-gray-600 mb-4">
              شماره موبایل
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
            disabled={request.loading}
            className="btn-primary !m-0 sm:!ml-4"
            onClick={handleSubmit(handleSubmitForm)}
          >
            {!request.loading ? (
              "تایید"
            ) : (
              <BeatLoaderLoading size={20} color="#fff" />
            )}
          </button>
          <button
            type="button"
            className="btn-secondary !m-0"
            onClick={onClose}
          >
            بستن
          </button>
        </div>
      </div>
    </>
  );
};

export default RealContractorAdminForm;
