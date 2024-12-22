import TreePermission from "./TreePermission";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import BeatLoaderLoading from "../../element/loading/BeatLoader";
import { useState } from "react";

const schema = yup.object().shape({
  title: yup.string().required("عنوان را وارد کنید"),
  displayName: yup.string().required("نام نمایشی را وارد کنید"),
});

const RoleForm = ({
  onSubmitTitle,
  onSubmit,
  onClose,
  loading,
  defaultValues,
}) => {
  const [permissionSelected, setPermissionSelected] = useState([]);
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const handleSubmitForm = async (data) => {
    !data.type && onSubmit({ ...data, permissionDtos: permissionSelected });
  };

  return (
    <>
      <form
        onSubmit={handleSubmit(handleSubmitForm)}
        className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2 sm:space-x-reverse"
      >
        <div className="mb-2 space-y-2">
          <label htmlFor="title" className="text-xs text-gray-600 mb-4">
            عنوان نقش
          </label>
          <input
            type="text"
            {...register("title")}
            defaultValue={defaultValues?.title || ""}
            className="form-input block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-400 sm:text-sm sm:leading-6"
          />
          {errors.title && (
            <p className="text-primary-600 text-xs">{errors.title.message}</p>
          )}
        </div>

        <div className="mb-2 space-y-2">
          <label htmlFor="displayName" className="text-xs text-gray-600 mb-4">
            نام نمایشی
          </label>

          <input
            type="text"
            {...register("displayName")}
            defaultValue={defaultValues?.displayName || ""}
            className="form-input block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-400 sm:text-sm sm:leading-6"
          />

          {errors.displayName && (
            <p className="text-primary-600 text-xs">{errors.displayName.message}</p>
          )}
        </div>
      </form>
      <TreePermission
        setPermissionSelected={setPermissionSelected}
        defaultValue={defaultValues?.permissionDto || []}
      />
      <div className=" px-4 pt-4 sm:flex sm:flex-row sm:justify-center sm:px-6">
        <button
          type="submit"
          disabled={loading}
          className="btn-primary"
          onClick={handleSubmit(handleSubmitForm)}
        >
          {!loading ? (
            onSubmitTitle
          ) : (
            <BeatLoaderLoading size={20} color="#fff" />
          )}
        </button>
        <button type="button" className="btn-secondary" onClick={onClose}>
          بستن
        </button>
      </div>
    </>
  );
};

export default RoleForm;
