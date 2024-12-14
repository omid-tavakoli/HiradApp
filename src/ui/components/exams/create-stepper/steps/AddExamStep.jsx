import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import useApi from "../../../../../hooks/useApi";
import { useUser } from "../../../../../contexts/UserContext";
import toast from "react-hot-toast";
import { Box, Button } from "@mui/material";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import SelectboxForm from "../../../../element/SelectboxForm";
import { useNavigate } from "react-router-dom";

const schema = yup.object().shape({
  title: yup.string().required("عنوان را وارد کنید"),
  subProjectId: yup.object().shape({
    value: yup.string().required(),
  }),
  skgIds: yup.array().of(
    yup.object().shape({
      value: yup.string().required("لطفا دسته بندی مورد نظر را انتخاب کنید"),
    })
  ),
});

const AddExamStep = ({
  onNext,
  examId,
  setExamId,
  setKindId,
  setProjectId,
  setIsShowOther,
}) => {
  const [projects, setProjects] = useState([]);
  const [SKG, setSKG] = useState([]);

  const [examData, setExamData] = useState({
    all: false,
    isFinal: false,
    visibleMultiplePeople: false,
    showQuestionScore: false,
  });

  const requestGetExam = useApi();
  const requestGetExamSKGs = useApi();
  const requestGetProjects = useApi();
  const request = useApi();

  const { user } = useUser();

  const navigate = useNavigate();

  const {
    handleSubmit,
    register,
    control,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    if (examId) getExam();
  }, [examId]);

  useEffect(() => {
    user && getProjects();
  }, [user]);

  useEffect(() => {
    watch("subProjectId") && getSKG();
  }, [watch("subProjectId")]);

  useEffect(() => {
    examId && reset(examData);
  }, [examData, reset]);

  const getExam = async () => {
    try {
      const [{ data }, { data: SKGs }] = await Promise.all([
        requestGetExam.apiCall("get", `Exam/Get/${examId}`),
        requestGetExamSKGs.apiCall("get", `Exam/GetExamSkGroupList/${examId}`),
      ]);
      const defaultValues = {
        title: data.title,
        subProjectId: { label: data.projectTitle, value: data.projectId },
        skgIds: SKGs.map((item) => ({
          label: item.skGroupTitle,
          value: item.skGroupId,
        })),
        all: data.all,
        isFinal: data.isFinal,
        showQuestionScore: data.showQuestionScore,
        visibleMultiplePeople: false,
      };
      setExamData(defaultValues);
    } catch (error) {
      console.log(error);
    }
  };

  const getProjects = async () => {
    try {
      const { data } = await requestGetProjects.apiCall(
        "get",
        `Project/GetList?subSysId=${user?.subSysId}`
      );

      if (data?.length) setProjects(data);
      else {
        navigate("/dashboard/projects/create");
        toast.error(`برای ایجاد ${user?.role?.listSystemSet?.filter(item => item.number == 4 )[0]?.fieldValue  ? user?.role?.listSystemSet?.filter(item => item.number == 4 )[0]?.fieldValue : 'ارزیابی'} ابتدا باید ${user?.role?.listSystemSet?.filter(item => item.number == 2 )[0]?.fieldValue ? user?.role?.listSystemSet?.filter(item => item.number == 2 )[0]?.fieldValue: 'پروژه'} تعریف شود.`);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getSKG = async () => {
    const kindId = projects.find(
      (item) => item.id === watch("subProjectId").value
    )?.subSysKindId;

    try {
      const { data } = await requestGetProjects.apiCall(
        "get",
        `SKGroup/GetList/${user?.subSysId}/${kindId}`
      );
      data ? setSKG(data) : setSKG([]);
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (selectedOpt, name) => {
    setExamData((prev) => ({
      ...prev,
      [name]: selectedOpt,
    }));
  };

  const handleSubmitForm = async (data) => {
    !data.type && onSubmit(data);
  };

  const onSubmit = async (data) => {
    const kindId = projects.find(
      (item) => item.id === watch("subProjectId").value
    )?.subSysKindId;

    const reqData = {
      id : examId,
      all: examData.all,
      isFinal: examData.isFinal,
      showQuestionScore: examData.showQuestionScore,
      visibleMultiplePeople: examData.visibleMultiplePeople,
      title: data?.title,
      subProjectId: data?.subProjectId?.value,
      skGroupIds: data?.skgIds?.map((item) => item.value),
    };

    try {
      const response = await request.apiCall(
        "post",
        examId ? "Exam/Edit" : `Exam/Create`,
        reqData
      );
      if (response?.isSuccess) {
        setExamId(response?.data?.id);
        setKindId(kindId);
        setProjectId(watch("subProjectId").value);
        setIsShowOther(examData?.visibleMultiplePeople);
        toast.success(`${user?.role?.listSystemSet?.filter(item => item.number == 4 )[0]?.fieldValue  ? user?.role?.listSystemSet?.filter(item => item.number == 4 )[0]?.fieldValue : 'ارزیابی'} با موفقیت اضافه شد`);
        onNext();
      }
    } catch (error) {
      console.log("ERR", error);
    }
  };

  return (
    <div className="flex flex-col">
      <form
        onSubmit={handleSubmit(handleSubmitForm)}
        className="sm:grid sm:grid-cols-2 gap-2"
      >
        <div className="space-y-2 col-span-2">
          <label htmlFor="title" className="text-xs text-gray-600 mb-4">
            عنوان {user?.role?.listSystemSet?.filter(item => item.number == 4 )[0]?.fieldValue  ? user?.role?.listSystemSet?.filter(item => item.number == 4 )[0]?.fieldValue : 'ارزیابی'}
          </label>
          <input
            type="text"
            {...register("title")}
            className="form-input block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-400 sm:text-sm sm:leading-6"
          />
          {errors.title && (
            <p className="text-red-600 text-xs">{errors.title.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="title" className="text-xs text-gray-600 mb-4">
          {user?.role?.listSystemSet?.filter(item => item.number == 2 )[0]?.fieldValue ? user?.role?.listSystemSet?.filter(item => item.number == 2 )[0]?.fieldValue: 'پروژه'}
          </label>
          <Controller
            name="subProjectId"
            control={control}
            render={({ field }) => (
              <SelectboxForm
                field={field}
                options={(projects || []).map((item) => ({
                  label: item?.title,
                  value: item?.id,
                }))}
              />
            )}
          />

          {errors.subProjectId && (
            <div className="text-red-600 text-xs">لطفا {user?.role?.listSystemSet?.filter(item => item.number == 2 )[0]?.fieldValue ? user?.role?.listSystemSet?.filter(item => item.number == 2 )[0]?.fieldValue: 'پروژه'} را مشخص کنید</div>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="title" className="text-xs text-gray-600 mb-4">
            دسته بندی سوالات
          </label>
          <Controller
            name="skgIds"
            control={control}
            render={({ field }) => (
              <SelectboxForm
                field={field}
                options={SKG.map((item) => ({
                  label: item?.title,
                  value: item?.id,
                }))}
                isMulti={true}
              />
            )}
          />

          {errors.skgIds && (
            <div className="text-red-600 text-xs">لطفا {user?.role?.listSystemSet?.filter(item => item.number == 2 )[0]?.fieldValue ? user?.role?.listSystemSet?.filter(item => item.number == 2 )[0]?.fieldValue: 'پروژه'} را مشخص کنید</div>
          )}
        </div>

        <FormGroup>
          <FormControlLabel
            control={
              <Checkbox
                size="small"
                type="checkbox"
                name="all"
                checked={examData.all}
                onChange={(e) => handleChange(e.target.checked, "all")}
              />
            }
            label={<div className="text-sm">سنجش همه سوالات</div>}
          />
          <FormControlLabel
            control={
              <Checkbox
                size="small"
                type="checkbox"
                name="isFinal"
                checked={examData.isFinal}
                onChange={(e) => handleChange(e.target.checked, "isFinal")}
              />
            }
            label={<div className="text-sm">سنجش نهایی</div>}
          />
          <FormControlLabel
            control={
              <Checkbox
                size="small"
                type="checkbox"
                name="showQuestionScore"
                checked={examData.showQuestionScore}
                onChange={(e) =>
                  handleChange(e.target.checked, "showQuestionScore")
                }
              />
            }
            label={<div className="text-sm">مشاهده امتیاز سوالات</div>}
          />
        </FormGroup>
      </form>

      <>
        <div className="flex flex-row items-cemter mt-6">
          <Box sx={{ flex: "1 1 auto" }} />

          <button
            onClick={handleSubmit(handleSubmitForm)}
            className="bg-primary-800 text-white  py-1 px-4 rounded text-sm transition-all hover:shadow-lg hover:shadow-primary-300"
          >
            بعدی
          </button>
        </div>
      </>
    </div>
  );
};

export default AddExamStep;
