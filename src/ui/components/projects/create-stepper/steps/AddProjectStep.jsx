import { useState, useEffect, Fragment } from "react";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/20/solid";
import useApi from "../../../../../hooks/useApi";
import { useUser } from "../../../../../contexts/UserContext";
import toast from "react-hot-toast";
import { Box } from "@mui/material";
import DatePicker from "react-multi-date-picker";
import persian_fa from "react-date-object/locales/persian_fa";
import persian from "react-date-object/calendars/persian";
import transition from "react-element-popper/animations/transition";
import "../../../../../assets/styles/datePicker.css";
import { useNavigate } from "react-router-dom";
import SelectboxForm from "../../../../element/SelectboxForm";
import ModalAction from "../../../../ModalAction";
import ZoneForm from "../../../../forms/ZoneForm";

const schema = yup.object().shape({
  title: yup.string().required("عنوان را وارد کنید"),
  startDate: yup.string(),
  endDate: yup.string(),
  identity: yup.string().required("لطفا هویت را وارد کنید"),
  subSysKindId: yup.object().shape({
    value: yup.string().required(),
  }),
  zoneId: yup.object().shape({
    value: yup.string(),
  }),
});

const AddProjectStep = ({
  onNext,
  onBack,
  activeStep,
  setProjectId,
  setKindId,
  projectId,
}) => {
  const [projectInfo, setProjectInfo] = useState([]);

  const [subKinds, setSubKinds] = useState([]);

  const [zones, setZones] = useState([]);

  const [modalContent, setModalContent] = useState(null);
  const [showModal, setShowModal] = useState([]);

  const requestGetSubKinds = useApi();
  const requestGetZones = useApi();
  const requestGetProject = useApi();
  const requestSubmit = useApi();
  const requestAddZone = useApi();
  const navigate = useNavigate();
  const { user } = useUser();

  const {
    handleSubmit,
    control,
    register,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    if (user) {
      getSubKinds();
      getSubZones();
    }
  }, [user]);

  useEffect(() => {
    projectId && getProjectInfo();
  }, []);

  useEffect(() => {
    projectId && reset(projectInfo);
  }, [projectInfo, reset]);

  const getProjectInfo = async () => {
    try {
      const { data } = await requestGetProject.apiCall(
        "get",
        `Project/Get/${projectId}`
      );
      const defaultValues = {
        title: data?.title,
        startDate: data?.startDate,
        endDate: data?.endDate,
        identity: data?.identity,
        subSysKindId: {
          label: data?.subSysKindName,
          value: data?.subSysKindId,
        },
        zoneId: data?.zone ? {lable : data.zone.value , value : data.zone.id } : null,
      };
      setProjectInfo(defaultValues);
      setKindId(data?.subSysKindId);
    } catch (error) {
      console.log(error);
    }
  };

  const getSubKinds = async () => {
    try {
      const { data } = await requestGetSubKinds.apiCall(
        "get",
        `SubSysKind/GetList/${user?.subSysId}`
      );
      setSubKinds(data);
    } catch (error) {
      console.log(error);
    }
  };

  const getSubZones = async () => {
    try {
      const { data } = await requestGetZones.apiCall(
        "get",
        `Zone/GetList/${user?.subSysId}`
      );
      setZones(data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleAddZone = () => {
    setModalContent({
      title: `افزودن ${user?.role?.listSystemSet?.filter(item => item.number == 8 )[0]?.fieldValue ? user?.role?.listSystemSet?.filter(item => item.number == 8 )[0]?.fieldValue : 'منطقه'}`,
      children: (
        <ZoneForm
          onSubmitForm={(formData) => onAddZone(formData)}
          onClose={() => setShowModal(false)}
          onSubmitTitle={"افزودن"}
          loading={requestAddZone.loading}
          defaultValues={{}}
        />
      ),
    });
    setShowModal(true);
  };
  const onAddZone = async (formData) => {
    setShowModal(false);
    try {
      const response = await requestAddZone.apiCall("post", `Zone/Create`, {
        ...formData,
        subSysId: user?.subSysId,
      });
      if (response?.isSuccess) {
        toast.success(`${user?.role?.listSystemSet?.filter(item => item.number == 8 )[0]?.fieldValue ? user?.role?.listSystemSet?.filter(item => item.number == 8 )[0]?.fieldValue : 'منطقه'} با موفقیت اضافه  شد`);
        getSubZones();
        setShowModal(false);
      }
    } catch (error) {
      console.log("ERR", error);
    }
  };

  const handleSubmitForm = async (data) => {
    !data.type && onSubmit(data);
  };

  const onSubmit = async (data) => {
    const reqData = {
      ...data,
      startDate:
        data.startDate == "" || data?.startDate == undefined
          ? null
          : data.startDate,
      endDate:
        data.endDate == "" || data?.endDate == undefined ? null : data.endDate,
      subSysKindId: data?.subSysKindId?.value,
      zoneId: data?.zoneId.value,
    }; 
    if (!projectId) {
      try {
        const response = await requestSubmit.apiCall(
          "post",
          `Project/Create`,
          reqData
        );
        if (response?.isSuccess) {
          setProjectId(response?.data?.id);
          setKindId(data?.subSysKindId?.value);
          toast.success(`${user?.role?.listSystemSet?.filter(item => item.number == 2 )[0]?.fieldValue ? user?.role?.listSystemSet?.filter(item => item.number == 2 )[0]?.fieldValue: 'پروژه'} با موفقیت اضافه شد`);
          onNext();
        }
      } catch (error) {
        console.log("ERR", error);
      }
    } else {
      try {
        const response = await requestSubmit.apiCall("post", `Project/Edit`, {
          ...reqData,
          id: projectId,
        });
        if (response?.isSuccess) {
          toast.success(`${user?.role?.listSystemSet?.filter(item => item.number == 2 )[0]?.fieldValue ? user?.role?.listSystemSet?.filter(item => item.number == 2 )[0]?.fieldValue: 'پروژه'} با موفقیت ویرایش شد`);
          onNext();
        }
      } catch (error) {
        console.log("ERR", error);
      }
    }
  };
  return (
    <div className="flex flex-col">
      <form
        onSubmit={handleSubmit(handleSubmitForm)}
        className="sm:grid sm:grid-cols-2 sm:gap-x-4 sm:gap-y-2"
      >
        <div className="mb-2 space-y-2">
          <label htmlFor="title" className="text-xs text-gray-600">
          {user?.role?.listSystemSet?.filter(item => item.number == 7 )[0]?.fieldValue ? user?.role?.listSystemSet?.filter(item => item.number == 7 )[0]?.fieldValue : 'عنوان'}
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

        <div className="mb-2 ">
          <div className="flex flex-row justify-between items-center mb-4">
            <label htmlFor="kind" className="text-xs text-gray-600 ">
            {user?.role?.listSystemSet?.filter(item => item.number == 11 )[0]?.fieldValue ? user?.role?.listSystemSet?.filter(item => item.number == 11 )[0]?.fieldValue : 'زیر مجموعه'}
            </label>
            <div
              onClick={() => window.open("/dashboard/kinds/create", "blank")}
              className="text-xs  text-primary-800 cursor-pointer"
            >
              افزودن
            </div>
          </div>
          <Controller
            name="subSysKindId"
            control={control}
            render={({ field }) => (
              <SelectboxForm
                field={field}
                options={subKinds?.map((item) => ({
                  label: item?.title,
                  value: item?.id,
                }))}
              />
            )}
          />

          {errors.subSysKindId && (
            <div className="text-red-600 text-xs">لطفا نوع را مشخص کنید</div>
          )}
        </div>

        <div className="mb-2 space-y-2">
          <label htmlFor="title" className="text-xs text-gray-600 mb-2">
          {user?.role?.listSystemSet?.filter(item => item.number == 9 )[0]?.fieldValue ? user?.role?.listSystemSet?.filter(item => item.number == 9 )[0]?.fieldValue : 'تاریخ شروع'}
          </label>
          <Controller
            control={control}
            name={"startDate"}
            rules={{ required: true }}  
              
            render={({
              field: { onChange, name, value },
              fieldState: { invalid, isDirty },  
              formState: { errors },    
            }) => (
              <>
                <DatePicker
                  animations={[transition()]}
                  inputClass="form-input block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-400 sm:text-sm sm:leading-6"
                  value={value || ""}
                  format="YYYY/MM/DD"
                  onChange={(date) => {
                    onChange(date?.isValid ? date : "");
                  }}
                  locale={persian_fa}
                  calendar={persian}
                  calendarPosition="bottom-right"
                />
              </>
            )}
          />
          {errors.startDate && (
            <p className="text-red-600 text-xs">{errors.startDate.message}</p>
          )}
        </div>

        <div className="mb-2 space-y-2">
          <label htmlFor="title" className="text-xs text-gray-600 mb-2">
          {user?.role?.listSystemSet?.filter(item => item.number == 10 )[0]?.fieldValue ? user?.role?.listSystemSet?.filter(item => item.number == 10 )[0]?.fieldValue : 'تاریخ پایان'}
          </label>
          <Controller
            control={control}
            name={"endDate"}
            rules={{ required: true }}  
            render={({
              field: { onChange , value },  
            }) => (
              <>
                <DatePicker
                  animations={[transition()]}
                  inputClass="form-input block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-400 sm:text-sm sm:leading-6"
                  value={value || ""}
                  format="YYYY/MM/DD"
                  onChange={(date) => {
                    onChange(date?.isValid ? date : "");
                  }}
                  locale={persian_fa}
                  calendar={persian}
                  calendarPosition="bottom-right"
                />
              </>
            )}
          />
          {errors.endDate && (
            <p className="text-red-600 text-xs">{errors.endDate.message}</p>
          )}
        </div>

        <div className="mb-2 space-y-2">
          <label htmlFor="identity" className="text-xs text-gray-600 mb-2">
          {user?.role?.listSystemSet?.filter(item => item.number == 6 )[0]?.fieldValue ? user?.role?.listSystemSet?.filter(item => item.number == 6 )[0]?.fieldValue : 'شناسه'}
          </label>
          <input
            type="text"
            {...register("identity")}
            className="form-input block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-400 sm:text-sm sm:leading-6"
          />
          {errors.identity && (
            <p className="text-red-600 text-xs">{errors.identity.message}</p>
          )}
        </div>

        <div className="mb-2 ">
          <div className="flex flex-row justify-between items-center mb-4">
            <label htmlFor="zone" className="text-xs text-gray-600 ">
            {user?.role?.listSystemSet?.filter(item => item.number == 8 )[0]?.fieldValue ? user?.role?.listSystemSet?.filter(item => item.number == 8 )[0]?.fieldValue : 'منطقه'}
            </label>
            <div
              onClick={() => handleAddZone()}
              className="text-xs  text-primary-800 cursor-pointer"
            >
              افزودن
            </div>
          </div>
          <Controller
            name="zoneId"
            control={control}
            render={({ field }) => (
              <SelectboxForm
                field={field}
                options={zones  ? zones.map((item) => ({
                  label: item?.title,
                  value: item?.id,
                })) : {}}
              />
            )}
          />
        </div>
      </form>

      <>
        <div className="flex flex-row items-cemter mt-6">
          {activeStep !== 0 && (
            <button
              type="button"
              onClick={onBack}
              className="btn-primary flex flex-row"
            >
              <ArrowRightIcon className="w-4 h-4 ml-1" />
              قبلی
            </button>
          )}

          <Box sx={{ flex: "1 1 auto" }} />

          <button
            onClick={handleSubmit(handleSubmitForm)}
            className="btn-primary  flex flex-row"
          >
            بعدی
            <ArrowLeftIcon className="w-4 h-4 mr-1" />
          </button>
        </div>
      </>
      {showModal && modalContent && (
        <ModalAction
          {...modalContent}
          show={showModal}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

export default AddProjectStep;
