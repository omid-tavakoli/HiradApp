import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import { useState, useEffect } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
const theme = createTheme({
  direction: "rtl",
  palette: {
    primary: {
      main: "#b20206",
    },
  },
});

const BooleanField = ({ data, onChangeAnswer, setIsErrors }) => {
  const [answer, setAnswer] = useState();

  useEffect(() => {
    handleAnswerChange(data.assume || 1);
  }, []);

  const handleAnswerChange = (value) => {
    setAnswer(value);
    onChangeAnswer({ id: data.id, textValue: value });
  };
  return (
    <ThemeProvider theme={theme}>
      <RadioGroup
        value={answer || ""}
        onChange={(e) => handleAnswerChange(e.target.value)}
      >
        <FormControlLabel
          value="1"
          control={<Radio size="small" />}
          label="بله"
        />
        <FormControlLabel
          value="0"
          control={<Radio size="small" />}
          label="خیر"
        />
      </RadioGroup>
    </ThemeProvider>
  );
};

export default BooleanField;
