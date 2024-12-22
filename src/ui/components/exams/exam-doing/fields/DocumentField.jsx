import { useEffect, useState } from "react";
import * as yup from "yup";

const DocumentField = ({ data, onChangeAnswer, setIsErrors }) => {
  const [answer, setAnswer] = useState();
  const [errors, setErrors] = useState();

  const schema = yup.mixed();

  useEffect(() => {
    setErrors("");
  }, [data.id]);

  const handleAnswerChange = async (e) => {
    const newAns = e.target.value;
    setAnswer(newAns);
    setIsErrors(false);

    try {
      await schema.validate(newAns);
      onChangeAnswer({
        questionId: data.id,
        file: e.target.files,
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
        type="file"
        value={answer || ""}
        onChange={handleAnswerChange}
      />
      {errors && (
        <div className="text-primary-600 text-xs mt-2">{errors.message}</div>
      )}
    </>
  );
};

export default DocumentField;
