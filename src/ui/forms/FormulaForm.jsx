import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import BeatLoaderLoading from "../element/loading/BeatLoader";

const schema = yup.object().shape({
  title: yup.string().required("عنوان را وارد کنید"),
  description: yup.string().required("فرمول را وارد کنید"),
});

const FormulaForm = ({
  onSubmitForm,
  onClose,
  onSubmitTitle,
  loading,
  defaultValues,
  id,
}) => {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    if (!data.type)
      onSubmitForm({ title: data?.title, description: data?.description }, id);
  };
  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="sm:grid sm:grid-cols-2 gap-4"
      >
        <div className="col-span-2">
          <label htmlFor="title" className="text-xs text-gray-600 mb-4">
            عنوان فرمول
          </label>
          <input
            type="text"
            {...register("title")}
            defaultValue={defaultValues?.title || ""}
            className="form-input block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-400 sm:text-sm sm:leading-6"
          />
          {errors.title && (
            <p className="text-red-600 text-xs">{errors.title.message}</p>
          )}
        </div>

        <div className="mb-2 space-y-2 col-span-2">
          <label htmlFor="description" className="text-xs text-gray-600 mb-4">
            فرمول
          </label>

          <textarea
            type="textarea"
            {...register("description")}
            defaultValue={defaultValues?.description || ""}
            className="form-input block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-400 sm:text-sm sm:leading-6"
          />

          {errors.description && (
            <p className="text-red-600 text-xs">{errors.description.message}</p>
          )}
        </div>
      </form>
      <div className=" px-4 pt-4 mt-4 sm:flex sm:flex-row sm:justify-center sm:px-6">
        <button
          type="submit"
          className="btn-primary"
          onClick={handleSubmit(onSubmit)}
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

export default FormulaForm;
