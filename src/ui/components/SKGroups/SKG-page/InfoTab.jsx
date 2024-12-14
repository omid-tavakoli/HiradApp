import { useState, useEffect, Fragment } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Combobox, Transition } from "@headlessui/react";
import useApi from "../../../../hooks/useApi";
import { useUser } from "../../../../contexts/UserContext";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";

import {
  CheckIcon,
  ChevronUpDownIcon,
  PlusIcon,
} from "@heroicons/react/20/solid";

const schema = yup.object().shape({
  title: yup.string().required("عنوان را وارد کنید"),
  description: yup.string().required("توضیحات را وارد کنید"),
});

const InfoTab = ({ skgroupId }) => {
  const [SKGroup, setSKGroup] = useState([]);
  const [subKinds, setSubKinds] = useState([]);
  const [subSyskindName, setSubSyskindName] = useState();
  const [selectedSubKind, setSelectedSubKind] = useState();
  const [querySubKind, setQuerySubKind] = useState("");

  const requestGetSubKinds = useApi();
  const requestGetSKGroup = useApi();

  const requestSubmit = useApi();

  const { user } = useUser();
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { SKGroup },
  });

  useEffect(() => {
    getSKGroup();
  }, []);

  useEffect(() => {
    reset(SKGroup);
  }, [SKGroup, reset]);

  useEffect(() => {
    if (user) {
      getSubKinds();
    }
  }, [user , subSyskindName]);

  const getSKGroup = async () => {
    try {
      const { data } = await requestGetSKGroup.apiCall(
        "get",
        `SKGroup/Get/${skgroupId}`
      );
      setSKGroup(data);
      setSubSyskindName(data.subSyskindName)
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
      setSelectedSubKind(data.filter((item) => item.title === subSyskindName)[0]);
    } catch (error) {
      console.log(error);
    }
  };

  const filteredSubKinds =
    querySubKind === ""
      ? subKinds
      : subKinds?.filter((type) =>
          type.title
            .toLowerCase()
            .replace(/\s+/g, "")
            .includes(querySubKind.toLowerCase().replace(/\s+/g, ""))
        );

  const handleSubmitForm = async (data) => {
    !data.type && onSubmit(data);
  };

  const onSubmit = async (data) => {
    const reqData = {
      ...data,
      id: SKGroup.id,
      subSyskindId: selectedSubKind.id,
    };

    try {
      const response = await requestSubmit.apiCall(
        "post",
        `SKGroup/Edit`,
        reqData
      );
      if (response?.isSuccess) {
        toast.success("دسته بندی با موفقیت آپدیت شد");
      }
    } catch (error) {
      console.log("ERR", error);
    }
  };
  return (
    <div>
      <form
        onSubmit={handleSubmit(handleSubmitForm)}
        className="sm:grid sm:grid-cols-2 sm:gap-x-4 sm:gap-y-2"
      >
        <div className="mb-2 space-y-2">
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

        <div className="mb-2">
          <label htmlFor="state" className="text-xs text-gray-600 mb-4">
          {user?.role?.listSystemSet?.filter(item => item.number == 11 )[0]?.fieldValue ? user?.role?.listSystemSet?.filter(item => item.number == 11 )[0]?.fieldValue : 'زیرمجموعه'}
          </label>
          <div className="flex flex-row items-center mt-1">
            <Combobox
              value={selectedSubKind || null}
              onChange={setSelectedSubKind}
              className="w-full"
            >
              <div className="relative mt-1">
                <div className="form-input block w-full rounded-md border-0 py-[1px] text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-400 sm:text-sm sm:leading-6">
                  <Combobox.Input
                    className="w-full border-none py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 focus:ring-0"
                    displayValue={(subType) => subType?.title}
                    onChange={(event) => setQuerySubKind(event.target.value)}
                  />
                  <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
                    <ChevronUpDownIcon
                      className="h-5 w-5 text-gray-400"
                      aria-hidden="true"
                    />
                  </Combobox.Button>
                </div>
                <Transition
                  as={Fragment}
                  leave="transition ease-in duration-100"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                  afterLeave={() => setQuerySubKind("")}
                >
                  <Combobox.Options className="absolute mt-1 z-10 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
                    {filteredSubKinds.length === 0 && querySubKind !== "" ? (
                      <div className="relative cursor-default select-none px-4 py-2 text-gray-700">
                        موردی یافت نشد
                      </div>
                    ) : (
                      !filteredSubKinds.length == 0 &&
                      filteredSubKinds?.map((subType, index) => (
                        <Combobox.Option
                          key={index}
                          className={({ active }) =>
                            `relative cursor-default select-none py-2 pl-10 pr-4 ${
                              active
                                ? "bg-primary-800 text-white"
                                : "text-gray-900"
                            }`
                          }
                          value={subType}
                        >
                          {({ selectedSubKind, active }) => (
                            <>
                              <span
                                className={`block truncate ${
                                  selectedSubKind
                                    ? "font-medium"
                                    : "font-normal"
                                }`}
                              >
                                {subType.title}
                              </span>
                              {selectedSubKind ? (
                                <span
                                  className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                                    active ? "text-white" : "text-primary-800"
                                  }`}
                                >
                                  <CheckIcon
                                    className="h-5 w-5"
                                    aria-hidden="true"
                                  />
                                </span>
                              ) : null}
                            </>
                          )}
                        </Combobox.Option>
                      ))
                    )}
                  </Combobox.Options>
                </Transition>
              </div>
            </Combobox>
            <a
              className="mr-2 cursor-pointer bg-primary-200 text-primary-800 p-1 rounded-full"
              onClick={() => window.open("/dashboard/kinds/create", "blank")}
            >
              <PlusIcon className="w-4 h-4" />
            </a>
          </div>
        </div>

        <div className="mb-2 space-y-2 col-span-2">
          <label htmlFor="description" className="text-xs text-gray-600 mb-4">
            توضیحات
          </label>

          <textarea
            type="textarea"
            {...register("description")}
            className="form-input block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-400 sm:text-sm sm:leading-6"
          />

          {errors.description && (
            <p className="text-red-600 text-xs">{errors.description.message}</p>
          )}
        </div>
      </form>
      <button
        onClick={handleSubmit(handleSubmitForm)}
        className="btn-primary mt-4"
      >
        ثبت تغییرات
      </button>
    </div>
  );
};

export default InfoTab;
