import Select from "react-select";

const ComboBox = ({
  isMulti = false,
  options,
  value,
  onChange,
  placeholder = "",
}) => {
  return (
    <Select
      value={value}
      onChange={onChange}
      options={options}
      placeholder={placeholder}
      defaultValue={options[0]}
      isMulti={isMulti}
    />
  );
};

export default ComboBox;
