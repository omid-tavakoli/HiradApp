import { useEffect, useState } from "react";
import Calendar from "../../ui/components/dashboard/Calendar";
import PackageStatistics from "../../ui/components/dashboard/PackageStatistics";
import ModalAction from "../../ui/ModalAction";
import HelpModal from "./HelpModal";
import { useUser } from "../../contexts/UserContext";
import useApi from "../../hooks/useApi";
function Dashboard() {
  const [modalContent, setModalContent] = useState(null);
  const [showModal, setShowModal] = useState([]);
  const [modalContent2, setModalContent2] = useState(null);
  const [showModal2, setShowModal2] = useState([]);
  const { user ,updateUser } = useUser();
  const request = useApi()

  const change = async (sys) => {
    const { data } = await request.apiCall(
      "get",
      `Role/GetUserRoleBySubSysId/${user.userId}/${sys.id}`
    );
    const userData = user ? { ...user } : {};
    updateUser({
      ...userData,
      subSysId: sys.id,
      subSysTypeId: sys.subSysTypeId,
      role: data,
    });
  };
  
  useEffect(() => {
    setModalContent({
      title: "انتخاب زیردامنه",
      children: user?.subSyses.map((sys) => (
        <button
          key={sys.id}
          type="button"
          className="btn-primary w-fit"
          onClick={() => {
            change(sys);
            setShowModal(false);
          }}
        >
          {sys.title}
        </button>
      )),
    });
    setShowModal(true);
    setModalContent2({
      title: "راهنما",
      children: <HelpModal />,
    });
      setShowModal2(false);

  }, [user]);
  return (
    <>
      <PackageStatistics />
      <Calendar />
      {user?.subSyses?.length > 1 && showModal && modalContent && (
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
}

export default Dashboard;
