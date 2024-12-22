import { useState } from "react";

const NumberInput = ({
  label,
  register,
  name,
  error,
  defaultValue = null,
  disable = null,
  placeholder = null,
}) => {
  const [isFocus, setIsFocus] = useState(false);
  return (
    <div className="flex flex-col space-y-2">
      <div className="text-xs text-gray-600 mb-1">{label}</div>
      <input
        {...register(name)}
        type="number"
        placeholder={isFocus ? `  ${placeholder}` : placeholder}
        
        className="form-input block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-400 sm:text-sm sm:leading-6"
        defaultValue={defaultValue}
        disabled={disable}
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
      />
      {error && <p className="text-primary-600 text-xs">{error}</p>}
    </div>
  );
};

export default NumberInput;
