import useApi from "../../../../../hooks/useApi";
import { useState, useEffect } from "react";

import BeatLoaderLoading from "../../../../element/loading/BeatLoader";
import { Box } from "@mui/material";
import { ArrowRightIcon, ArrowLeftIcon } from "@heroicons/react/20/solid";
import toast from "react-hot-toast";
import NumberInput from "../../fill-kind-details/fields/NumberInput";
import TextInput from "../../fill-kind-details/fields/TextInput";
import TestInput from "../../fill-kind-details/fields/TestInput";
import DateInput from "../../fill-kind-details/fields/DateInput";

const FillKindDetailsStep = ({
  onNext,
  onBack,
  onSkip,
  activeStep,
  kindId,
  projectId,
}) => {
  const [list, setList] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [isErrors, setIsErrors] = useState(false);

  const requestGetlist = useApi();
  const requestFill = useApi();

  useEffect(() => {
    getListData();
  }, []);

  const getListData = async () => {
    try {
      const { data } = await requestGetlist.apiCall(
        "get",
        `Project/GetProjectKindDetail/${projectId}`
      );
      setList(data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleAnswersChange = (ans) => {
    setAnswers((prevAns) => {
      return { ...prevAns, [ans.id]: ans };
    });
  };

  const handleSubmit = async () => {
    const dataSent = Object.values(answers);
    try {
      const { data } = await requestFill.apiCall(
        "post",
        `Project/FillProjectKindDetail?projectId=${projectId}`,
        dataSent
      );
      toast.success("سربرگ با موفقیت پر شد");
      onNext();
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
            onChangeAnswer={handleAnswersChange}
            setIsErrors={setIsErrors}
          />
        );
      case 2:
        return (
          <TextInput
            id={field.id}
            value={field.value}
            onChangeAnswer={handleAnswersChange}
          />
        );
      case 3:
        return (
          <TestInput
            id={field.id}
            value={field.value}
            kindDetailId={field.kindDetailId}
            onChangeAnswer={handleAnswersChange}
          />
        );
      case 4:
        return (
          <DateInput
            id={field.id}
            value={field.value}
            onChangeAnswer={handleAnswersChange}
          />
        );
    }
  };

  return (
    <>
      {requestGetlist.loading ? (
        <div className="w-full flex justify-center">
          <BeatLoaderLoading size={50} />
        </div>
      ) : (
        <div className="flex flex-col space-y-4  divide-y-2">
          {list &&
            list?.map((item) => (
              <div key={item?.id} className="flex flex-col py-4">
                <div className="text-sm text-gray-700 mb-2">{item?.title}</div>
                <div className="max-w-xl">{renderInput(item)}</div>
              </div>
            ))}
        </div>
      )}
      <div className="flex flex-row items-cemter mt-6">
        <button
          type="button"
          disabled={activeStep === 0}
          onClick={onBack}
          className="btn-primary flex flex-row"
        >
          <ArrowRightIcon className="w-4 h-4 ml-1" />
          قبلی
        </button>

        <Box sx={{ flex: "1 1 auto" }} />

        <button
          onClick={() => handleSubmit()}
          disabled={isErrors}
          className="btn-primary  flex flex-row"
        >
          بعدی
          <ArrowLeftIcon className="w-4 h-4 mr-1" />
        </button>
      </div>
    </>
  );
};

export default FillKindDetailsStep;
