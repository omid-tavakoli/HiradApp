import NumberInput from "./fields/NumberInput";
import TextInput from "./fields/TextInput";
import TestInput from "./fields/TestInput";
import DateInput from "./fields/DateInput";
import useApi from "../../../../hooks/useApi";
import { useState } from "react";
import toast from "react-hot-toast";

const FillKindDetailsForm = ({ KindDetails, projectId, reFetch, onSubmit }) => {
  const [answers, setAnswers] = useState([]);

  const request = useApi();

  const handleAnswersChange = (ans) => {
    setAnswers((prevAns) => {
      return { ...prevAns, [ans.id]: ans };
    });
  };

  const handleSubmit = async () => {
    const dataSent = Object.values(answers);
    if (dataSent.length !== KindDetails.length) {
      toast.error("تمام سربرگ ها را پر کنید");
      return;
    }
    try {
      const { data } = await request.apiCall(
        "post",
        `Project/FillProjectKindDetail?projectId=${projectId}`,
        dataSent
      );
      toast.success("سربرگ با موفقیت پر شد");
      reFetch();
    } catch (error) {
      console.log(error);
    }
  };

  const renderInput = (field) => {
    switch (field.type) {
      case 1:
        return (
          <NumberInput
            id={field.id}
            value={field.value}
            min={field.min}
            max={field.max}
            assume={field.assume}
            required={true}
            onChangeAnswer={handleAnswersChange}
          />
        );
      case 2:
        return (
          <TextInput
            id={field.id}
            value={field.value}
            required={true}
            onChangeAnswer={handleAnswersChange}
          />
        );

      case 3:
        return (
          <TestInput
            id={field.id}
            value={field.value}
            required={true}
            kindDetailId={field.kindDetailId}
            onChangeAnswer={handleAnswersChange}
          />
        );
      case 4:
        return (
          <DateInput
            id={field.id}
            value={field.value}
            required={true}
            onChangeAnswer={handleAnswersChange}
          />
        );
    }
  };

  return (
    <div>
      <div className="flex flex-col space-y-4  divide-y-2">
        {KindDetails &&
          KindDetails?.map((item) => (
            <div key={item?.id} className="flex flex-col py-4">
              <div className="text-sm text-gray-700 mb-2">{item?.title}</div>
              <div className="max-w-xl">{renderInput(item)}</div>
            </div>
          ))}
      </div>
      <div className="flex justify-end w-full">
        <button onClick={handleSubmit} className="btn-primary w-fit">
          ثبت تغییرات
        </button>
      </div>
    </div>
  );
};

export default FillKindDetailsForm;
