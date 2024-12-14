import useApi from "../../../../hooks/useApi";
import { useState, useEffect } from "react";
import { Box } from "@mui/material";
import ModalAction from "../../../ModalAction";
import { ChevronDoubleLeftIcon } from "@heroicons/react/24/outline";
import { useUser } from "../../../../contexts/UserContext";
import AssignedSkg from "../create-stepper/forms/AssignedSkg";

const AssignedTab = ({
  examId,
  kindId,
  projectId,
}) => {
  const [list, setList] = useState([]);
  const [modalContent, setModalContent] = useState(null);
  const [showModal, setShowModal] = useState([]);
  const [supervisors, setSupervisors] = useState([]);
  const [contractors, setContractors] = useState([]);
  const [formulas, setFormulas] = useState([]);

  const requestGetlist = useApi();
  const requestGetSupervisors = useApi();
  const requestGetContractors = useApi();
  const requestGetFormulas = useApi();

  const { user } = useUser();

  useEffect(() => {
    getListData();
    getSupervisors();
    getContractors();
    getFormulas();
  }, []);

  const getListData = async () => {
    try {
      const { data } = await requestGetlist.apiCall(
        "get",
        `Exam/GetExamSkGroupList/${examId}`
      );
      setList(data);
    } catch (error) {
      console.log(error);
    }
  };

  const getSupervisors = async () => {
    try {
      const { data } = await requestGetSupervisors.apiCall(
        "get",
        `Supervisor/GetList?subSysKindId=${kindId}`
      );
      setSupervisors(data);
    } catch (error) {
      console.log(error);
    }
  };
  
  const getContractors = async () => {
    try {
      const { data } = await requestGetContractors.apiCall(
        "get",
        `Contractor/GetContractorAdminList/${projectId}`
      );
      setContractors(data);
    } catch (error) {
      console.log(error);
    }
  };

  const getFormulas = async () => {
    try {
      const { data } = await requestGetFormulas.apiCall(
        "get",
        `CalculationFormula/GetList/${user?.subSysId}`
      );
      setFormulas(data || []);
    } catch (error) {
      console.log(error);
    }
  };

  const handleAssigned = (id) => {
    setModalContent({
      title: `اختصاص ${user?.role?.listSystemSet?.filter(item => item.number == 5 )[0]?.fieldValue ? user?.role?.listSystemSet?.filter(item => item.number == 5 )[0]?.fieldValue : 'ناظر'} و ${user?.role?.listSystemSet?.filter(item => item.number == 5 )[0]?.fieldValue2 ? user?.role?.listSystemSet?.filter(item => item.number == 5 )[0]?.fieldValue2 : 'پیمانکار'}`,
      children: (
        <AssignedSkg
          supervisors={supervisors}
          contractors={contractors}
          formulas={formulas}
          id={id}
          close={() => setShowModal(false)}
        />
      ),
      id: id,
    });
    setShowModal(true);
  };

  return (
    <>
      <div className="flex items-center mt-4 mb-4 text-sm font-medium text-gray-700">
        <ChevronDoubleLeftIcon className="w-4 h-4 ml-2" />
        دسته بندی سوالات {user?.role?.listSystemSet?.filter(item => item.number == 4 )[0]?.fieldValue  ? user?.role?.listSystemSet?.filter(item => item.number == 4 )[0]?.fieldValue : 'ارزیابی'}
      </div>

      <div className="grid grid-cols-1 divide-y ">
        {!list?.length == 0 ? (
          list?.map((item) => (
            <div
              key={item.id}
              className="flex flex-row justify-between items-center text-sm py-4"
            >
              <div>{item?.skGroupTitle}</div>
              <button
                onClick={() => handleAssigned(item.id)}
                className="text-xs bg-primary-50 p-2 rounded-lg text-primary-800"
              >
                اختصاص
              </button>
            </div>
          ))
        ) : (
          <span>داده ای ثبت نشده است</span>
        )}
      </div>

      {showModal && modalContent && (
        <ModalAction
          {...modalContent}
          show={showModal}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
};

export default AssignedTab;
