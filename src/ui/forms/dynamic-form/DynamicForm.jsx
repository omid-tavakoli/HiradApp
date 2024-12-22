import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import TextInput from "./fields/TextInput";
import TextArea from "./fields/TextArea";
import NumberInput from "./fields/NumberInput";
import BeatLoaderLoading from "../../element/loading/BeatLoader";
import DateInput from "./fields/DateInput";
import ColorInput from "./fields/ColorInput";
import FileInput from "./fields/FileInput";
import { useEffect } from "react";
import SelectboxForm from "../../element/SelectboxForm";

const DynamicForm = ({
  fields,
  validationSchema,
  defaultValues,
  loading,
  onSubmitTitle,
  onSubmit,
  onClose,
  id = null,
  SubTypes,
}) => {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues]);

  const onSubmitForm = (data) => {
    !data.type && onSubmit(data, id);
  };

  const renderInput = (field) => {
    switch (field.type) {
      case "selectbox":
        return (
          <Controller
            name={field.name}
            control={control}
            defaultValue={defaultValues["subTypeId"] || ""}
            render={({ field: { onChange, value, name, ref } }) => (
              <SelectboxForm
                field={{
                  name,
                  value:
                    SubTypes.find((option) => option.value === value) || null, 
                  onChange: (selectedOption) =>
                    onChange(selectedOption?.value || ""), 
                  inputRef: ref,
                }}
                options={SubTypes}
                placeholder="انتخاب کنید"
                isMulti={false}
                disabled={loading}
              />
            )}
          />
        );
      case "text":
        return (
          <TextInput
            name={field.name}
            register={register}
            defaultValue={defaultValues[field.name] || ""}
          />
        );
      case "textarea":
        return (
          <TextArea
            name={field.name}
            register={register}
            defaultValue={defaultValues[field.name] || ""}
          />
        );
      case "number":
        return (
          <NumberInput
            name={field.name}
            register={register}
            defaultValue={defaultValues[field.name] || ""}
          />
        );
      case "date":
        return (
          <DateInput
            name={field.name}
            register={register}
            control={control}
            defaultValue={defaultValues[field.name] || ""}
          />
        );
      case "color":
        return (
          <ColorInput
            name={field.name}
            register={register}
            control={control}
            defaultValue={defaultValues[field.name] || ""}
          />
        );
      case "file":
        return (
          <FileInput
            name={field.name}
            register={register}
            control={control}
            defaultValue={defaultValues[field.name] || ""}
          />
        );
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmitForm)}>
      <div className="sm:grid sm:grid-cols-2 gap-4  gap-x-8 text-right">
        {fields?.map((field, index) => (
          <div
            key={index}
            className={`space-y-2 w-full  ${field.size && field.size} `}
          >
            {!(field.type === "file") ? (
              <>
                <label
                  htmlFor={field.name}
                  className="text-xs text-gray-600 mb-4"
                >
                  {field.label}
                </label>
                {renderInput(field)}
              </>
            ) : (
              <FileInput
                name={field.name}
                label={field.label}
                register={register}
                control={control}
                defaultValue={defaultValues[field.name] || ""}
              />
            )}
            {errors[field.name] && (
              <p className="text-primary-600 text-xs">
                {errors[field.name].message}
              </p>
            )}
          </div>
        ))}
      </div>

      <div className="px-4 pt-4 sm:flex sm:flex-row sm:justify-center sm:px-6">
        <button type="submit" disabled={loading} className="btn-primary">
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
    </form>
  );
};

export default DynamicForm;
