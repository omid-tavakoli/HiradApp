import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import useApi from "../../../hooks/useApi";
import BeatLoaderLoading from "../../element/loading/BeatLoader";
import * as yup from "yup";
import TextInput from "../../forms/dynamic-form/fields/TextInput";
import DateInput from "../../forms/dynamic-form/fields/DateInput";
import TextArea from "../../forms/dynamic-form/fields/TextArea";
import { useState, useEffect } from "react";
import { useUser } from "../../../contexts/UserContext";
import toast from "react-hot-toast";
import PhotoProfile from "./PhotoProfile";
import SelectboxForm from "../../element/SelectboxForm";

const schema = yup.object().shape({
  name: yup
    .string()
    .min(2, "خیلی کوتاه است!")
    .max(50, "خیلی طولانی است!")
    .required("لطفا نام را وارد کنید"),
  family: yup
    .string()
    .min(2, "خیلی کوتاه است!")
    .max(50, "خیلی طولانی است!")
    .required("لطفا نام خانوادگی را وارد کنید"),

  userName: yup
    .string()
    .min(7, "نام کاربری باید حداقل 8 کاراکتر باشد")
    .required("لطفا نام کاربری را وارد کنید"),
  nationalCode: yup
    .string()
    .required("لطفا کد ملی را وارد کنید")
    .matches(/^[0-9]{10}$/, "کد ملی معتبر نیست"),
  birthdate: yup.string().required("لطفا تاریخ تولد را وارد کنید"),
  address: yup
    .string()
    .min(2, "خیلی کوتاه است!")
    .required("لطفا آدرس را وارد کنید"),
  telephone: yup
    .string()
    .required("لطفا شماره تلفن را وارد کنید")
    .matches(/^0\d{2}3\d{7}$/, "شماره تلفن معتبر نیست"),

  baleId: yup.string().nullable(),

  whatsappId: yup.string().nullable(),

  telegramId: yup.string().nullable(),

  eitaId: yup.string().nullable(),
});

