import { useState, useEffect } from "react";
import * as yup from "yup";

const TextField = ({ data, onChangeAnswer, setIsErrors }) => {
  const [answer, setAnswer] = useState();
  const [errors, setErrors] = useState();

  const schema = yup.string();

  useEffect(() => {
    if (data.assume) handleAnswerChange(data.assume);
  }, []);

  useEffect(() => {
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
        textValue: value,
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
        className="input-primary w-fit"
        type="text"
        value={answer || ""}
        onChange={(e) => handleAnswerChange(e.target.value)}
      />
      {errors && (
        <div className="text-primary-600 text-xs mt-2">{errors.message}</div>
      )}
    </>
  );
};

export default TextField;
