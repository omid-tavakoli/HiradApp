import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import useApi from "../../../../hooks/useApi";
import BeatLoaderLoading from "../../../../ui/element/loading/BeatLoader";
import IsUserExists from "./IsUserExists";
import IsNotUserExists from "./IsNotUserExists";
import { useState } from "react";
import SelectboxForm from "../../../../ui/element/SelectboxForm";
import { useUser } from "../../../../contexts/UserContext";

const schema = yup.object().shape({
  mobile: yup.string().required("شماره موبایل را وارد کنید"),
  role: yup.object().required(" نقش خود را وارد کنید"),
});

const CheckUser = ({ onClose, setModalContent, fetchData }) => {
  const {
    handleSubmit,
    register,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const request = useApi();
  const {user} = useUser()

  const [roles , setRoles] = useState([
    {title: `${user?.role?.listSystemSet?.filter(item => item.number == 5 )[0]?.fieldValue ? user?.role?.listSystemSet?.filter(item => item.number == 5 )[0]?.fieldValue : ' ناظر'}`, id : '5'},
    {title: 'مدیر زیر سیستم', id : '5'}
  ])

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
                name: `${user.name} ${user?.family}`,
                id: user?.id,
                role : data.role.value
              }}
              onClose={onClose}
              fetchData={fetchData}
            />
          ),
        });
      }
    } catch (error) {
      setModalContent({
        title: "افزودن کاربر",
        children: (
          <IsNotUserExists
            role={data.role.value}
            onClose={onClose}
            mobile={data?.mobile}
            fetchData={fetchData}
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
              شماره موبایل کاربر مورد نظر خود را وارد کنید
            </label>
            <input
              type="number"
              {...register("mobile")}
              className="form-input block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-400 sm:text-sm sm:leading-6"
            />
            {errors.mobile && (
              <p className="text-primary-600 text-xs">{errors.mobile.message}</p>
            )}
          </div>
          <div className="mb-2 space-y-2 w-full">
          <label htmlFor="role" className="text-xs text-gray-600 mb-4">
              نقش مورد نظر خود را وارد کنید
            </label>
            <Controller
              name="role"
              control={control}
              render={({ field }) => (
                <SelectboxForm
                  field={field}
                  options={roles.map((item) => ({
                    label: item.title,
                    value: item.id,
                  }))}
                />
              )}
            />
            {errors.role && (
              <p className="text-primary-600 text-xs">{errors.role.message}</p>
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

export default CheckUser;
