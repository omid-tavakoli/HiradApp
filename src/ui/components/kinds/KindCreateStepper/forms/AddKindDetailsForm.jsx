import { useState, useEffect, Fragment } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Combobox, Transition } from "@headlessui/react";
import {
  CheckIcon,
  ChevronUpDownIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";

import { getSchema } from "../../../../../utils/models/validation/dashboard/kinddetail";

const kindDetailType = [
  { name: "Int ", title: "عددی", id: 1, type: "int" },
  { name: "Text ", title: "متن", id: 2, type: "text" },
  { name: "Choice ", title: "تستی", id: 3, type: "choice" },
  { name: "Date ", title: "تاریخ", id: 4, type: "date" },
];

const AddKindDetailsForm = ({
  kindId,
  onSubmitTitle,
  onClose,
  onSubmit,
  defaultValues,
  id,
}) => {
  const [selectedKindDetail, setSelectedKindDetail] = useState(
    kindDetailType[0]
  );

  const [querySubType, setQuerySubType] = useState("");

  const {
    handleSubmit,
    control,
    register,
    setValue,
    reset,
    formState: { errors, isSubmitted },
  } = useForm({
    resolver: yupResolver(getSchema(selectedKindDetail?.type)),
    defaultValues: defaultValues,
  });

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  const { fields, append, remove } = useFieldArray({
    control,
    name: "testKindDetailDtos",
  });

  useEffect(() => {
    if (Object.keys(defaultValues).length !== 0) {
      const targetType = kindDetailType.find(
        (item) => item.id === defaultValues?.type
      );
      setSelectedKindDetail(targetType);
    }

    if (defaultValues?.testKindDetailDtos) {
      defaultValues?.testKindDetailDtos.map((test, index) => {
        setValue(`testKindDetailDtos[${index}].title`, test.title);
      });
    }
  }, []);

  const filteredSubTypes =
    querySubType === ""
      ? kindDetailType
      : kindDetailType?.filter((type) =>
          type.title
            .toLowerCase()
            .replace(/\s+/g, "")
            .includes(querySubType.toLowerCase().replace(/\s+/g, ""))
        );

  const onSubmitForm = async (data) => {
    const dataSent = data?.testKindDetailDtos?.map((item) => ({
      title: item?.title,
    }));

    const reqData = {
      ...data,
      subsyskindId: kindId,
      type: selectedKindDetail?.id,
      max: !(selectedKindDetail?.id == 1) ? 0 : data.max,
      min: !(selectedKindDetail?.id == 1) ? 0 : data.min,
      assume: !(selectedKindDetail?.id == 1) ? 0 : data.assume,
      testKindDetailDtos: dataSent,
    };

    onSubmit(reqData, id);
  };

  return (
    <>
      <div className="flex flex-col">
        <form
          onSubmit={handleSubmit(onSubmitForm)}
          className="sm:grid sm:grid-cols-2 gap-4 text-right"
        >
          <div className="col-span-2">
            <label htmlFor="state" className="text-xs text-gray-600 mb-4">
              نوع
            </label>
            <Combobox
              value={selectedKindDetail}
              onChange={setSelectedKindDetail}
            >
              <div className="relative mt-1">
                <div className="form-input block w-full rounded-md border-0 py-[1px] text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-400 sm:text-sm sm:leading-6">
                  <Combobox.Input
                    className="w-full border-none py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 focus:ring-0"
                    displayValue={(subType) => subType?.title}
                    onChange={(event) => setQuerySubType(event.target.value)}
                  />
                  <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
                    <ChevronUpDownIcon
                      className="h-5 w-5 text-gray-400"
                      aria-hidden="true"
                    />
                  </Combobox.Button>
                </div>
                <Transition
                  as={Fragment}
                  leave="transition ease-in duration-100"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                  afterLeave={() => setQuerySubType("")}
                >
                  <Combobox.Options className="absolute mt-1 z-10 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
                    {filteredSubTypes.length === 0 && querySubType !== "" ? (
                      <div className="relative cursor-default select-none px-4 py-2 text-gray-700">
                        موردی یافت نشد
                      </div>
                    ) : (
                      !filteredSubTypes.length == 0 &&
                      filteredSubTypes?.map((subType, index) => (
                        <Combobox.Option
                          key={index}
                          className={({ active }) =>
                            `relative cursor-default select-none py-2 pl-10 pr-4 ${
                              active
                                ? "bg-primary-800 text-white"
                                : "text-gray-900"
                            }`
                          }
                          value={subType}
                        >
                          {({ selectedKindDetail, active }) => (
                            <>
                              <span
                                className={`block truncate ${
                                  selectedKindDetail
                                    ? "font-medium"
                                    : "font-normal"
                                }`}
                              >
                                {subType.title}
                              </span>
                              {selectedKindDetail ? (
                                <span
                                  className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                                    active ? "text-white" : "text-primary-800"
                                  }`}
                                >
                                  <CheckIcon
                                    className="h-5 w-5"
                                    aria-hidden="true"
                                  />
                                </span>
                              ) : null}
                            </>
                          )}
                        </Combobox.Option>
                      ))
                    )}
                  </Combobox.Options>
                </Transition>
              </div>
            </Combobox>
          </div>
          <div className="mb-2 space-y-2 col-span-2">
            <label htmlFor="title" className="text-xs text-gray-600 mb-4">
              عنوان
            </label>
            <textarea
              type="textarea"
              {...register("title")}
              className="form-input block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-400 sm:text-sm sm:leading-6"
            />
            {errors.title && (
              <p className="text-primary-600 text-xs">{errors.title.message}</p>
            )}
          </div>

          {selectedKindDetail.type == "int" && (
            <>
              <div className="mb-2 space-y-2">
                <label htmlFor="min" className="text-xs text-gray-600 mb-4">
                  کمترین
                </label>
                <input
                  type="number"
                  defaultValue={defaultValues?.min || ""}
                  {...register("min")}
                  className="form-input block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-400 sm:text-sm sm:leading-6"
                />
                {errors.min && (
                  <p className="text-primary-600 text-xs">{errors.min.message}</p>
                )}
              </div>
              <div className="mb-2 space-y-2">
                <label htmlFor="max" className="text-xs text-gray-600 mb-4">
                  بیشترین
                </label>
                <input
                  type="number"
                  defaultValue={defaultValues?.max || ""}
                  {...register("max")}
                  className="form-input block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-400 sm:text-sm sm:leading-6"
                />
                {errors.max && (
                  <p className="text-primary-600 text-xs">{errors.max.message}</p>
                )}
              </div>

              <div className="mb-2 space-y-2">
                <label htmlFor="assume" className="text-xs text-gray-600 mb-4">
                  پاسخ پیش فرض
                </label>
                <input
                  type="number"
                  defaultValue={defaultValues?.assume || ""}
                  {...register("assume")}
                  className="form-input block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-400 sm:text-sm sm:leading-6"
                />
                {errors.assume && (
                  <p className="text-primary-600 text-xs">
                    {errors.assume.message}
                  </p>
                )}
              </div>
            </>
          )}

          {selectedKindDetail.type == "choice" && (
            <>
              <div className="col-span-2">
                <div className="flex flex-col border border-dotted border-gray-500 p-2 rounded-md">
                  <div className="text-base text-gray-600 font-bold mb-4">
                    جواب ها
                  </div>

                  <div className="space-y-4 ">
                    {fields.map((answer, index) => (
                      <div
                        key={answer.id}
                        className="flex flex-row items-center space-x-2 space-x-reverse justify-between mx-2"
                      >
                        <div className="w-full">
                          <div className="text-xs text-gray-600 mb-1">
                            متن جواب
                          </div>
                          <input
                            type="text"
                            {...register(`testKindDetailDtos.${index}.title`)}
                            className="form-input block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-400 sm:text-sm sm:leading-6"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => remove(index)}
                          className="mt-4"
                        >
                          <TrashIcon className="w-5 h-5" />
                        </button>
                      </div>
                    ))}
                  </div>
                  {errors.testKindDetailDtos && (
                    <p className="text-primary-600 text-xs">
                      {errors.testKindDetailDtos?.root?.message ||
                        errors.testKindDetailDtos?.message}
                    </p>
                  )}
                  <button
                    type="button"
                    onClick={() =>
                      append({
                        title: "",
                      })
                    }
                    className="mt-8 w-full mb-4 flex flex-row items-center justify-center text-xs text-primary-800 font-bold border border-dotted border-primary-800 rounded-md  p-2 text-center cursor-pointer "
                  >
                    افزودن جواب
                  </button>
                </div>
              </div>
            </>
          )}
        </form>

        <div className=" px-4 pt-4 sm:flex sm:flex-row sm:justify-center sm:px-6">
          <button
            type="submit"
             
            className="btn-primary w-fit"
            onClick={handleSubmit(onSubmitForm)}
          >
            {onSubmitTitle}
          </button>
          <button type="button" className="btn-secondary" onClick={onClose}>
            بستن
          </button>
        </div>
      </div>
    </>
  );
};

export default AddKindDetailsForm;
