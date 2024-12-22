import { useState, useEffect } from "react";
import * as yup from "yup";

const NumberInput = ({ id, onChangeAnswer, value, min, max, required }) => {
  const [answer, setAnswer] = useState();
  const [errors, setErrors] = useState();

  const change = (val) => {
    if (required && !val) return;
    onChangeAnswer({ id: id, digitValue: Number(val) });
    setAnswer(val);
  };

  const schema = yup
    .number()
    .min(min, `حداقل مقدار باید ${min} باشد`)
    .max(max, `حداکثر مقدار باید ${max} باشد`);

  useEffect(() => {
    change(value);
  }, []);

  const handleAnswerChange = async (e) => {
    const newAns = e.target.value;

    try {
      await schema.validate(newAns);
      change(newAns);
      setErrors("");
    } catch (error) {
      change(newAns > max ? max : min);
      setErrors(error);
    }
  };
  return (
    <>
      <input
        className="input-primary w-fit"
        type="number"
        value={answer || ""}
        onChange={(e) => change(e.target.value)}
        onBlur={handleAnswerChange}
        required={required}
      />
      {errors && (
        <span className="text-primary-600 text-xs mt-2">{errors.message}</span>
      )}
    </>
  );
};

export default NumberInput;
