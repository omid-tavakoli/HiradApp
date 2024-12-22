import { useState, useEffect } from "react";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";

const TestField = ({ data, onChangeAnswer, setIsErrors }) => {
  const [answer, setAnswer] = useState();
  const [errors, setErrors] = useState();

  useEffect(() => {
    const value = data?.assume || data?.answers?.[0]?.id;
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
      testAnswerId: value,
    });
    setErrors("");
  };

  return (
    <>
      <RadioGroup
        value={answer || ""}
        onChange={(e) => handleAnswerChange(e.target.value)}
      >
        {data.answers &&
          data.answers?.map((item) => (
            <FormControlLabel
              key={item.id}
              value={item.id}
              control={<Radio size="small" />}
              label={item.title}
            />
          ))}
      </RadioGroup>
      {errors && (
        <div className="text-primary-600 text-xs mt-2">{errors.message}</div>
      )}
    </>
  );
};

export default TestField;
