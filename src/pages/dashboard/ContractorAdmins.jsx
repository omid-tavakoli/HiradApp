import { useEffect, useState } from "react";
import ModalAction from "../../ui/ModalAction";
import ContractorAdminsForm from "../../ui/components/contractor-admins/ContractorAdminsForm";
import { useUser } from "../../contexts/UserContext";
import useApi from "../../hooks/useApi";
import columns from "../../utils/models/column/Contractors";
import DataTable from "../../ui/table/DataTable";
import BeatLoaderLoading from "../../ui/element/loading/BeatLoader";

const ContractorAdmins = () => {
  const [list, setList] = useState([]);
  const [modalContent, setModalContent] = useState(null);
  const [showModal, setShowModal] = useState([]);

  const requestGetlist = useApi();

  const { user } = useUser();

  useEffect(() => {
    user && getListData();
  }, [user]);

  const getListData = async () => {
    try {
      const { data } = await requestGetlist.apiCall(
        "get",
        `Contractor/GetSubContractorList?subSysId=${user?.subSysId}`
      );
      setList(data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleAdd = (id) => {
    setModalContent({
      title: `افزودن ${
        user?.role?.listSystemSet?.filter((item) => item.number == 5)[0]
          ?.fieldValue2
          ? user?.role?.listSystemSet?.filter((item) => item.number == 5)[0]
              ?.fieldValue2
          : "پیمانکار"
      }`,
      children: (
        <ContractorAdminsForm
          isShowModal={showModal}
          onClose={() => setModalContent(false)}
          setModalContent={setModalContent}
        />
      ),
      id: id,
    });
    setShowModal(true);
  };

  return (
    <div className="flex flex-col space-y-4">
      <div className="text-2xl font-black text-gray-600 mb-4">
        مدیران{" "}
        {user?.role?.listSystemSet?.filter((item) => item.number == 5)[0]
          ?.fieldValue2
          ? user?.role?.listSystemSet?.filter((item) => item.number == 5)[0]
              ?.fieldValue2
          : "پیمانکار"}{" "}
      </div>

      <button type="button" className="w-fit btn-primary" onClick={handleAdd}>
        افزودن مدیر{" "}
        {user?.role?.listSystemSet?.filter((item) => item.number == 5)[0]
          ?.fieldValue2
          ? user?.role?.listSystemSet?.filter((item) => item.number == 5)[0]
              ?.fieldValue2
          : "پیمانکار"}
      </button>
      {list ? (
        <DataTable columns={columns} data={list} />
      ) : (
        <div className="flex justify-center text-primary-600 text-2xl pt-6">
          داده ای یافت نشد
        </div>
      )}

      {requestGetlist.loading && (
        <div className="w-full flex justify-center">
          <BeatLoaderLoading size={50} />
        </div>
      )}
      {showModal && modalContent && (
        <ModalAction
          {...modalContent}
          show={showModal}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

export default ContractorAdmins;
