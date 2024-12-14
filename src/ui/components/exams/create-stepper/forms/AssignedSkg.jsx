import { useState, useEffect } from "react";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import ComboBox from "../../../../element/ComboBox";
import useApi from "../../../../../hooks/useApi";
import toast from "react-hot-toast";
import {useUser} from "../../../../../contexts/UserContext";
const AssignedSkg = ({
  setAssignedStatus,
  supervisors,
  contractors,
  formulas,
  id,
  close,
}) => {
  const [skgType, setSkgType] = useState("exam");

  const [selectedSupervisor, setSelectedSupervisor] = useState([]);
  const [selectedFormula, setSelectedFormula] = useState([]);
  const [selectedContractor, setSelectedContractor] = useState([]);
  const request = useApi();
  const { user } = useUser();

  useEffect(() => {
    getData();
  }, []);

  const toPersonFormat = (item) =>
    item
      ? {
          label: item?.family ? item.name + " " + item.family : item.mobile,
          value: item?.id,
        }
      : undefined;

  const toFormulaFormat = (item) =>
    item
      ? {
          label: item?.title,
          value: item?.id,
        }
      : undefined;

  const getData = async () => {
    try {
      const { data } = await request.apiCall(
        "get",
        `Exam/GetExamMembersList/${id}`
      );
      setSkgType("exam");
      setSelectedSupervisor(
        toPersonFormat(
          supervisors.find((item) => item.id === data?.[0]?.supervisorId)
        )
      );
      setSelectedContractor(
        toPersonFormat(
          contractors.find((item) => item.id === data?.[0]?.contractorId)
        )
      );
      setSelectedFormula(
        toFormulaFormat(
          formulas.find((item) =>
            data?.[0]?.id ? item.id === data?.[0]?.id : item
          )
        )
      );
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = async () => {
    const dataPost = {
      examSkGroupId: id,
      supervisorId: selectedSupervisor?.value,
      contractorAdminId: selectedContractor?.value,
      formulaId: selectedFormula?.value,
    };
    try {
      const { data } = await request.apiCall(
        "post",
        skgType === "exam"
          ? `Exam/AddExamMembers`
          : `Exam/AddSelfExpressionMembers`,
        dataPost
      );
      toast.success(`${user?.role?.listSystemSet?.filter(item => item.number == 4 )[0]?.fieldValue  ? user?.role?.listSystemSet?.filter(item => item.number == 4 )[0]?.fieldValue : 'ارزیابی'} با موفقیت اختصاص یافت`);
      close?.();
      setAssignedStatus(true);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex flex-col">
      <span className="text-xs text-gray-500 mb-4">
        در این قسمت{" "}
        {user?.role?.listSystemSet?.filter((item) => item.number == 5)[0]
          ?.fieldValue
          ? user?.role?.listSystemSet?.filter((item) => item.number == 5)[0]
              ?.fieldValue
          : " ناظر"}{" "}
        و {user?.role?.listSystemSet?.filter(item => item.number == 5 )[0]?.fieldValue2 ? user?.role?.listSystemSet?.filter(item => item.number == 5 )[0]?.fieldValue2 : 'پیمانکار'} مد نظر خود را انتخاب کنید
      </span>
      <RadioGroup
        value={skgType}
        onChange={(event) => {
          setSkgType(event.target.value);
        }}
      >
        <FormControlLabel
          value="exam"
          control={<Radio size="small" />}
          label={`${user?.role?.listSystemSet?.filter(item => item.number == 4 )[0]?.fieldValue  ? user?.role?.listSystemSet?.filter(item => item.number == 4 )[0]?.fieldValue : 'ارزیابی'}`}
        />
        <FormControlLabel
          value="selfExpression"
          control={<Radio size="small" />}
          label={`خوداظهاری ${user?.role?.listSystemSet?.filter(item => item.number == 5 )[0]?.fieldValue2 ? user?.role?.listSystemSet?.filter(item => item.number == 5 )[0]?.fieldValue2 : 'پیمانکار'}`}
        />
      </RadioGroup>
      <div className="flex flex-row space-x-2 space-x-reverse mb-2">
        <div className="flex flex-col w-full">
          <span className="text-xs mb-2 text-gray-700">
            {user?.role?.listSystemSet?.filter((item) => item.number == 5)[0]
              ?.fieldValue
              ? user?.role?.listSystemSet?.filter((item) => item.number == 5)[0]
                  ?.fieldValue
              : " ناظر"}
          </span>
          <ComboBox
            value={selectedSupervisor}
            onChange={(val) => setSelectedSupervisor(val)}
            options={supervisors?.map(toPersonFormat) || []}
          />
        </div>
        <div className="flex flex-col w-full">
          <span className="text-xs mb-2 text-gray-700">{user?.role?.listSystemSet?.filter(item => item.number == 5 )[0]?.fieldValue2 ? user?.role?.listSystemSet?.filter(item => item.number == 5 )[0]?.fieldValue2 : 'پیمانکار'}</span>
          <ComboBox
            value={selectedContractor}
            onChange={(val) => setSelectedContractor(val)}
            options={contractors?.map(toPersonFormat) || []}
          />
        </div>
      </div>

      <div className="flex flex-col w-full">
        <span className="text-xs mb-2 text-gray-700">فرمول</span>
        <ComboBox
          value={selectedFormula}
          onChange={(val) => setSelectedFormula(val)}
          options={formulas?.map(toFormulaFormat) || []}
        />
      </div>
      <button onClick={handleSubmit} className="btn-primary mt-4">
        ثبت
      </button>
    </div>
  );
};

export default AssignedSkg;
