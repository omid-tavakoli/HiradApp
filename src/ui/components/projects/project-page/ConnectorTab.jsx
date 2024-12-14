import useApi from "../../../../hooks/useApi";
import AddContractorsForm from "../create-stepper/forms/AddContractorsForm";
import { useState, useEffect } from "react";
import ModalAction from "../../../ModalAction";
import { TrashIcon, PencilIcon } from "@heroicons/react/24/outline";
import { PlusIcon } from "@heroicons/react/20/solid";
import toast from "react-hot-toast";
import ContractorAdminsForm from "../../contractor-admins/ContractorAdminsForm";
import { useUser } from "../../../../contexts/UserContext";

const ConnectorTab = ({ projectId }) => {
  const [list, setList] = useState([]);

  const [modalContent, setModalContent] = useState(null);
  const [showModal, setShowModal] = useState([]);
  const {user} = useUser()
  const requestGetlist = useApi();
  const request = useApi();

  useEffect(() => {
    getListData();
  }, []);

  const getListData = async () => {
    try {
      const { data } = await requestGetlist.apiCall(
        "get",
        `Contractor/GetContractorAdminList/${projectId}`
      );
      setList(data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleAdd = (id) => {
    setModalContent({
      title: `افزودن ${user?.role?.listSystemSet?.filter(item => item.number == 5 )[0]?.fieldValue2 ? user?.role?.listSystemSet?.filter(item => item.number == 5 )[0]?.fieldValue2 : 'پیمانکار'} ${user?.role?.listSystemSet?.filter(item => item.number == 2 )[0]?.fieldValue ? user?.role?.listSystemSet?.filter(item => item.number == 2 )[0]?.fieldValue: 'پروژه'}`,
      children: (
        <ContractorAdminsForm
          onClose={() => setShowModal(false)}
          setModalContent={setModalContent}
          projectId={projectId}
          refetch={() => getListData()}
        />
      ),
      id: id,
    });
    setShowModal(true);
  };
  
  const handleDelete = (id) => {
    const targetItem = list.find((item) => item.id == id);
    setModalContent({
      title: `حذف ${user?.role?.listSystemSet?.filter(item => item.number == 5 )[0]?.fieldValue2 ? user?.role?.listSystemSet?.filter(item => item.number == 5 )[0]?.fieldValue2 : 'پیمانکار'}`,
      onSubmitTitle: "حذف",
      onSubmit: () => onDelete(id),
      children: (
        <div>
          آیا از حذف {user?.role?.listSystemSet?.filter(item => item.number == 5 )[0]?.fieldValue2 ? user?.role?.listSystemSet?.filter(item => item.number == 5 )[0]?.fieldValue2 : 'پیمانکار'}{" "}
          <span className="font-bold">{getUser(targetItem)}</span> مطمئن هستید؟
        </div>
      ),
      id: id,
      loading: request.loading,
    });
    setShowModal(true);
  };

  const onDelete = async (id) => {
    try {
      const response = await request.apiCall(
        "delete",
        `Contractor/DeleteAdmin?id=${id}`
      );
      if (response?.isSuccess) {
        toast.success(`${user?.role?.listSystemSet?.filter(item => item.number == 5 )[0]?.fieldValue2 ? user?.role?.listSystemSet?.filter(item => item.number == 5 )[0]?.fieldValue2 : 'پیمانکار'} با موفقیت حذف شد`);
        getListData();
        setShowModal(false);
      }
    } catch (error) {
      console.log("ERR", error);
    }
  };

  const handleEdit = (mobile , id) => {
    setModalContent({
      title: `افزودن ${user?.role?.listSystemSet?.filter(item => item.number == 5 )[0]?.fieldValue2 ? user?.role?.listSystemSet?.filter(item => item.number == 5 )[0]?.fieldValue2 : 'پیمانکار'} ${user?.role?.listSystemSet?.filter(item => item.number == 2 )[0]?.fieldValue ? user?.role?.listSystemSet?.filter(item => item.number == 2 )[0]?.fieldValue: 'پروژه'}`,
      children: (
        <ContractorAdminsForm
          onClose={() => setShowModal(false)}
          setModalContent={setModalContent}
          projectId={projectId}
          refetch={() => getListData()}
          defaulteValue={mobile}
        />
      ),
      id: id,
    });
    setShowModal(true);
  };

  const onEdit = async (formData, id) => {
    try {
      const response = await request.apiCall("post", `Contractor/EditAdmin`, {
        ...formData,
        id: id,
      });
      if (response?.isSuccess) {
        toast.success(`${user?.role?.listSystemSet?.filter(item => item.number == 5 )[0]?.fieldValue2 ? user?.role?.listSystemSet?.filter(item => item.number == 5 )[0]?.fieldValue2 : 'پیمانکار'} با موفقیت ویرایش شد`);
        getListData();
        setShowModal(false);
      }
    } catch (error) {
      console.log("ERR", error);
    }
  };

  const getUser = (item) =>
    `${item.family ? item.name + " " + item.family : item.mobile}`;
  return (
    <>
      <button
        type="button"
        className="btn-primary flex flex-row"
        onClick={() => handleAdd()}
      >
        <PlusIcon className="w-4 h-4 ml-1" />
        افزودن {user?.role?.listSystemSet?.filter(item => item.number == 5 )[0]?.fieldValue2 ? user?.role?.listSystemSet?.filter(item => item.number == 5 )[0]?.fieldValue2 : 'پیمانکار'}
      </button>

      <div className="mt-3 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg">
        <div className="block w-full px-4 py-2 text-gray-800 bg-gray-200 border-b border-gray-200 rounded-t-lg cursor-pointer">
        {user?.role?.listSystemSet?.filter(item => item.number == 5 )[0]?.fieldValue2 ? user?.role?.listSystemSet?.filter(item => item.number == 5 )[0]?.fieldValue2 : 'پیمانکار'} های {user?.role?.listSystemSet?.filter(item => item.number == 2 )[0]?.fieldValue ? user?.role?.listSystemSet?.filter(item => item.number == 2 )[0]?.fieldValue: 'پروژه'}
        </div>

        {!list?.length == 0 ? (
          list?.map((item) => (
            <div
              key={item.id}
              className=" flex flex-row justify-between items-center  w-full px-4 py-2  gap-x-1 border-b border-gray-200 cursor-pointer hover:bg-gray-100 hover:text-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-700 focus:text-primary-700 "
            >
              <div className="flex flex-row items-center">
                <div className="ml-2">{getUser(item)}</div>
              </div>
              <div className="flex flex-row items-center">
                <button
                  onClick={() => handleEdit(item.mobile ,  item.id)}
                  className="flex items-center text-xs ml-2 bg-gray-200 p-1 rounded"
                >
                  <PencilIcon className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="flex items-center text-xs ml-2 bg-gray-200 p-1 rounded"
                >
                  <TrashIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        ) : (
          <span className="text-xs block w-full px-4 py-2 border-b border-gray-200 cursor-pointer hover:bg-gray-100 hover:text-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-700 focus:text-primary-700">
            شخصی ثبت نشده است
          </span>
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

export default ConnectorTab;
