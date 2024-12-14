import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import { Combobox, Transition } from "@headlessui/react";
import { useState, useEffect, Fragment } from "react";
import useApi from "../../../../../hooks/useApi";
import { useUser } from "../../../../../contexts/UserContext";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";

const kindDetailType = [
  { name: "read ", title: "خواندن", id: 1 },
  { name: "write ", title: "نوشتن", id: 2 },
  { name: "full ", title: "کامل", id: 3 },
];

const AssignedSkgForm = ({
  kindId,
  projectId,
  examSkGroupId,
  onFormChange,
}) => {
  const [selectedRole, setSelectedRole] = useState("supervisor");

  const [supervisors, setSupervisors] = useState([]);
  const [selectedSupervisors, setSelectedSupervisors] = useState(
    supervisors[0]
  );
  const [querySupervisors, setQuerySupervisors] = useState("");

  const [contractors, setContractors] = useState([]);
  const [selectedContractors, setSelectedContractors] = useState(
    contractors[0]
  );
  const [queryContractors, setQueryContractors] = useState("");

  const [selectedKindDetail, setSelectedKindDetail] = useState(
    kindDetailType[0]
  );

  const [querySubType, setQuerySubType] = useState("");

  const [formData, setFormData] = useState("");

  const requestGetSubKinds = useApi();

  const requestSubmit = useApi();

  const { user } = useUser();

  useEffect(() => {
    getSupervisors();
    getContractors();
  }, []);

  const getSupervisors = async () => {
    try {
      const { data } = await requestGetSubKinds.apiCall(
        "get",
        `Supervisor/GetList?subSysKindId=${kindId}`
      );
      setSupervisors(data);
      setSelectedSupervisors(data[0]);
    } catch (error) {
      console.log(error);
    }
  };

  const getContractors = async () => {
    try {
      const { data } = await requestGetSubKinds.apiCall(
        "get",
        `Contractor/GetContractorAdminList/${projectId}`
      );
      setContractors(data);
      setSelectedContractors(data[0]);
    } catch (error) {
      console.log(error);
    }
  };

  const handleInputTarget = (e, combo) => {
    e?.target?.name == "role" && setSelectedRole(e.target.value);
    combo == "supervisors" && setSelectedSupervisors(e);
    combo == "contractors" && setSelectedContractors(e);
    combo == "type" && setSelectedKindDetail(e);
    setFormData({ type: selectedKindDetail.id, examSkGroupId: examSkGroupId });


    if (selectedRole === "contractor") {
      setFormData({ ...formData, contractorId: selectedContractors?.userId });
    
    } else {
      setFormData({ ...formData, supervisorId: selectedSupervisors?.userId });
   
    }
    onFormChange(formData)
  };

  const filteredSupervisors =
    querySupervisors === ""
      ? supervisors
      : supervisors?.filter((type) =>
          type.name
            .toLowerCase()
            .replace(/\s+/g, "")
            .includes(querySupervisors.toLowerCase().replace(/\s+/g, ""))
        );

  const filteredContractors =
    queryContractors === ""
      ? contractors
      : contractors?.filter((type) =>
          type.userName
            .toLowerCase()
            .replace(/\s+/g, "")
            .includes(queryContractors.toLowerCase().replace(/\s+/g, ""))
        );

  const filteredSubTypes =
    querySubType === ""
      ? kindDetailType
      : kindDetailType?.filter((type) =>
          type.title
            .toLowerCase()
            .replace(/\s+/g, "")
            .includes(querySubType.toLowerCase().replace(/\s+/g, ""))
        );

  return (
    <>
      <div className="flex flex-row justify-between">
        <FormControl>
          <FormLabel id="demo-radio-buttons-group-label">نقش</FormLabel>
          <RadioGroup
            aria-labelledby="demo-radio-buttons-group-label"
            defaultValue="supervisor"
            name="role"
            onChange={(e) => handleInputTarget(e)}
          >
            <FormControlLabel
              value="supervisor"
              control={<Radio />}
              label={`${user?.role?.listSystemSet?.filter(item => item.number == 5 )[0]?.fieldValue ? user?.role?.listSystemSet?.filter(item => item.number == 5 )[0]?.fieldValue : 'ناظر'}`}
            />
            <FormControlLabel
              value="contractor"
              control={<Radio />}
              label={`${user?.role?.listSystemSet?.filter(item => item.number == 5 )[0]?.fieldValue2 ? user?.role?.listSystemSet?.filter(item => item.number == 5 )[0]?.fieldValue2 : 'پیمانکار'}`}
            />
          </RadioGroup>
        </FormControl>
        <div>
          <label htmlFor="state" className="text-xs text-gray-600 mb-4">
            نوع
          </label>

          {selectedRole === "supervisor" ? (
            <Combobox
              value={selectedSupervisors}
              name="supervisors"
              onChange={(e) => handleInputTarget(e, "supervisors")}
            >
              <div className="relative mt-1">
                <div className="form-input block w-full rounded-md border-0 py-[1px] text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-400 sm:text-sm sm:leading-6">
                  <Combobox.Input
                    className="w-full border-none py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 focus:ring-0"
                    displayValue={(subType) => subType?.name}
                    onChange={(event) =>
                      setQuerySupervisors(event.target.value)
                    }
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
                  afterLeave={() => setQuerySupervisors("")}
                >
                  <Combobox.Options className="absolute mt-1 z-10 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
                    {filteredSupervisors.length === 0 &&
                    querySupervisors !== "" ? (
                      <div className="relative cursor-default select-none px-4 py-2 text-gray-700">
                        موردی یافت نشد
                      </div>
                    ) : (
                      !filteredSupervisors.length == 0 &&
                      filteredSupervisors?.map((subType, index) => (
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
                          {({ setSupervisors, active }) => (
                            <>
                              <span
                                className={`block truncate ${
                                  setSupervisors ? "font-medium" : "font-normal"
                                }`}
                              >
                                {subType.name}
                              </span>
                              {selectedSupervisors ? (
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
          ) : (
            <Combobox
              value={selectedContractors}
              onChange={(e) => handleInputTarget(e, "contractors")}
            >
              <div className="relative mt-1">
                <div className="form-input block w-full rounded-md border-0 py-[1px] text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-400 sm:text-sm sm:leading-6">
                  <Combobox.Input
                    className="w-full border-none py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 focus:ring-0"
                    displayValue={(subType) => subType?.userName}
                    onChange={(event) =>
                      setQueryContractors(event.target.value)
                    }
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
                  afterLeave={() => setQueryContractors("")}
                >
                  <Combobox.Options className="absolute mt-1 z-10 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
                    {filteredContractors.length === 0 &&
                    queryContractors !== "" ? (
                      <div className="relative cursor-default select-none px-4 py-2 text-gray-700">
                        موردی یافت نشد
                      </div>
                    ) : (
                      !filteredContractors.length == 0 &&
                      filteredContractors?.map((subType, index) => (
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
                          {({ selectedContractors, active }) => (
                            <>
                              <span
                                className={`block truncate ${
                                  selectedContractors
                                    ? "font-medium"
                                    : "font-normal"
                                }`}
                              >
                                {subType.userName}
                              </span>
                              {selectedSupervisors ? (
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
          )}
        </div>
        <div>
          <label htmlFor="state" className="text-xs text-gray-600 mb-4">
            دسترسی
          </label>
          <Combobox
            value={selectedKindDetail}
            onChange={(e) => handleInputTarget(e, "type")}
          >
            <div className="relative mt-1">
              <div className="form-input block w-full rounded-md border-0 py-[1px] text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-400 sm:text-sm sm:leading-6">
                <Combobox.Input
                  className="w-full border-none py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 focus:ring-0"
                  displayValue={(subType) => subType?.title}
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
                        {({ selectedKindDetail, active }) => (
                          <>
                            <span
                              className={`block truncate ${
                                selectedKindDetail
                                  ? "font-medium"
                                  : "font-normal"
                              }`}
                            >
                              {subType.title}
                            </span>
                            {selectedKindDetail ? (
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
      </div>
    </>
  );
};

export default AssignedSkgForm;
