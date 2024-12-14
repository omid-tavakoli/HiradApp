import { useEffect, useState } from "react";
import ModalAction from "../../../../ui/ModalAction";
import { useUser } from "../../../../contexts/UserContext";
import useApi from "../../../../hooks/useApi";

const SubSystems = () => {
  const { user, updateUser } = useUser();

  const [selectedSubSys, setSelectedSubSys] = useState(null);
  const [modalContent, setModalContent] = useState(null);
  const [showModal, setShowModal] = useState([]);

  const request = useApi();

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
    setSelectedSubSys(sys);
  };

  useEffect(() => {
    if (user) {
      if (!user.subSysId) {
        change(user.subSyses[0]);
      } else if (!selectedSubSys) {
        setSelectedSubSys(user.subSyses.find((sys) => sys.id == user.subSysId));
      }
    }
  }, [user]);

  return (
    <>
      <div className="flex flex-row items-center space-x-2 space-x-reverse">
        <div className="text-xs pl-2 sm:border-l-2 border-gray-300">
          {selectedSubSys?.title}
        </div>
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

export default SubSystems;
