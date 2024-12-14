import { useState, useEffect } from "react";

const TextInput = ({ id, onChangeAnswer, value, required }) => {
  const [answer, setAnswer] = useState([]);

  const change = (val) => {
    onChangeAnswer({ id: id, textValue: val });
    setAnswer(val);
  };

  useEffect(() => {
    change(value);
  }, []);

  const handleAnswerChange = (e) => {
    change(e.target.value);
  };
  return (
    <input
      required={required}
      className="input-primary w-fit"
      type="text"
      value={answer}
      onChange={handleAnswerChange}
    />
  );
};

export default TextInput;
