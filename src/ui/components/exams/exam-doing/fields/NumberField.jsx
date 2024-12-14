import { useState, useEffect } from "react";
import * as yup from "yup";

const NumberFields = ({ data, onChangeAnswer, setIsErrors }) => {
  const [answer, setAnswer] = useState();
  const [errors, setErrors] = useState();

  const schema = yup
    .number()
    .min(data.min, `حداقل مقدار باید ${data.min} باشد`)
    .max(data.max, `حداکثر مقدار باید ${data.max} باشد`);

  useEffect(() => {
    if (data.assume) handleAnswerChange(+data.assume);
  }, []);

  useEffect(() => {
    onChangeAnswer({ questionId: data.id, digitValue: Number(data?.value) });
    setErrors("");
  }, [data.id]);

  const handleAnswerChange = async (value) => {
    const newAns = value;
    setAnswer(newAns);
    setIsErrors(false);

    try {
      await schema.validate(newAns);
      onChangeAnswer({
        questionId: data.id,
        digitValue: Number(value),
      });
      setErrors("");
    } catch (error) {
      console.log(error.message);
      setIsErrors(true);
      setErrors(error);
    }
  };

  return (
    <>
      <input
        autoFocus
        className="input-primary w-fit"
        type="number"
        value={answer || ""}
        onChange={(e) => handleAnswerChange(e.target.value)}
      />
      {errors && (
        <div className="text-red-600 text-xs mt-2">{errors.message}</div>
      )}
    </>
  );
};

export default NumberFields;
