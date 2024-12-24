import { FormControlLabel, Radio, RadioGroup } from "@mui/material";
import ComboBox from "../element/ComboBox";
import { useEffect, useState } from "react";
import { useUser } from "../../contexts/UserContext";
import useApi from "../../hooks/useApi";
import toast from "react-hot-toast";
import { useForm, Controller } from "react-hook-form";

export default function MassExamAssigend({selectedProject ,skgId}) {
  const [skgType, setSkgType] = useState("exam");
  const [supervisors, setSupervisors] = useState([]);
  const [formulas, setFormulas] = useState([]);
  const [selectedSupervisor, setSelectedSupervisor] = useState(null);
  const [selectedFormula, setSelectedFormula] = useState(null);
  const { user } = useUser();
  const request = useApi();

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();

  useEffect(() => {
    user && getFormulas() && getSupervisors();
  }, [user]);

  const getSupervisors = async () => {
    try {
      const { data } = await request.apiCall(
        "get",
        `Supervisor/GetAllList?subSysId=${user.subSysId}`
      );
      setSupervisors(data);
    } catch (error) {
      console.log(error);
    }
  };

  const getFormulas = async () => {
    try {
      const { data } = await request.apiCall(
        "get",
        `CalculationFormula/GetList/${user?.subSysId}`
      );
      setFormulas(data);
    } catch (error) {
      console.log(error);
    }
  };

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

  const onSubmit = async (dataPost) => {
    const reqdata = {
      projectIds : selectedProject,
      skgIds : skgId,
      formulas : formulas,
      supervisors : supervisors,
    }
    try {
      const response = await request.apiCall( "post", "Exam/AddExamMembersList", reqdata);
      toast.success(
        `${
          user?.role?.listSystemSet?.filter((item) => item.number == 4)[0]
            ?.fieldValue
            ? user?.role?.listSystemSet?.filter((item) => item.number == 4)[0]
                ?.fieldValue
            : "ارزیابی"
        } با موفقیت اختصاص یافت`
      );
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <RadioGroup
        row
        value={skgType}
        onChange={(event) => {
          setSkgType(event.target.value);
        }}
      >
        <FormControlLabel
          value="exam"
          control={<Radio size="small" />}
          label={`${
            user?.role?.listSystemSet?.filter((item) => item.number == 4)[0]
              ?.fieldValue
              ? user?.role?.listSystemSet?.filter((item) => item.number == 4)[0]
                  ?.fieldValue
              : "ارزیابی"
          }`}
        />
        <FormControlLabel
          value="selfExpression"
          control={<Radio size="small" />}
          label={`خوداظهاری ${
            user?.role?.listSystemSet?.filter((item) => item.number == 5)[0]
              ?.fieldValue2
              ? user?.role?.listSystemSet?.filter((item) => item.number == 5)[0]
                  ?.fieldValue2
              : "پیمانکار"
          }`}
        />
      </RadioGroup>
      <div className="flex flex-wrap sm:flex-nowrap gap-4 lg:gap-10 mt-4">
        {skgType === "exam" && (
          <div className="flex flex-col sm:w-1/2">
            <span className="text-xs mb-2 text-gray-700">
              {user?.role?.listSystemSet?.filter((item) => item.number == 5)[0]
                ?.fieldValue
                ? user?.role?.listSystemSet?.filter(
                    (item) => item.number == 5
                  )[0]?.fieldValue
                : " ناظر"}
            </span>
            <Controller
              name="selectedSupervisor"
              control={control}
              rules={{ required: skgType === "exam" }}
              render={({ field }) => (
                <ComboBox
                  {...field}
                  value={selectedSupervisor}
                  onChange={(val) => {
                    setSelectedSupervisor(val);
                    setValue("selectedSupervisor", val);
                  }}
                  options={supervisors?.map(toPersonFormat) || []}
                />
              )}
            />
            {errors.selectedSupervisor && (
              <span className="text-xs text-primary-600 mt-2">این فیلد اجباری است</span>
            )}
          </div>
        )}
        <div className="flex flex-col sm:w-1/2">
          <span className="text-xs mb-2 text-gray-700">فرمول</span>
          <Controller
            name="selectedFormula"
            control={control}
            rules={{ required: skgType === "exam" }}
            render={({ field }) => (
              <ComboBox
                {...field}
                value={selectedFormula}
                onChange={(val) => {
                  setSelectedFormula(val);
                  setValue("selectedFormula", val);
                }}
                options={formulas?.map(toFormulaFormat) || []}
              />
            )}
          />
          {errors.selectedFormula && (
            <span className="text-xs text-primary-600 mt-2">این فیلد اجباری است</span>
          )}
        </div>
      </div>
      <div className="flex justify-end w-full">
        <button onClick={handleSubmit(onSubmit)} className="btn-primary mt-4">
          اتمام فرایند
        </button>
      </div>
    </div>
  );
}
