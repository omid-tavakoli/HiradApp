import { useEffect, useState } from "react";
import DataTable from "../../ui/table/DataTable";
import BeatLoaderLoading from "../../ui/element/loading/BeatLoader";
import useApi from "../../hooks/useApi";
import columns from "../../utils/models/column/Formulas";
import ModalAction from "../../ui/ModalAction";
import { TrashIcon, PencilIcon } from "@heroicons/react/24/outline";
import toast from "react-hot-toast";
import { useUser } from "../../contexts/UserContext";
import FormulaForm from "../../ui/forms/FormulaForm";
import { createColumnHelper } from "@tanstack/react-table";

const Formulas = () => {
  const [list, setList] = useState([]);
  const [modalContent, setModalContent] = useState(null);
  const [showModal, setShowModal] = useState([]);

  const request = useApi();
  const requestGetlist = useApi();

  const { user } = useUser();

  useEffect(() => {
    user && getListData();
  }, [user]);

  const getListData = async () => {
    try {
      const { data } = await requestGetlist.apiCall(
        "get",
        `CalculationFormula/GetList/${user?.subSysId}`
      );
      setList(data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = (id) => {
    const targetItem = list.find((item) => item.id == id);

    setModalContent({
      title: "حذف فرمول",
      onSubmitTitle: "حذف",
      onSubmit: () => onDelete(id),
      children: (
        <div>
          آیا از حذف فرمول{" "}
          <span className="font-bold">{`${targetItem?.title}`}</span> مطمئن
          هستید؟
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
        `CalculationFormula/Delete/${id}`
      );
      if (response?.isSuccess) {
        toast.success("فرمول با موفقیت حذف شد");
        getListData();
        setShowModal(false);
      }
    } catch (error) {
      console.log("ERR", error);
    }
  };

  const handleEdit = (id) => {
    const targetItem = list.find((item) => item.id == id);
    setModalContent({
      title: "ویرایش فرمول",
      children: (
        <FormulaForm
          defaultValues={targetItem}
          onSubmitForm={(formData, id) => onEdit(formData, id)}
          onClose={() => setShowModal(false)}
          onSubmitTitle={"ویرایش"}
          loading={request.loading}
          id={id}
        />
      ),
    });
    setShowModal(true);
  };

  const onEdit = async (formData, id) => {
    try {
      const response = await request.apiCall(
        "post",
        `CalculationFormula/Edit`,
        {
          ...formData,
          subSysId: user?.subSysId,
          id: id,
        }
      );
      if (response?.isSuccess) {
        toast.success("فرمول با موفقیت ویرایش شد");
        getListData();
        setShowModal(false);
      }
    } catch (error) {
      console.log("ERR", error);
    }
  };

  const handleAdd = () => {
    setModalContent({
      title: "افزودن فرمول",
      children: (
        <FormulaForm
          onSubmitForm={(formData) => onAdd(formData)}
          onClose={() => setShowModal(false)}
          onSubmitTitle={"افزودن"}
          loading={request.loading}
          defaultValues={{}}
        />
      ),
    });
    setShowModal(true);
  };

  const onAdd = async (formData) => {
    getListData();
    setShowModal(false);
    try {
      const response = await request.apiCall(
        "post",
        `CalculationFormula/Create`,
        {
          ...formData,
          subSysId: user?.subSysId,
        }
      );
      if (response?.isSuccess) {
        toast.success("فرمول با موفقیت اضافه  شد");
        getListData();
        setShowModal(false);
      }
    } catch (error) {
      console.log("ERR", error);
    }
  };
  const actionsList = [
    {
      title: "ویرایش",
      icon: <PencilIcon className="ml-1 h-4 w-4" aria-hidden="true" />,
      handleClick: (id) => handleEdit(id),
    },
    {
      title: "حذف",
      icon: <TrashIcon className="ml-1 h-4 w-4" aria-hidden="true" />,
      handleClick: (id) => handleDelete(id),
    },
  ];
  return (
    <div className="flex flex-col space-y-4">
      <div className="text-2xl font-black text-gray-600 mb-4">فرمول ها</div>

      <button type="button" className="w-fit btn-primary" onClick={handleAdd}>
        افزودن فرمول
      </button>

      {requestGetlist.loading && (
        <div className="w-full flex justify-center">
          <BeatLoaderLoading size={50} />
        </div>
      )}
      {list ? (
        <DataTable columns={columns} data={list} actions={actionsList} />
      ) : (
        <div className="flex justify-center text-primary-600 text-2xl pt-6">
          داده ای یافت نشد
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

export default Formulas;
