import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import useApi from "../../../hooks/useApi";
import BeatLoaderLoading from "../../../ui/element/loading/BeatLoader";

const schema = yup.object().shape({
  postalCode: yup.string().required("کد پستی را وارد کنید"),
});

const BuyInfo = ({ onClose, onSubmit }) => {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const request = useApi();

  const handleSubmitForm = async (data) => {
    onSubmit(data);
  };

  return (
    <div className="flex flex-col">
      <form
        onSubmit={handleSubmit(handleSubmitForm)}
        className="flex flex-col space-y-2 sm:flex-row sm:justify-between sm:space-y-0 sm:space-x-2 sm:space-x-reverse"
      >
        <div className="mb-2 space-y-2 w-full">
          <label htmlFor="postalCode" className="text-xs text-gray-600 mb-4">
            کدپستی
          </label>
          <input
            type="number"
            {...register("postalCode")}
            className="form-input block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-400 sm:text-sm sm:leading-6"
          />
          {errors.postalCode && (
            <p className="text-red-600 text-xs">{errors.postalCode.message}</p>
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
  );
};

export default BuyInfo;
