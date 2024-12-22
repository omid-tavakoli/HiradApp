import { useState, useEffect, Fragment } from "react";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Combobox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import useApi from "../../hooks/useApi";
import BeatLoaderLoading from "../element/loading/BeatLoader";
import SelectboxForm from "../element/SelectboxForm";
import { useUser } from "../../contexts/UserContext";

const schema = yup.object().shape({
  title: yup.string().required("عنوان را وارد کنید"),
  stateId: yup.object().shape({
    value: yup.string().required(),
  }),
  cityId: yup.object().shape({
    value: yup.string().required(),
  }),
});

const ZoneForm = ({
  onSubmitForm,
  onClose,
  onSubmitTitle,
  loading,
  defaultValue,
  id,
}) => {
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const {user} = useUser()
  const requestGetlistSate = useApi();
  const {
    handleSubmit,
    control,
    register,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });
  
  useEffect(() => {
    getListState();
  }, []);
  useEffect(() => {
    if (watch("stateId") || defaultValue?.stateId) getListCity();
  }, [watch("stateId"), defaultValue]);
  
  const getListState = async () => {
    try {
      const { data } = await requestGetlistSate.apiCall("get", "State/GetList");
      setStates(data);
    } catch (error) {
      console.log(error);
    }
  };

  const getListCity = async () => {
    try {
      const { data } = await requestGetlistSate.apiCall(
        "get",
        `City/GetList/${watch("stateId")?.value || defaultValue.stateId}`
      );
      setCities(data);
    } catch (error) {
      console.log(error);
    }
  };

  const onSubmit = async (data) => {
    !data.type &&
      onSubmitForm({ title: data?.title, cityId: data?.cityId?.value }, id);
    };

    return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="sm:grid sm:grid-cols-2 gap-4"
        >
        <div className="col-span-2">
          <label htmlFor="title" className="text-xs text-gray-600 mb-4">
           عنوان {user?.role?.listSystemSet?.filter(item => item.number == 8 )[0]?.fieldValue ? user?.role?.listSystemSet?.filter(item => item.number == 8 )[0]?.fieldValue : 'منطقه'} را وارد نمایید
          </label>
          <input
            type="text"
            {...register("title")}
            defaultValue={defaultValue?.title || ""}
            className="form-input block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-400 sm:text-sm sm:leading-6"
          />
          {errors.title && (
            <p className="text-primary-600 text-xs">{errors.title.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="state" className="text-xs text-gray-600 mb-4">
            استان
          </label>
          <Controller
            name="stateId"
            control={control}
            defaultValue={
              defaultValue
                ? {
                    value: defaultValue.stateId,
                    label: defaultValue.stateName || "",
                  }
                : null
            }
            render={({ field }) => (
              <SelectboxForm
                field={field}
                value={
                  defaultValue
                    ? {
                        value: defaultValue.stateId,
                        label: defaultValue.stateName || "",
                      }
                    : null
                }
                options={states.map((item) => ({
                  label: item?.title,
                  value: item?.id,
                }))}
              />
            )}
          />
          {errors.stateId && (
            <div className="text-primary-600 text-xs mt-2">
              لطفا استان را انتخاب کنید
            </div>
          )}
        </div>

        <div>
          <label htmlFor="city" className="text-xs text-gray-600 mb-4">
            شهر
          </label>
          <Controller
            name="cityId"
            control={control}
            defaultValue={
              defaultValue
                ? {
                  value: defaultValue.cityId,
                  label: defaultValue.cityName,
                  }
                : null
            }
            render={({ field }) => (
              <SelectboxForm
                field={field}
                value={
                  defaultValue
                    ? {
                        value: defaultValue.cityId,
                        label: defaultValue.cityName,
                      }
                    : null
                }
                options={cities.map((item) => ({
                  label: item?.title,
                  value: item?.id,
                }))}
              />
            )}
          />
          {errors.cityId && (
            <div className="text-primary-600 text-xs mt-2">
              لطفا شهر را انتخاب کنید
            </div>
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

export default ZoneForm;
