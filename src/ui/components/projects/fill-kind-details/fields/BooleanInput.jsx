import { useState, useEffect } from "react";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";

const BooleanInput = ({ id, onChangeAnswer }) => {
  const [answer, setAnswer] = useState(1);

  useEffect(() => {
    onChangeAnswer({ id: id, textValue: 1 });
  }, []);

  const handleAnswerChange = (e) => {
    setAnswer(e.target.value);
    onChangeAnswer({ id: id, textValue: e.target.value });
  };

  return (
    <RadioGroup value={answer} onChange={handleAnswerChange}>
      {answer?.map((item) => (
        <FormControlLabel
          key={item.id}
          value={item.id}
          control={<Radio />}
          label={item.title}
        />
      ))}
    </RadioGroup>
  );
};

export default BooleanInput;
