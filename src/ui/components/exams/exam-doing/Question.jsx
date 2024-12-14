import NumberField from "./fields/NumberField";
import TextField from "./fields/TextField";
import BooleanField from "./fields/BooleanField";
import TestField from "./fields/TestField";
import DateField from "./fields/DateField";
import DocumentField from "./fields/DocumentField";
import { digitsEnToFa } from "@persian-tools/persian-tools";

const Question = ({
  data,
  onChangeAnswer,
  setIsErrors,
  questionCount,
  questionCurrent,
  answers,
}) => {
  const getAssume = (field) => answers?.[data?.id]?.[field] || data?.assume;

  const emptyFunc = () => {};
  const attrs = {
    data: { ...data, assume: getAssume("digitValue") },
    onChangeAnswer: onChangeAnswer || emptyFunc,
    setIsErrors: setIsErrors || emptyFunc,
  };
  const QuestionField = {
    1: <NumberField {...attrs} />,
    2: <TextField {...attrs} />,
    3: <DocumentField {...attrs} />,
    4: <TestField {...attrs} />,
    5: <DateField {...attrs} />,
    6: <BooleanField {...attrs} />,
  };

  return (
    <>
      {questionCount && questionCurrent ? (
        <div className="font-medium text-sm mb-4 text-gray-500">
          سوال {digitsEnToFa(questionCurrent)} از {digitsEnToFa(questionCount)}
        </div>
      ) : ''}
      <div className="mb-4">{data?.title}</div>
      {QuestionField[data?.type]}
    </>
  );
};

export default Question;
