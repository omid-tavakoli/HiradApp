import { useState } from "react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

const PasswordInput = ({
  label,
  register,
  name,
  error,
  defaultValue = null,
  disable = null,
  placeholder = "",
}) => {
  const [isFocus, setIsFocus] = useState(false);
  const [isShow, setIsShow] = useState(false);
  return (
    <div className="flex flex-col space-y-2">
      <div className="text-xs text-gray-600 mb-1">{label}</div>
      <div className="flex flex-row relative">
        <input
          {...register(name)}
          type={isShow ? "text" : "password"}
          placeholder={placeholder}
          
          className="form-input block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-400 sm:text-sm sm:leading-6"
          defaultValue={defaultValue}
          disabled={disable}
          onFocus={() => setIsFocus(true)}
          onBlur={() => setIsFocus(false)}
        />
        <div
          className="absolute left-2 top-2 cursor-pointer	"
          onClick={() => setIsShow(!isShow)}
        >
          {!isShow ? (
            <EyeIcon
              className="ml-1 h-5 w-5 text-gray-500"
              aria-hidden="true"
            />
          ) : (
            <EyeSlashIcon
              className="ml-1 h-5 w-5 text-gray-500"
              aria-hidden="true"
            />
          )}
        </div>
      </div>

      {error && <p className="text-primary-600 text-xs">{error}</p>}
    </div>
  );
};

export default PasswordInput;
