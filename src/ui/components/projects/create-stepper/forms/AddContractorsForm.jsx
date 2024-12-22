import { useState, useEffect, Fragment } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Combobox, Transition } from "@headlessui/react";
import {
  CheckIcon,
  ChevronUpDownIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";

import useApi from "../../../../../hooks/useApi";
import { useUser } from "../../../../../contexts/UserContext";
import DatePicker from "react-multi-date-picker";
import persian_fa from "react-date-object/locales/persian_fa";
import persian from "react-date-object/calendars/persian";
import transition from "react-element-popper/animations/transition";
import { Controller } from "react-hook-form";
import "../../../../../assets/styles/datePicker.css";
import * as yup from "yup";

const schema = yup.object().shape({
});

const AddContractorsForm = ({
  projectId,
  onSubmitTitle,
  onClose,
  onSubmit,
  defaultValues,
  id,
}) => {
  const [selectedUser, setSelectedUser] = useState([]);
  const [subUserList, setSubUserList] = useState([]);
  const [querySubType, setQuerySubType] = useState("");

  const [selectedContractor, setSelectedContractor] = useState([]);
  const [contractorList, setContractorList] = useState([]);
  const [queryContractor, setQueryContractor] = useState("");


  const requestGetlist = useApi();
  const { user } = useUser();

  const {
    handleSubmit,
    control,
    register,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    if (user) {
      getListSubUser();
      getListContractor();
    }
  }, []);

  const getListSubUser = async () => {
    try {
      const { data } = await requestGetlist.apiCall(
        "get",
        `User/GetAllSubUser/${user?.subSysId}`
      );

      setSubUserList(data);
      setSelectedUser(data[0]);
    } catch (error) {
      console.log(error);
    }
  };

  const getListContractor = async () => {
    try {
      const { data } = await requestGetlist.apiCall(
        "get",
        `Contractor/GetSubContractorList?subSysId=${user?.subSysId}`
      );

      setContractorList(data);
      setSelectedContractor(data[0]);
    } catch (error) {
      console.log(error);
    }
  };

  const filteredSubTypes =
    querySubType === ""
      ? subUserList
      : subUserList?.filter((type) =>
          type.name
            .toLowerCase()
            .replace(/\s+/g, "")
            .includes(querySubType.toLowerCase().replace(/\s+/g, ""))
        );

  const filteredContractor =
    queryContractor === ""
      ? contractorList
      : contractorList?.filter((type) =>
          type.name
            .toLowerCase()
            .replace(/\s+/g, "")
            .includes(querySubType.toLowerCase().replace(/\s+/g, ""))
        );

  const onSubmitForm = async (data) => {
    !data.type &&
      onSubmit(
        {
          ...data,
          subUserId: selectedUser?.userId,
          contractorId: selectedContractor?.id,
          projectId: projectId,
        },
        id
      );
  };

  const getUser = (item) =>
    `${item.family ? item.name + " " + item.family : item.mobile}`;

  return (
    <>
      <div className="flex flex-col">
        <form
          onSubmit={handleSubmit(onSubmitForm)}
          className="sm:grid sm:grid-cols-2 gap-4 text-right"
        >
          <div>
            <label htmlFor="state" className="text-xs text-gray-600 mb-4">
              کاربر
            </label>
            <Combobox value={selectedUser} onChange={setSelectedUser}>
              <div className="relative mt-1">
                <div className="form-input block w-full rounded-md border-0 py-[1px] text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-400 sm:text-sm sm:leading-6">
                  <Combobox.Input
                    className="w-full border-none py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 focus:ring-0"
                    displayValue={getUser}
                    onChange={(event) => setQuerySubType(event.target.value)}
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
                  afterLeave={() => setQuerySubType("")}
                >
                  <Combobox.Options className="absolute mt-1 z-10 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
                    {filteredSubTypes.length === 0 && querySubType !== "" ? (
                      <div className="relative cursor-default select-none px-4 py-2 text-gray-700">
                        موردی یافت نشد
                      </div>
                    ) : (
                      !filteredSubTypes.length == 0 &&
                      filteredSubTypes?.map((subType, index) => (
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
                          {({ selectedUser, active }) => (
                            <>
                              <span
                                className={`block truncate ${
                                  selectedUser ? "font-medium" : "font-normal"
                                }`}
                              >
                                {getUser(subType)}
                              </span>
                              {selectedUser ? (
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
          </div>
          <div>
            <label htmlFor="state" className="text-xs text-gray-600 mb-4">
            {user?.role?.listSystemSet?.filter(item => item.number == 5 )[0]?.fieldValue2 ? user?.role?.listSystemSet?.filter(item => item.number == 5 )[0]?.fieldValue2 : 'پیمانکار'}
            </label>
            <Combobox
              value={selectedContractor}
              onChange={setSelectedContractor}
            >
              <div className="relative mt-1">
                <div className="form-input block w-full rounded-md border-0 py-[1px] text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-400 sm:text-sm sm:leading-6">
                  <Combobox.Input
                    className="w-full border-none py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 focus:ring-0"
                    displayValue={getUser}
                    onChange={(event) => setQueryContractor(event.target.value)}
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
                  afterLeave={() => setQuerySubType("")}
                >
                  <Combobox.Options className="absolute mt-1 z-10 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
                    {filteredContractor.length === 0 && querySubType !== "" ? (
                      <div className="relative cursor-default select-none px-4 py-2 text-gray-700">
                        موردی یافت نشد
                      </div>
                    ) : (
                      !filteredContractor.length == 0 &&
                      filteredContractor?.map((subType, index) => (
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
                          {({ selectedContractor, active }) => (
                            <>
                              <span
                                className={`block truncate ${
                                  selectedContractor
                                    ? "font-medium"
                                    : "font-normal"
                                }`}
                              >
                                {getUser(subType)}
                              </span>
                              {selectedContractor ? (
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
          </div>
        </form>

        <div className=" px-4 pt-4 sm:flex sm:flex-row sm:justify-center sm:px-6">
          <button
            type="submit"
             
            className="inline-flex w-full justify-center rounded-md bg-primary-800 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 sm:ml-3 sm:w-auto"
            onClick={handleSubmit(onSubmitForm)}
          >
            {onSubmitTitle}
          </button>
          <button
            type="button"
            className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
            onClick={onClose}
          >
            بستن
          </button>
        </div>
      </div>
    </>
  );
};

export default AddContractorsForm;
