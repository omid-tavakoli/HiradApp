import Select from "react-select";

const SelectboxForm = ({
  isMulti = false,
  options,
  field,
  placeholder = "انتخاب کنید",
  disabled = false,
}) => {
  const validOptions = Array.isArray(options) ? options : [];
  const selectedValue = isMulti == true
    ? validOptions.filter(option => field.value?.some(val => val.value === option.value)) 
    : validOptions.find(option => option.value === (field.value?.value || field.value));  

  return (
    <Select
      {...field}
      options={validOptions}
      isMulti={isMulti}
      placeholder={placeholder}
      isDisabled={disabled}
      value={selectedValue}
      onChange={(selected) => field.onChange(selected)}
      isLoading={!validOptions || validOptions.length === 0}
    />
  );
};

export default SelectboxForm;