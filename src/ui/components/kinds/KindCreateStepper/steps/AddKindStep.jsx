import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/20/solid";
import useApi from "../../../../../hooks/useApi";

import { useUser } from "../../../../../contexts/UserContext";
import toast from "react-hot-toast";
import { Box } from "@mui/material";
import SelectboxForm from "../../../../element/SelectboxForm";

const AddKindStep = ({
  onNext,
  onBack,
  onSkip,
  activeStep,
  setKindId,
  kindId,
}) => {
  const [subTypes, setSubTypes] = useState([]);
  const [subKinds, setSubKinds] = useState([]);
  const [kindInfo, setKindInfo] = useState([]);

  const requestGetSubTypes = useApi();
  const requestGetSubKinds = useApi();
  const requestSubmit = useApi();
  const requestGetKind = useApi();

  const { user } = useUser();
  const schema = yup.object().shape({
    title: yup.string().required("عنوان را وارد کنید"),
    description: yup.string(),
    subTypeId: yup.object().shape({
      value: yup.string().required("نوع را انتخاب کنید"),
    }),
  });

  const {
    handleSubmit,
    register,
    control,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    kindId && reset(kindInfo);
  }, [kindInfo, reset]);

  
  useEffect(() => {
    kindId && getKindInfo();
  }, []);

  useEffect(() => {
    if (user) {
      getSubTypes();
      getSubKinds();
    }
  }, [user]);

  const getSubTypes = async () => {
    try {
      const { data } = await requestGetSubTypes.apiCall(
        "get",
        `SubSys/GetSubTypeList/${user?.subSysId}`
      );
      setSubTypes(data);
      setValue("subTypeId", { value: data[0]?.id });
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

  const getKindInfo = async () => {
    try {
      const { data } = await requestGetKind.apiCall(
        "get",
        `SubSysKind/GetSubSysKind/${kindId}`
      );
      setKindInfo({
        title: data?.title,
        description: data?.description,
        subTypeId: { label: data?.subTypeTitle, value: data?.subTypeId },
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmitForm = async (data) => {
    !data.type && onSubmit(data);
  };

  const onSubmit = async (data) => {
    const reqData = {
      ...data,
      subSysId: user?.subSysId,
      subTypeId:
        subTypes.length == 1 ? subTypes[0]?.id : data?.subTypeId?.value,
      parentSubSysKindId: data?.parentSubSysKind?.value || null,
    };

    if (!kindId) {
      try {
        const response = await requestSubmit.apiCall(
          "post",
          `SubSysKind/Create`,
          reqData
        );
        if (response?.isSuccess) {
          setKindId(response?.data?.id);
          toast.success(`${user?.role?.listSystemSet?.filter(item => item.number == 11 )[0]?.fieldValue ? user?.role?.listSystemSet?.filter(item => item.number == 11 )[0]?.fieldValue : 'زیرمجموعه'} با موفقیت اضافه شد`);
          onNext();
        }
      } catch (error) {
        console.log("ERR", error);
      }
    } else {
      try {
        const response = await requestSubmit.apiCall(
          "post",
          `SubSysKind/Edit`,
          { ...reqData, id: kindId }
        );
        if (response?.isSuccess) {
          toast.success(`${user?.role?.listSystemSet?.filter(item => item.number == 11 )[0]?.fieldValue ? user?.role?.listSystemSet?.filter(item => item.number == 11 )[0]?.fieldValue : 'زیرمجموعه'} با ویرایش اضافه شد`);
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
        onSubmit={handleSubmit(onSubmit)}
        className="sm:grid sm:grid-cols-2 gap-2"
      >
        <div
          className={`space-y-2 ${
            subTypes.length == 1 || (user?.subSysTypeId == 1 && "col-span-2")
          }`}
        >
          <label htmlFor="title" className="text-xs text-gray-600 mb-4">
            عنوان {user?.role?.listSystemSet?.filter(item => item.number == 11 )[0]?.fieldValue ? user?.role?.listSystemSet?.filter(item => item.number == 11 )[0]?.fieldValue : 'زیرمجموعه'}
          </label>
          <input
            type="text"
            {...register("title")}
            className="form-input block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-400 sm:text-sm sm:leading-6"
          />
          {errors.title && (
            <p className="text-primary-600 text-xs">{errors.title.message}</p>
          )}
        </div>
        <div
          className={`mb-2 space-y-2 ${subTypes.length == 1 && "col-span-1"}`}
        >
          <label
            htmlFor="parentSubSysKind"
            className="text-xs text-gray-600 mb-4"
          >
            {user?.role?.listSystemSet?.filter(item => item.number == 11 )[0]?.fieldValue ? user?.role?.listSystemSet?.filter(item => item.number == 11 )[0]?.fieldValue : 'زیرمجموعه'} والد
          </label>
          <Controller
            name="parentSubSysKind"
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

          {errors.parentSubSysKind && (
            <p className="text-primary-600 text-xs">
              {errors.parentSubSysKind.message}
            </p>
          )}
        </div>
        {user?.role?.title == "SystemAdmin" && (
          <div className="space-y-2">
            <label htmlFor="title" className="text-xs text-gray-600 mb-4">
              نوع
            </label>
            <Controller
              name="subTypeId"
              control={control}
              render={({ field }) => (
                <SelectboxForm
                  field={field}
                  options={subTypes.map((item) => ({
                    label: item?.name,
                    value: item?.id,
                  }))}
                />
              )}
            />

            {errors.subTypeId && (
              <div className="text-primary-600 text-xs">لطفا نوع را مشخص کنید</div>
            )}
          </div>
        )}
        <div className="space-y-2 col-span-2">
          <label htmlFor="description" className="text-xs text-gray-600 mb-4">
            توضیحات
          </label>

          <textarea
            type="textarea"
            {...register("description")}
            className="form-input block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-400 sm:text-sm sm:leading-6"
          />

          {errors.description && (
            <p className="text-primary-600 text-xs">{errors.description.message}</p>
          )}
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
    </div>
  );
};

export default AddKindStep;
