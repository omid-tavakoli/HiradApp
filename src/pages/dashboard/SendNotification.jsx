import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import useApi from "../../hooks/useApi";
import BeatLoaderLoading from "../../ui/element/loading/BeatLoader";
import * as yup from "yup";
import TextArea from "../../ui/forms/dynamic-form/fields/TextArea";
import { useState, useEffect } from "react";
import { useUser } from "../../contexts/UserContext";
import SelectboxForm from "../../ui/element/SelectboxForm";
import toast from "react-hot-toast";

const schema = yup.object().shape({
  subUserId: yup.object().shape({
    value: yup.string().required("لطفا کاربر مورد نظر را انتخاب کنید"),
  }),
  text: yup.string().required("لطفا پیام را وارد کنید"),
});

const SendNotification = () => {
  const [users, setUsers] = useState([]);

  const requestGet = useApi();
  const request = useApi();
  const { user } = useUser();

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    user && getUsers();
  }, [user]);

  const getUsers = async () => {
    try {
      const { data } = await requestGet.apiCall(
        "get",
        `User/GetAllSubUser/${user?.subSysId}`
      );
      setUsers(data);
    } catch (error) {
      console.log(error);
    }
  };

  const onSubmit = async (formData) => {
    const reqData = {
      senderId: user.userId,
      subUserId: formData.subUserId?.value,
      text: formData.text,
    };

    if (!formData.type) {
      try {
        const { data } = await request.apiCall(
          "post",
          "Notification/Add",
          reqData
        );
        toast.success("عملیات با موفقیت انجام شد");
      } catch (error) {
        console.log(error);
      }
    }
  };
  return (
    <div className="flex flex-col space-y-4">
      <div className="flex flex-col space-y-4 mb-4">
        <div className="text-2xl font-black text-gray-600">ارسال پیام</div>
        <span className="mr-2 text-gray-500">
          در این صفحه میتوانید برای کاربر پیامی جهت هشدار،یادآوری و... با متن
          دلخواه ارسال نمایید.
        </span>
      </div>
      <div className="flex flex-col rounded-xl bg-white shadow-sm p-4 h-full w-full">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-4 text-right">
            <div className="sm:w-1/3">
              <label htmlFor="subUser" className="block text-xs sm:text-base text-gray-600 mb-2">
                گیرنده پیام
              </label>
              <Controller
                name="subUserId"
                control={control}
                render={({ field }) => (
                  <SelectboxForm
                    placeholder="کاربر مورد نظر را انتخاب کنید"
                    field={field}
                    options={users?.map((item) => ({
                      label: item.family
                        ? `${item.name} ${item.family}`
                        : `${item.mobile}`,
                      value: item.id,
                    }))}
                  />
                )}
              />
              {errors.subUserId && (
                <p className="text-primary-600 text-xs">
                  {errors.subUserId.message}
                </p>
              )}
            </div>
            <div className="flex flex-col space-y-2 sm:w-1/2">
              <label className="text-xs sm:text-base text-gray-600" htmlFor="text">
              محتوای پیام
              </label>
              <TextArea name={"text"} register={register} placeholder={"متن پیام خود را وارد نمایید"}/>
              {errors.text && (
                <p className="text-primary-600 text-xs">{errors.text.message}</p>
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
              "ارسال پیام"
            ) : (
              <BeatLoaderLoading size={20} color="#fff" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SendNotification;
