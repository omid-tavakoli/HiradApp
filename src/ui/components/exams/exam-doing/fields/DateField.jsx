import { useState, useEffect } from "react";
import DatePicker from "react-multi-date-picker";
import persian_fa from "react-date-object/locales/persian_fa";
import persian from "react-date-object/calendars/persian";
import transition from "react-element-popper/animations/transition";

const TestField = ({ data, onChangeAnswer, setIsErrors }) => {
  const [answer, setAnswer] = useState();
  const [errors, setErrors] = useState();

  useEffect(() => {
    const value = data?.assume;
    if (value) handleAnswerChange(value);
  }, []);

  useEffect(() => {
    setErrors("");
  }, [data.id]);

  const handleAnswerChange = async (value) => {
    const newAns = value;
    setAnswer(newAns);
    setIsErrors(false);

    onChangeAnswer({
      questionId: data.id,
      time: value,
    });
    setErrors("");
  };

  return (
    <>
      <DatePicker
        animations={[transition()]}
        inputClass="form-input block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-400 sm:text-sm sm:leading-6"
        value={answer || ""}
        onChange={(date) => {
          handleAnswerChange(date);
        }}
        locale={persian_fa}
        calendar={persian}
        calendarPosition="bottom-right"
      />
      {errors && (
        <div className="text-red-600 text-xs mt-2">{errors.message}</div>
      )}
    </>
  );
};

export default TestField;
