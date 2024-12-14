
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import BeatLoaderLoading from "../../element/loading/BeatLoader";
import { useState } from "react";

const schema = yup.object().shape({
  title: yup.string(),
  fieldValue: yup.string(),
  fieldValue2: yup.string(),
});

const SettimgForm = ({
  onSubmitTitle,
  onSubmit,
  onClose,
  loading,
  defaultValues,
}) => {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const handleSubmitForm = async (data) => {
    !data.type && onSubmit(data);
  };

  return (
    <>
      <form onSubmit={handleSubmit(handleSubmitForm)} className="flex flex-col">
        <div className="flex flex-row items-center text-sm mb-4">
          <span className="ml-1 text-gray-700">عنوان: </span>
          <span>{defaultValues?.title}</span>
        </div>
        <div className="flex flex-col sm:grid sm:grid-cols-2 gap-4">
          <div className="mb-2 space-y-2">
            <label htmlFor="fieldValue" className="text-xs text-gray-600 mb-4">
              مقدار اول
            </label>
            <input
              type="text"
              {...register("fieldValue")}
              defaultValue={defaultValues?.fieldValue || ""}
              className="form-input block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-400 sm:text-sm sm:leading-6"
            />
            {errors?.fieldValue && (
              <p className="text-red-600 text-xs">
                {errors?.fieldValue.message}
              </p>
            )}
          </div>

          <div className="mb-2 space-y-2">
            <label htmlFor="fieldValue2" className="text-xs text-gray-600 mb-4">
              مقدار دوم
            </label>
            <input
              type="text"
              {...register("fieldValue2")}
              defaultValue={defaultValues?.fieldValue2 || ""}
              className="form-input block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-400 sm:text-sm sm:leading-6"
            />
            {errors?.fieldValue2 && (
              <p className="text-red-600 text-xs">
                {errors?.fieldValue2.message}
              </p>
            )}
          </div>

          <div className="mb-2 space-y-2 col-span-2">
            <label htmlFor="description" className="text-xs text-gray-600 mb-4">
              توضیحات
            </label>
            <textarea
              type="textarea"
              {...register("description")}
              defaultValue={defaultValues?.description || ""}
              className="form-input block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-400 sm:text-sm sm:leading-6"
            />
            {errors.description && (
              <p className="text-red-600 text-xs">
                {errors.description.message}
              </p>
            )}
          </div>
        </div>
      </form>

      <div className=" px-4 pt-4 sm:flex sm:flex-row sm:justify-center sm:px-6">
        <button
          type="submit"
          disabled={loading}
          className="inline-flex w-full justify-center rounded-md bg-primary-800 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
          onClick={handleSubmit(handleSubmitForm)}
        >
          {!loading ? (
            onSubmitTitle
          ) : (
            <BeatLoaderLoading size={20} color="#fff" />
          )}
        </button>
        <button
          type="button"
          className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
          onClick={onClose}
        >
          بستن
        </button>
      </div>
    </>
  );
};

export default SettimgForm;
