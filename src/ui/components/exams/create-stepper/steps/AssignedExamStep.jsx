import useApi from "../../../../../hooks/useApi";
import { useState, useEffect } from "react";
import { Box } from "@mui/material";
import ModalAction from "../../../../ModalAction";
import { ChevronDoubleLeftIcon } from "@heroicons/react/24/outline";
import AssignedSkg from "../forms/AssignedSkg";
import { useUser } from "../../../../../contexts/UserContext";

const AssignedExamStep = ({
  onNext,
  examId,
  kindId,
  projectId,
  isShowOther,
}) => {
  const [list, setList] = useState([]);
  const [modalContent, setModalContent] = useState(null);
  const [showModal, setShowModal] = useState([]);
  const [modalContent2, setModalContent2] = useState(null);
  const [showModal2, setShowModal2] = useState([]);
  const [supervisors, setSupervisors] = useState([]);
  const [contractors, setContractors] = useState([]);
  const [formulas, setFormulas] = useState([]);
  const [assignedStatus, setAssignedStatus] = useState(false);
  const { user } = useUser();
  const requestGetlist = useApi();
  const requestGetSupervisors = useApi();
  const requestGetContractors = useApi();

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
      const { data } = await requestGetContractors.apiCall(
        "get",
        `CalculationFormula/GetList/${user?.subSysId}`
      );
      setFormulas(data);
    } catch (error) {
      console.log(error);
    }
  };
  const handleAssigned = (id) => {
    setModalContent({
      title: `اختصاص ${user?.role?.listSystemSet?.filter(item => item.number == 5 )[0]?.fieldValue ? user?.role?.listSystemSet?.filter(item => item.number == 5 )[0]?.fieldValue : 'ناظر'} و ${user?.role?.listSystemSet?.filter(item => item.number == 5 )[0]?.fieldValue2 ? user?.role?.listSystemSet?.filter(item => item.number == 5 )[0]?.fieldValue2 : 'پیمانکار'}`,
      children: (
        <AssignedSkg
          setAssignedStatus={setAssignedStatus}
          supervisors={supervisors}
          contractors={contractors}
          formulas={formulas}
          id={id}
          isShowOther={isShowOther}
          close={() => setShowModal(false)}
        />
      ),
      id: id,
    });
    setShowModal(true);
  };

  const endTask = () => {
    if (assignedStatus) {
      onNext();
    } else {
      setModalContent2({
        title: "اخطار",
        onSubmitTitle: "بله",
        onSubmit: () => onNext(),
        children: <div className="flex  w-full justify-center text-lg">آیا از عدم انتخاب {user?.role?.listSystemSet?.filter(item => item.number == 5 )[0]?.fieldValue2 ? user?.role?.listSystemSet?.filter(item => item.number == 5 )[0]?.fieldValue2 : 'پیمانکار'} و {user?.role?.listSystemSet?.filter(item => item.number == 5 )[0]?.fieldValue ? user?.role?.listSystemSet?.filter(item => item.number == 5 )[0]?.fieldValue : 'ناظر'} مطمئن هستید؟</div>,
      });
      setShowModal2(true);
    }
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

      <div className="flex flex-row items-cemter mt-6">
        <Box sx={{ flex: "1 1 auto" }} />
        <button
          onClick={() => endTask()}
          className="bg-primary-800 text-white  py-1 px-4 rounded text-sm transition-all hover:shadow-lg hover:shadow-primary-300"
        >
          بعدی
        </button>
      </div>
      {showModal && modalContent && (
        <ModalAction
          {...modalContent}
          show={showModal}
          onClose={() => setShowModal(false)}
        />
      )}
      {showModal2 && modalContent2 && (
        <ModalAction
          {...modalContent2}
          show={showModal2}
          onClose={() => setShowModal2(false)}
        />
      )}
    </>
  );
};

export default AssignedExamStep;
