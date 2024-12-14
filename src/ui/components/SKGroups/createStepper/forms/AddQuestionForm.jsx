import { useState, useEffect, Fragment } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Combobox, Transition } from "@headlessui/react";
import {
  CheckIcon,
  ChevronUpDownIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import Checkbox from "@mui/material/Checkbox";
import { getSchema } from "../../../../../utils/models/validation/dashboard/question";
import Question from "../../../exams/exam-doing/Question";

const questionType = [
  { name: "Int ", title: "عددی", id: 1, type: "int" },
  { name: "Text ", title: "متن", id: 2, type: "text" },
  { name: "Document", title: "پیوست سند", id: 3, type: "document" },
  { name: "Choice ", title: "تستی", id: 4, type: "choice" },
  { name: "Date ", title: "تاریخ", id: 5, type: "date" },
];

const AddQuestionForm = ({
  skgroupId,
  onSubmitTitle,
  onSubmit,
  onClose,
  defaultValues,
  id,
}) => {
  const [selectedQuestion, setSelectedQuestion] = useState(questionType[0]);

  const [querySubType, setQuerySubType] = useState("");

  const {
    handleSubmit,
    control,
    register,
    setValue,
    reset,
    watch,
    formState: { errors, isSubmitted },
  } = useForm({
    resolver: yupResolver(getSchema(selectedQuestion?.type)),
    defaultValues: defaultValues,
  });

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  const { fields, append, remove } = useFieldArray({
    control,
    name: "answers",
  });

  const formData = watch();

  useEffect(() => {
    if (Object.keys(defaultValues).length !== 0) {
      const targetType = questionType.find(
        (item) => item.id === defaultValues?.type
      );
      setSelectedQuestion(targetType);
    }

    if (defaultValues?.answers) {
      defaultValues?.answers.map((test, index) => {
        setValue(`answers[${index}].title`, test.title);
        setValue(`answers[${index}].score`, test.score);
        setValue(`answers[${index}].isComputable`, test.isComputable);
        setValue(`answers[${index}].isConfirmed`, test.isConfirmed);
      });
    }
  }, []);

  const filteredSubTypes =
    querySubType === ""
      ? questionType
      : questionType?.filter((type) =>
          type.title
            .toLowerCase()
            .replace(/\s+/g, "")
            .includes(querySubType.toLowerCase().replace(/\s+/g, ""))
        );
  const onSubmitForm = async (data) => {
    let dataPost = {
      ...data,
      type: selectedQuestion?.id,
      skGroupId: Number(skgroupId),
      editable: data?.editable == true ? 1 : 0,
      assume: data?.assume?.toString() || "",
      min: data?.min ? data?.min : 0,
      max: data?.max ? data?.max : 0,
    };

    dataPost.answers = dataPost?.answers.map((answer) => ({
      ...answer,
      isComputable:
        answer.isComputable !== undefined ? answer.isComputable : false,
    }));

    dataPost.answers = dataPost?.answers.map((answer) => ({
      ...answer,
      isConfirmed:
        answer.isConfirmed !== undefined ? answer.isConfirmed : false,
    }));
    onSubmit(dataPost);
  };

  return (
    <>
      <div className="flex flex-col">
        <form
          onSubmit={handleSubmit(onSubmitForm)}
          className="sm:grid sm:grid-cols-2 gap-4 text-right"
        >
          <div className="mb-2 space-y-2 col-span-2">
            <label htmlFor="title" className="text-xs text-gray-600 mb-4">
              عنوان
            </label>
            <textarea
              type="textarea"
              defaultValue={defaultValues?.title || null}
              {...register("title")}
              className="form-input block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-400 sm:text-sm sm:leading-6"
            />
            {errors.title && (
              <p className="text-red-600 text-xs">{errors.title.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="state" className="text-xs text-gray-600 mb-4">
              نوع
            </label>
            <Combobox value={selectedQuestion} onChange={setSelectedQuestion}>
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
                          {({ selectedQuestion, active }) => (
                            <>
                              <span
                                className={`block truncate ${
                                  selectedQuestion
                                    ? "font-medium"
                                    : "font-normal"
                                }`}
                              >
                                {subType.title}
                              </span>
                              {selectedQuestion ? (
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

          <div className="mb-2 space-y-2">
            <label htmlFor="score" className="text-xs text-gray-600 mb-4">
              وزن
            </label>
            <input
              type="number"
              {...register("score")}
              className="form-input block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-400 sm:text-sm sm:leading-6"
            />
            {errors.score && (
              <p className="text-red-600 text-xs">{errors.score.message}</p>
            )}
          </div>
          <div className="mb-2 space-y-2">
            <label
              htmlFor="checkQuantity"
              className="text-xs text-gray-600 mb-4"
            >
              تعداد قابل چک
            </label>
            <input
              type="number"
              defaultValue={defaultValues?.checkQuantity || null}
              {...register("checkQuantity")}
              className="form-input block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-400 sm:text-sm sm:leading-6"
            />
            {errors.checkQuantity && (
              <p className="text-red-600 text-xs">
                {errors.checkQuantity.message}
              </p>
            )}
          </div>

          {selectedQuestion.type == "int" && (
            <>
              <div className="mb-2 space-y-2">
                <label htmlFor="min" className="text-xs text-gray-600 mb-4">
                  کمترین
                </label>
                <input
                  type="number"
                  defaultValue={defaultValues?.min || null}
                  {...register("min")}
                  className="form-input block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-400 sm:text-sm sm:leading-6"
                />
                {errors.min && (
                  <p className="text-red-600 text-xs">{errors.min.message}</p>
                )}
              </div>
              <div className="mb-2 space-y-2">
                <label htmlFor="max" className="text-xs text-gray-600 mb-4">
                  بیشترین
                </label>
                <input
                  type="number"
                  defaultValue={defaultValues?.max || null}
                  {...register("max")}
                  className="form-input block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-400 sm:text-sm sm:leading-6"
                />
                {errors.max && (
                  <p className="text-red-600 text-xs">{errors.max.message}</p>
                )}
              </div>

              <div className="mb-2 space-y-2">
                <label htmlFor="assume" className="text-xs text-gray-600 mb-4">
                  پاسخ پیش فرض
                </label>
                <input
                  type="number"
                  defaultValue={defaultValues?.assume || null}
                  {...register("assume")}
                  className="form-input block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-400 sm:text-sm sm:leading-6"
                />
                {errors.assume && (
                  <p className="text-red-600 text-xs">
                    {errors.assume.message}
                  </p>
                )}
              </div>
            </>
          )}
          <div className="mb-2 flex items-center">
            <Controller
              name="editable"
              control={control}
              defaultValue={defaultValues?.editable == 1}
              render={({ field }) => (
                <Checkbox {...field} size="small" checked={field.value} />
              )}
            />
            <label htmlFor="editable" className="text-xs text-gray-600">
              قابل تغییر باشد؟
            </label>
          </div>
          {selectedQuestion.type == "choice" && (
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
                        <div className="sm:grid sm:grid-cols-2 sm:gap-2">
                          <div className="w-full">
                            <div className="text-xs text-gray-600 mb-1">
                              متن جواب
                            </div>
                            <input
                              type="text"
                              {...register(`answers.${index}.title`)}
                              className="form-input block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-400 sm:text-sm sm:leading-6"
                            />

                            {errors.answers?.[index]?.title && (
                              <p className="text-red-600 text-xs">
                                {errors.answers[index].title.message}
                              </p>
                            )}
                          </div>

                          <div className="w-full">
                            <div className="text-xs text-gray-600 mb-1">
                              امتیاز جواب
                            </div>

                            <input
                              type="number"
                              {...register(`answers.${index}.score`)}
                              className="form-input block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-400 sm:text-sm sm:leading-6"
                            />

                            {errors.answers?.[index]?.score && (
                              <p className="text-red-600 text-xs">
                                {errors.answers[index].score.message}
                              </p>
                            )}
                          </div>

                          <div className="w-full">
                            <div className="mb-2  flex items-center ">
                              <Controller
                                name={`answers.${index}.isComputable`}
                                control={control}
                                render={({ field }) => (
                                  <Checkbox {...field} size="small" />
                                )}
                              />
                              <label className="text-xs text-gray-600 ">
                                محاسبه بشود؟
                              </label>
                            </div>
                          </div>

                          <div className="w-full">
                            <div className="mb-2  flex items-center ">
                              <Controller
                                name={`answers.${index}.isConfirmed`}
                                control={control}
                                render={({ field }) => (
                                  <Checkbox {...field} size="small" />
                                )}
                              />
                              <label className="text-xs text-gray-600 ">
                                انتخاب این جواب به عنوان تایید
                              </label>
                            </div>
                          </div>
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
                  {isSubmitted && errors.answers && (
                    <span className="text-xs text-red-600">
                      {errors.answers.message}
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() =>
                      append({
                        title: "",
                        score: 0,
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

          <div className="mb-2 space-y-2 col-span-2">
            <label htmlFor="description" className="text-xs text-gray-600 mb-4">
              توضیحات
            </label>
            <textarea
              type="textarea"
              defaultValue={defaultValues?.description || null}
              {...register("description")}
              className="form-input block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-400 sm:text-sm sm:leading-6"
            />
            {errors.description && (
              <p className="text-red-600 text-xs">
                {errors.description.message}
              </p>
            )}
          </div>
        </form>

        <hr className="my-4" />

        <div className="text-center mb-2">پیش نمایش</div>

        <div className="border p-2 rounded">
          <Question
            data={{
              type: selectedQuestion.id,
              ...formData,
            }}
          />
          <small className="text-xs text-red-500">
            این فیلد صرفا جنبه پیش نمایش دارد.
          </small>
        </div>

        <div className=" px-4 pt-4 sm:flex sm:flex-row sm:justify-center sm:px-6">
          <button
            type="submit"
            className="inline-flex w-full justify-center rounded-md bg-primary-800 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
            onClick={handleSubmit(onSubmitForm)}
          >
            {onSubmitTitle}
          </button>
          <button
            type="button"
            className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
            onClick={onClose}
          >
            بستن
          </button>
        </div>
      </div>
    </>
  );
};

export default AddQuestionForm;
