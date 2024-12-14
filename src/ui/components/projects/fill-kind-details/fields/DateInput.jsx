import DatePicker, { DateObject } from "react-multi-date-picker";
import persian_fa from "react-date-object/locales/persian_fa";
import persian from "react-date-object/calendars/persian";
import transition from "react-element-popper/animations/transition";
import { useState, useEffect } from "react";
import "../../../../../assets/styles/datePicker.css";

const DateInput = ({ id, onChangeAnswer, value, required }) => {
  const [answer, setAnswer] = useState("");

  const change = (val) => {
    if (required && !val) return;
    onChangeAnswer({ id: id, timeValue: val });
    setAnswer(val);
  };

  useEffect(() => {
    change(value);
  }, []);

  const handleAnswerChange = (date) => {
    change(date.format());
  };
  return (
    <DatePicker
      animations={[transition()]}
      inputClass="form-input block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-400 sm:text-sm sm:leading-6"
      value={answer}
      onChange={(date) => {
        handleAnswerChange(date);
      }}
      locale={persian_fa}
      calendar={persian}
      calendarPosition="bottom-right"
      required={required}
    />
  );
};

export default DateInput;