const PersonalInformation = ({ setUserData }) => {
  const [defaultValues, setDefaultValues] = useState([]);

  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [statesApi, setStatesApi] = useState();
  const [citiesApi, setCitiesApi] = useState();
  const { updateUser } = useUser();

  const [errorPic, setErrorPic] = useState("");

  const requestGetUser = useApi();

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
    if (user) getUser();
    getListState();
  }, [user]);

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  useEffect(() => {
    if (watch("stateId") || defaultValues?.stateId) {
      getListCity();
    }
  }, [watch("stateId"), defaultValues?.stateId]);

  useEffect(() => {
    if (defaultValues) {
      reset({
        ...defaultValues,
        birthdate: defaultValues.birthdate,
        stateId: { label: defaultValues.state, value: defaultValues.stateId },
        cityId: { label: defaultValues.city, value: defaultValues.cityId },
      });
    }
  }, [defaultValues, reset]);


  const getUser = async () => {
    try {
      const { data } = await requestGetUser.apiCall(
        "get",
        `User/Get/${user?.userId}`
      );
      setDefaultValues(data);
      setUserData({ mobile: data?.mobile, email: data?.email, id: data?.id });
    } catch (error) {
      console.log(error);
    }
  };

  const getListState = async () => {
    try {
      const { data } = await request.apiCall("get", "State/GetList");
      setStates(data);
    } catch (error) {
      console.log(error);
    }
  };

  const getListCity = async () => {
    const selectedStateId = watch("stateId")?.value || defaultValues.stateId;
    if (!selectedStateId) {
      return;
    }
    try {
      const { data } = await request.apiCall(
        "get",
        `City/GetList/${selectedStateId}`
      );
      setCities(data);
    } catch (error) {
      console.log(error);
    }
  };

              
  const getUserInfo = async (id, token) => {
    const { data } = await request.apiCall(
      "get",
      `User/GetUserInfo/${id || user?.userId}`,
      undefined,
      {
        Authorization: `Bearer ${token || user?.accessToken?.access_token}`,
      }
    );
    updateUser(data);
  };

  const onSubmitForm = async (data) => {
    if (data.pic === null) {
      setErrorPic("عکس خود را آپلود کنید");
    } else {
      setErrorPic("");
      if (!data.type) {
        try {
          const response = await request.apiCall("post", `User/FillProfile`, {
            ...data,
            cityId: data.cityId.value,
            stateId: data.stateId.value,
            id: user?.userId,
            status: 1,
          });
          if (response?.isSuccess) {
            toast.success("اطلاعات حساب با موفقیت بروز شد");
            getUser();
            getUserInfo()
          }
        } catch (error) {
          toast.error(error?.response?.data?.data?.nationalCode[0]);
        }
      }
    }
  };

  return (
    <div className="flex flex-col">
      <div className="text-xl font-black text-gray-600 mb-4">اطلاعات حساب</div>
      <span className="mr-2  text-gray-500">
        اطلاعات فردی خود را تکمیل کنید و برای تایید آن دکمه ثبت تغییرات را بزنید
      </span>
      <div>
        <PhotoProfile pic={defaultValues?.pic} userId={defaultValues?.id} />
        {errorPic && (
          <span className="text-primary-600 text-xs block mb-4 -mt-2 mr-4">
            {errorPic}
          </span>
        )}
      </div>
      <form onSubmit={handleSubmit(onSubmitForm)}>
        <div className="sm:grid sm:grid-cols-3 space-y-4 sm:space-y-0 gap-4 text-right">
          <div className="flex flex-col space-y-2">
            <label className="text-xs text-gray-600" htmlFor="name">
              نام
            </label>
            <TextInput
              name={"name"}
              register={register}
              defaultValue={defaultValues.name || ""}
            />
            {errors.name && (
              <p className="text-primary-600 text-xs">{errors.name.message}</p>
            )}
          </div>
          <div className="flex flex-col space-y-2">
            <label className="text-xs text-gray-600" htmlFor="family">
              نام خانوادگی
            </label>
            <TextInput
              name={"family"}
              register={register}
              defaultValue={defaultValues.family || ""}
            />
            {errors.family && (
              <p className="text-primary-600 text-xs">{errors.family.message}</p>
            )}
          </div>
          <div className="flex flex-col space-y-2">
            <label className="text-xs text-gray-600" htmlFor="userName">
              نام کاربری
            </label>
            <TextInput
              name={"userName"}
              register={register}
              defaultValue={defaultValues.userName || ""}
            />
            {errors.userName && (
              <p className="text-primary-600 text-xs">{errors.userName.message}</p>
            )}
          </div>
          <div className="flex flex-col space-y-2">
            <label className="text-xs text-gray-600" htmlFor="nationalCode">
              کد ملی
            </label>
            <TextInput
              name={"nationalCode"}
              register={register}
              defaultValue={defaultValues.nationalCode || ""}
            />
            {errors.nationalCode && (
              <p className="text-primary-600 text-xs">
                {errors.nationalCode.message}
              </p>
            )}
          </div>
          <div className="flex flex-col space-y-2">
            <label className="text-xs text-gray-600" htmlFor="telephone">
              تلفن
            </label>
            <TextInput
              name={"telephone"}
              register={register}
              defaultValue={defaultValues.telephone || ""}
            />
            {errors.telephone && (
              <p className="text-primary-600 text-xs">{errors.telephone.message}</p>
            )}
          </div>
          <div className="flex flex-col space-y-2">
            <label className="text-xs text-gray-600" htmlFor="birthdate">
              تاریخ تولد
            </label>
            <DateInput
              name={"birthdate"}
              register={register}
              control={control}
              defaultValue={defaultValues.birthdate || ""}
            />
            {errors.birthdate && (
              <p className="text-primary-600 text-xs">{errors.birthdate.message}</p>
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
              <div className="text-primary-600 text-xs mt-2">
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
              <div className="text-primary-600 text-xs mt-2">
                لطفا شهر را انتخاب کنید
              </div>
            )}
          </div>
          <div className="flex flex-col space-y-2 col-span-3">
            <label className="text-xs text-gray-600" htmlFor="address">
              آدرس
            </label>
            <TextArea
              name={"address"}
              register={register}
              defaultValue={defaultValues.address || ""}
            />
            {errors.address && (
              <p className="text-primary-600 text-xs">{errors.address.message}</p>
            )}
          </div>
          <div className="text-xl font-black text-gray-600 my-4 col-span-3">
            راه های ارتباطی
          </div>
          <div className="flex flex-col space-y-2">
            <label className="text-xs text-gray-600" htmlFor="telegramId">
              تلگرام
            </label>
            <TextInput
              name={"telegramId"}
              register={register}
              defaultValue={defaultValues.telegramId || ""}
            />
            {errors.telegramId && (
              <p className="text-primary-600 text-xs">
                {errors.telegramId.message}
              </p>
            )}
          </div>
          <div className="flex flex-col space-y-2">
            <label className="text-xs text-gray-600" htmlFor="whatsappId">
              وات ساپ
            </label>
            <TextInput
              name={"whatsappId"}
              register={register}
              defaultValue={defaultValues.whatsappId || ""}
            />
            {errors.whatsappId && (
              <p className="text-primary-600 text-xs">
                {errors.whatsappId.message}
              </p>
            )}
          </div>
          <div className="flex flex-col space-y-2">
            <label className="text-xs text-gray-600" htmlFor="gapId">
              گپ
            </label>
            <TextInput
              name={"gapId"}
              register={register}
              defaultValue={defaultValues.gapId || ""}
            />
            {errors.gapId && (
              <p className="text-primary-600 text-xs">{errors.gapId.message}</p>
            )}
          </div>
          <div className="flex flex-col space-y-2">
            <label className="text-xs text-gray-600" htmlFor="eitaId">
              ایتا
            </label>
            <TextInput
              name={"eitaId"}
              register={register}
              defaultValue={defaultValues.eitaId || ""}
            />
            {errors.eitaId && (
              <p className="text-primary-600 text-xs">{errors.eitaId.message}</p>
            )}
          </div>
          <div className="flex flex-col space-y-2">
            <label className="text-xs text-gray-600" htmlFor="baleId">
              بله
            </label>
            <TextInput
              name={"baleId"}
              register={register}
              defaultValue={defaultValues.baleId || ""}
            />
            {errors.baleId && (
              <p className="text-primary-600 text-xs">{errors.baleId.message}</p>
            )}
          </div>
        </div>
      </form>
      <div className="flex justify-end w-full">
      <button
        type="submit"
        disabled={request.loading}
        className="btn-primary my-4 w-fit"
        onClick={handleSubmit(onSubmitForm)}
      >
        {!request.loading ? (
          " ثبت تغییرات"
        ) : (
          <BeatLoaderLoading size={20} color="#fff" />
        )}
      </button>
      </div>
    </div>
  );
};

export default PersonalInformation;
