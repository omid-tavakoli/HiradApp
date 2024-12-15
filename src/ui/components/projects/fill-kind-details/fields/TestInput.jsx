import useApi from "../../../../../hooks/useApi";
import { useState, useEffect } from "react";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";

const TestInput = ({ id, onChangeAnswer, kindDetailId, value, required }) => {
  const [tests, setTests] = useState();
  const [answer, setAnswer] = useState(value);

  const change = (val) => {
    if (required && !val) return;
    onChangeAnswer({ id: id, testKindDetailId: Number(val) });
    setAnswer(val);
  };

  const request = useApi();

  useEffect(() => {
    change(value);
    getData();
  }, []);

  const getData = async () => {
    const { data } = await request.apiCall(
      "get",
      `Project/GetKindDetail/${kindDetailId}`
    );
    setTests(data?.testKindDetailDtos);
  };

  const handleAnswerChange = (e) => {
    change(e.target.value);
  };

  return (
    <RadioGroup
      value={answer}
      onChange={(e) => handleAnswerChange(e)}
      required={required}
    >
      {tests &&
        tests?.map((item) => (
          <FormControlLabel
            key={item.id}
            value={item.id}
            control={<Radio size="small" />}
            label={item.title}
          />
        ))}
    </RadioGroup>
  );
};

export default TestInput;
