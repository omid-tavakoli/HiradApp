import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import useApi from "../../../../hooks/useApi";
import BeatLoaderLoading from "../../../element/loading/BeatLoader";
import { useUser } from "../../../../contexts/UserContext";
import toast from "react-hot-toast";
import { Box } from "@mui/material";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import SelectboxForm from "../../../element/SelectboxForm";

const schema = yup.object().shape({
  title: yup.string().required("عنوان را وارد کنید"),
  subProjectId: yup.object().shape({
    value: yup.string().required(),
  }),
  skgIds: yup.array().of(
    yup.object().shape({
      value: yup.string().required(),
    })
  ),
});

const InfoTab = ({
  examId,
  setKindId,
  setProjectId,
  setExamTitle,
  setAll,
  setIsFinal,
  setShowQuestionScore,
  setSkGroupIds,
}) => {
  const [projects, setProjects] = useState([]);
  const [examInfo, setExamInfo] = useState([]);
  const [SKG, setSKG] = useState([]);

  const [examData, setExamData] = useState({
    all: 0,
    isFinal: 0,
    showQuestionScore: false,
  });

  const requestGetProjects = useApi();
  const requestGetExam = useApi();
  const requestGetExamSKGs = useApi();
  const request = useApi();

  const { user } = useUser();

  const {
    handleSubmit,
    register,
    control,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    getExam();
  }, []);

  useEffect(() => {
    user?.subSysId && getProjects();
  }, [user]);

  useEffect(() => {
    if (examId && examInfo) {
      reset(examInfo);
    }
  }, [examInfo, reset, examId]);

  useEffect(() => {
    if (examId && projects.length) getSKG();
  }, [examInfo, projects]);

  const getProjects = async () => {
    try {
      const { data } = await requestGetProjects.apiCall(
        "get",
        `Project/GetList?subSysId=${user?.subSysId}`
      );
      setProjects(data);
    } catch (error) {
      console.log(error);
    }
  };

  const getSKG = async () => {
    const kindId = projects.find(
      (item) => item.id === watch("subProjectId").value
    )?.subSysKindId;

    setKindId(kindId);
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
        startDate: data.startPeriod,
        endDate: data.endPeriod,
        eventTime: data.eventTime,
      };
      setExamInfo(defaultValues);
      setExamData({
        all: data.all,
        isFinal: data.isFinal,
        showQuestionScore: data.showQuestionScore,
      });;
      setProjectId(data.projectId);
      setSkGroupIds(defaultValues.skgIds?.map((item) => item.value));
      setAll(data.all);
      setIsFinal(data.isFinal);
      setExamTitle(data.title);
      setShowQuestionScore(data.showQuestionScore);
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
  
  const watchedTitle = watch("title");
  const watchedProjectId = watch("subProjectId")?.value;
  const watchedAll = examData.all;
  const watchedIsFinal = examData.isFinal;
  const watchedShowQuestionScorel = examData.showQuestionScore;
  const watchedSkGroupIds = watch("skgIds");
  

  useEffect(() => {
    setExamTitle(watchedTitle);
  }, [watchedTitle, setExamTitle]);

  useEffect(() => {
    setProjectId(watchedProjectId);
  }, [watchedProjectId, setProjectId]);

  useEffect(() => {
    setAll(watchedAll);
  }, [watchedAll, setAll]);

  useEffect(() => {
    setIsFinal(watchedIsFinal);
  }, [watchedIsFinal, setIsFinal]);
  
  useEffect(() => {
    setShowQuestionScore(watchedShowQuestionScorel);
  }, [watchedShowQuestionScorel, setShowQuestionScore]);

  useEffect(() => {
    setSkGroupIds(watchedSkGroupIds?.map((item) => item.value));
  }, [watchedSkGroupIds, setSkGroupIds]);

  return (
    <div>
      {!request.loading ? (
        <form
          onSubmit={handleSubmit(handleSubmitForm)}
          className="sm:grid sm:grid-cols-2 gap-2"
        >
          <div className="space-y-2 col-span-2">
            <label htmlFor="title" className="text-xs text-gray-600 mb-4">
              عنوان
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
                  options={projects.map((item) => ({
                    label: item?.title,
                    value: item?.id,
                  }))}
                />
              )}
            />

            {errors.subProjectId && (
              <div className="text-red-600 text-xs">
                لطفا {user?.role?.listSystemSet?.filter(item => item.number == 2 )[0]?.fieldValue ? user?.role?.listSystemSet?.filter(item => item.number == 2 )[0]?.fieldValue: 'پروژه'} را مشخص کنید
              </div>
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
              <div className="text-red-600 text-xs">
                لطفا {user?.role?.listSystemSet?.filter(item => item.number == 2 )[0]?.fieldValue ? user?.role?.listSystemSet?.filter(item => item.number == 2 )[0]?.fieldValue: 'پروژه'} را مشخص کنید
              </div>
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
      ) : (
        <div className="w-full flex justify-center">
          <BeatLoaderLoading />
        </div>
      )}
    </div>
  );
};

export default InfoTab;
