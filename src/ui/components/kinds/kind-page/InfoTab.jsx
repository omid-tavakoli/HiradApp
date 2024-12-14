import useApi from "../../../../hooks/useApi";
import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import BeatLoaderLoading from "../../../element/loading/BeatLoader";
import toast from "react-hot-toast";
import { useUser } from "../../../../contexts/UserContext";
import SelectboxForm from "../../../element/SelectboxForm";

const schema = yup.object().shape({
  title: yup.string().required("عنوان را وارد کنید"),
  description: yup.string(),
});

const InfoTab = ({ kindId }) => {
  const [list, setList] = useState([]);
  const [subKinds, setSubKinds] = useState([]);
  const request = useApi();

  useEffect(() => {
    getListData();
  }, []);

  const getListData = async () => {
    try {
      const { data } = await request.apiCall(
        "get",
        `SubSysKind/GetSubSysKind/${kindId}`
      );
      setList(data);
    } catch (error) {
      console.log(error);
    }
  };

  const [subTypes, setSubTypes] = useState([]);

  const [selectedSubType, setSelectedSubType] = useState(subTypes[0]);

  const [querySubType, setQuerySubType] = useState("");

  const requestGetSubTypes = useApi();
  const requestGetSubKinds = useApi();
  const requestSubmit = useApi();

  const { user } = useUser();

  const {
    handleSubmit,
    reset,
    register,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });
  useEffect(() => {
    reset(list);
  }, [list, reset]);

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
      setSelectedSubType(data[0]);
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

  const filteredSubTypes =
    querySubType === ""
      ? subTypes
      : subTypes?.filter((type) =>
          type.title
            .toLowerCase()
            .replace(/\s+/g, "")
            .includes(querySubType.toLowerCase().replace(/\s+/g, ""))
        );

  const handleSubmitForm = async (data) => {
    !data.type && onSubmit(data);
  };

  const onSubmit = async (data) => {
    const reqData = {
      ...data,
      subSysId: user?.subSysId,
      id: kindId,
      subTypeId: subTypes.length == 1 ? subTypes[0]?.id : selectedSubType?.id,
      parentSubSysKindId: data?.parentSubSysKind?.value || null,
    };
    try {
      const response = await requestSubmit.apiCall(
        "post",
        `SubSysKind/Edit`,
        reqData
      );
      if (response?.isSuccess) {
        toast.success(
          `${
            user?.role?.listSystemSet?.filter((item) => item.number == 11)[0]
              ?.fieldValue
              ? user?.role?.listSystemSet?.filter(
                  (item) => item.number == 11
                )[0]?.fieldValue
              : "زیرمجموعه"
          } با موفقیت ویرایش شد`
        );
        getListData();
      }
    } catch (error) {
      console.log("ERR", error);
    }
  };

  return (
    <div>
      {!request.loading ? (
        <form
          onSubmit={handleSubmit(handleSubmitForm)}
          className="sm:grid sm:grid-cols-2 gap-4"
        >
          <div
            className={`mb-2 space-y-2 ${subTypes.length == 1 && "col-span-2"}`}
          >
            <label htmlFor="title" className="text-xs text-gray-600 mb-4">
              عنوان
            </label>
            <input
              type="text"
              {...register("title")}
              defaultValue={list?.title || ""}
              className="form-input block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-400 sm:text-sm sm:leading-6"
            />
            {errors.title && (
              <p className="text-red-600 text-xs">{errors.title.message}</p>
            )}
          </div>

          <div
            className={`mb-2 space-y-2 ${subTypes.length == 1 && "col-span-2"}`}
          >
            <label
              htmlFor="parentSubSysKind"
              className="text-xs text-gray-600 mb-4"
            >
              {user?.role?.listSystemSet?.filter((item) => item.number == 11)[0]
                ?.fieldValue
                ? user?.role?.listSystemSet?.filter(
                    (item) => item.number == 11
                  )[0]?.fieldValue
                : "زیرمجموعه"}{" "}
              والد
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
              <p className="text-red-600 text-xs">
                {errors.parentSubSysKindId.message}
              </p>
            )}
          </div>

          {!subTypes.length == 1 && (
            <div className="mb-2 space-y-2">
              <label htmlFor="title" className="text-xs text-gray-600 mb-4">
                نوع
              </label>
              <input
                type="text"
                disabled
                defaultValue={list?.subTypeTitle || ""}
                className="input-primary !text-gray-500"
              />
              {errors.title && (
                <p className="text-red-600 text-xs">{errors.title.message}</p>
              )}
            </div>
          )}
          <div className="mb-2 space-y-2 col-span-2">
            <label htmlFor="description" className="text-xs text-gray-600 mb-4">
              توضیحات
            </label>

            <textarea
              type="textarea"
              {...register("description")}
              defaultValue={list?.description || ""}
              className="form-input block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-400 sm:text-sm sm:leading-6"
            />

            {errors.description && (
              <p className="text-red-600 text-xs">
                {errors.description.message}
              </p>
            )}
          </div>
        </form>
      ) : (
        <div className="w-full flex justify-center">
          <BeatLoaderLoading />
        </div>
      )}
      <div className="flex justify-end w-full">
        <button
          onClick={handleSubmit(handleSubmitForm)}
          className="btn-primary mt-4"
        >
          ثبت تغییرات
        </button>
      </div>
    </div>
  );
};

export default InfoTab;
