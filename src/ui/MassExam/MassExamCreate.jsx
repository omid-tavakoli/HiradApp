import * as yup from "yup";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import SelectboxForm from "../element/SelectboxForm";
import { useEffect, useState } from "react";
import MassExamList from "./MassExamList";
import ModalAction from "../ModalAction";
import { useUser } from "../../contexts/UserContext";
import useApi from "../../hooks/useApi";
import toast from "react-hot-toast";

const schema = yup.object().shape({
  title: yup.string().required("عنوان را وارد کنید"),
  skgIds: yup
    .array()
    .of(
      yup.object().shape({
        value: yup.number().required("لطفا دسته بندی مورد نظر را انتخاب کنید"),
        label: yup.string().required("لطفا دسته بندی مورد نظر را انتخاب کنید"),
      })
    )
    .required("لطفا دسته بندی مورد نظر را انتخاب کنید"),
});
const MassExamCreate = ({ onNext, setSelectedProject, selectedProject }) => {
  const [SKG, setSKG] = useState([]);
  const [modalContent, setModalContent] = useState(null);
  const [showModal, setShowModal] = useState([]);
  const [projects, setProjects] = useState([]);
  const [subSysKindId, setSubSysKindId] = useState([]);
  const { user } = useUser();
  const requestGetlist = useApi();
  const request = useApi();

  const {
    handleSubmit,
    register,
    control,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    user && getListData();
  }, [user]);

  useEffect(() => {
    subSysKindId.length && getSKG();
  }, [subSysKindId]);

  const getListData = async () => {
    try {
      const { data } = await requestGetlist.apiCall(
        "get",
        `Project/GetList?subSysId=${user?.subSysId}`
      );
      setProjects(data);
    } catch (error) {
      console.log(error);
    }
  };

  const getSKG = async () => {
    try {
      const { data } = await requestGetlist.apiCall(
        "get",
        `SKGroup/GetList/${user?.subSysId}/${subSysKindId}`
      );
      data ? setSKG(data) : setSKG([]);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmitForm = async (data) => {
    !data.type && onSubmit(data);
  };
  const handleSelectProject = () => {
    setModalContent({
      title: `${
        user?.role?.listSystemSet?.filter((item) => item.number == 2)[0]
          ?.fieldValue
          ? user?.role?.listSystemSet?.filter((item) => item.number == 2)[0]
              ?.fieldValue
          : "پروژه"
      } ها`,
      children: (
        <MassExamList
          data={projects}
          selectedProject={selectedProject}
          setSelectedProject={setSelectedProject}
          setSubSysKindId={setSubSysKindId}
          setShowModal={setShowModal}
        />
      ),
    });
    setShowModal(true);
  };
  const onSubmit = async (data) => {
    const reqData = {
      title: data?.title,
      subProjectIds: selectedProject,
      skGroupIds: data?.skgIds?.map((item) => item.value),
    };
    try {
      const response = await request.apiCall("post", "Exam/AddAll", reqData);
      if (response?.isSuccess) {
        toast.success(
          `${
            user?.role?.listSystemSet?.filter((item) => item.number == 4)[0]
              ?.fieldValue
              ? user?.role?.listSystemSet?.filter((item) => item.number == 4)[0]
                  ?.fieldValue
              : "ارزیابی"
          } با موفقیت اضافه شد`
        );
        onNext();
      }
    } catch (error) {
      console.log("ERR", error);
    }
  };

  return (
    <div>
      <div className="bg-white mt-8 rounded-xl shadow-sm">
        <form
          onSubmit={handleSubmit(handleSubmitForm)}
          className="sm:grid sm:grid-cols-2 gap-4 xl:gap-x-20"
        >
          <div className="space-y-2">
            <label htmlFor="title" className="text-xs text-gray-600 mb-4">
              عنوان{" "}
              {user?.role?.listSystemSet?.filter((item) => item.number == 4)[0]
                ?.fieldValue
                ? user?.role?.listSystemSet?.filter(
                    (item) => item.number == 4
                  )[0]?.fieldValue
                : "ارزیابی"}
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
          <div className=" flex flex-col space-y-2">
            <label htmlFor="title" className="text-xs text-gray-600 ">
              {user?.role?.listSystemSet?.filter((item) => item.number == 2)[0]
                ?.fieldValue
                ? user?.role?.listSystemSet?.filter(
                    (item) => item.number == 2
                  )[0]?.fieldValue
                : "پروژه"}
            </label>
            <button
              type="button"
              className="btn-primary w-36"
              onClick={handleSelectProject}
            >
              انتخاب{" "}
              {user?.role?.listSystemSet?.filter((item) => item.number == 2)[0]
                ?.fieldValue
                ? user?.role?.listSystemSet?.filter(
                    (item) => item.number == 2
                  )[0]?.fieldValue
                : "پروژه"}
            </button>
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
              <div className="text-primary-600 text-xs">
                لطفا دسته بندی را مشخص کنید
              </div>
            )}
          </div>
          <div className="flex justify-end col-span-2 mt-6">
            <button
              onClick={() => handleSubmit(handleSubmitForm)}
              className="btn-primary w-28"
            >
            ثبت اطلاعات
            </button>
          </div>
        </form>
      </div>
      {showModal && modalContent && (
        <ModalAction
          {...modalContent}
          show={showModal}
          onClose={() => setShowModal(false)}
          width={'w-[41rem]'}
        />
      )}
    </div>
  );
};

export default MassExamCreate;
