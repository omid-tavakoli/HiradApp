import DatePicker from "react-multi-date-picker";
import persian_fa from "react-date-object/locales/persian_fa";
import persian from "react-date-object/calendars/persian";
import transition from "react-element-popper/animations/transition";
import { Controller } from "react-hook-form";
import "../../../../assets/styles/datePicker.css";

const DateInput = ({ name, defaultValue, control }) => {
  return (
    <Controller
      control={control}
      name={name}
      rules={{ required: true }}  
      defaultValue={defaultValue}
      render={({
        field: { onChange, name, value },
        fieldState: { invalid, isDirty },  
        formState: { errors },    
      }) => (
        <>
          <DatePicker
            animations={[transition()]}
            inputClass="form-input block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-400 sm:text-sm sm:leading-6"
            value={value || ""}
            onChange={(date) => {
              onChange(date?.isValid ? date : "");
            }}
            locale={persian_fa}
            calendar={persian}
            calendarPosition="bottom-right"
          />
        </>
      )}
    />
  );
};

export default DateInput;
