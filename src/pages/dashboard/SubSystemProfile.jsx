import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import useApi from "../../hooks/useApi";
import BeatLoaderLoading from "../../ui/element/loading/BeatLoader";
import * as yup from "yup";
import TextInput from "../../ui/forms/dynamic-form/fields/TextInput";
import { useState, useEffect } from "react";
import { useUser } from "../../contexts/UserContext";
import toast from "react-hot-toast";
import SelectboxForm from "../../ui/element/SelectboxForm";
import PhotoProfile from "../../ui/components/profile/PhotoProfile";

const schema = yup.object().shape({
  title: yup.string().required("لطفا عنوان را وارد کنید"),
  color: yup.string().required("لطفا عنوان را وارد کنید"),
  stateId: yup.object().shape({
    value: yup.string().required(),
  }),
  cityId: yup.object().shape({
    value: yup.string().required(),
  }),
});

const SubSystemProfile = () => {
  const [subSysInfo, setSubSysInfo] = useState();
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  const [statesApi, setStatesApi] = useState();
  const [citiesApi, setCitiesApi] = useState();
  const [errorPic, setErrorPic] = useState("");

  const request = useApi();
  const { user } = useUser();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
    watch,
  } = useForm({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    if (subSysInfo) {
      reset(subSysInfo);
    }
  }, [subSysInfo, reset]);

  useEffect(() => {
    getListState();
  }, []);

  useEffect(() => {
    user && getSubSys();
  }, [user]);

  useEffect(() => {
    if (watch("stateId") || subSysInfo?.stateId) {
      getListCity();
    }
  }, [watch("stateId"), subSysInfo?.stateId]);

  useEffect(() => {
    if (subSysInfo) {
      reset({
        title: subSysInfo.title,
        color: subSysInfo.color,
        logoFile: subSysInfo.logoFile,
        stateId: {
          label: subSysInfo.state,
          value: subSysInfo.stateId,
        },
        cityId: {
          label: subSysInfo.city,
          value: subSysInfo.cityId,
        },
      });
      setStatesApi({
        label: subSysInfo.state,
        value: subSysInfo.stateId,
      });
      setCitiesApi({
        label: subSysInfo.city,
        value: subSysInfo.cityId,
      });
    }
  }, [subSysInfo, reset]);

  const getListState = async () => {
    try {
      const { data } = await request.apiCall("get", "State/GetList");
      setStates(data);
    } catch (error) {
      console.log(error);
    }
  };

  const getListCity = async () => {
    try {
      const { data } = await request.apiCall(
        "get",
        `City/GetList/${watch("stateId")?.value || subSysInfo.stateId}`
      );
      setCities(data);
    } catch (error) {
      console.log(error);
    }
  };

  const getSubSys = async () => {
    try {
      const { data } = await request.apiCall(
        "get",
        `SubSys/Get/${user?.subSysId}`
      );
      setSubSysInfo(data);
    } catch (error) {
      console.log(error);
    }
  };

  const onSubmit = async (formData) => {
    if (formData.logoFile === null) {
      setErrorPic("عکس خود را آپلود کنید");
    } else {
      setErrorPic("");
      if (!formData.type) {
        const reqData = {
          id: user?.subSysId,
          title: formData?.title,
          color: formData?.color,
          cityId: formData?.cityId.value,
          logoFile: formData?.logoFile,
        };
          try {
            await request.apiCall("post", "SubSys/Edit", reqData);
            toast.success("اطلاعات با موفقیت بروز شد");
          } catch (error) {
            console.log(error);
          }
      }
    }
  };

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex flex-row items-center  mb-4">
        <div className="text-2xl font-black text-gray-600">پروفایل سیستم</div>
        {subSysInfo?.needToFill ? (
          <span className="mr-2 text-xs font-medium bg-red-200 text-red-800 p-1 rounded-lg">
            عدم تکمیل
          </span>
        ) : (
          <span className="mr-2 text-xs font-medium bg-lime-200 text-lime-800 p-1 rounded-lg">
            تکمیل
          </span>
        )}
      </div>
      <div className="flex flex-col rounded-xl bg-white shadow-sm p-4 h-full w-full">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div>
            <PhotoProfile
              pic={subSysInfo?.logoFile}
              userId={subSysInfo?.id}
              profileSystem={getSubSys}
            />
            {errorPic && (
              <span className="text-red-600 text-xs block mb-4 -mt-2 mr-4">
                {errorPic}
              </span>
            )}
          </div>
          <div className="sm:grid sm:grid-cols-2 gap-4 text-right">
            <div className="flex flex-col space-y-2">
              <label className="text-xs text-gray-600" htmlFor="title">
                عنوان
              </label>
              <TextInput name={"title"} register={register} />
              {errors.title && (
                <p className="text-red-600 text-xs">{errors.title.message}</p>
              )}
            </div>
            <div className="flex flex-col space-y-1">
              <label className="text-xs text-gray-600 mt-2 sm:mt-1" htmlFor="family">
                رنگ
              </label>
              <input
                type="color"
                name={"color"}
                {...register("color")}
                className="input-primary h-9 !p-0.5"
              />
              {errors.color && (
                <p className="text-red-600 text-xs">{errors.color.message}</p>
              )}
            </div>
            <div>
              <label htmlFor="state" className="text-xs text-gray-600 mb-4">
                استان
              </label>
              <Controller
                name="stateId"
                control={control}
                render={({ field }) => (
                  <SelectboxForm
                    field={field}
                    value={statesApi}
                    options={states.map((item) => ({
                      label: item?.title,
                      value: item?.id,
                    }))}
                  />
                )}
              />
              {errors.stateId && (
                <div className="text-red-600 text-xs mt-2">
                  لطفا استان را انتخاب کنید
                </div>
              )}
            </div>

            <div>
              <label htmlFor="city" className="text-xs text-gray-600 mb-4">
                شهر
              </label>
              <Controller
                name="cityId"
                control={control}
                render={({ field }) => (
                  <SelectboxForm
                    field={field}
                    value={citiesApi}
                    options={cities.map((item) => ({
                      label: item?.title,
                      value: item?.id,
                    }))}
                  />
                )}
              />
              {errors.cityId && (
                <div className="text-red-600 text-xs mt-2">
                  لطفا شهر را انتخاب کنید
                </div>
              )}
            </div>
          </div>
        </form>
        <div className="flex justify-end w-full">
        <button
          type="submit"
          disabled={request.loading}
          className="btn-primary my-4 w-fit"
          onClick={handleSubmit(onSubmit)}
        >
          {!request.loading ? (
            " ثبت تغییرات"
          ) : (
            <BeatLoaderLoading size={20} color="#fff" />
          )}
        </button>
        </div>
      </div>
    </div>
  );
};

export default SubSystemProfile;
