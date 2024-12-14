import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import DataTable from "../../../ui/table/DataTable";
import BeatLoaderLoading from "../../../ui/element/loading/BeatLoader";
import useApi from "../../../hooks/useApi";
import { useState, useEffect } from "react";
import { useUser } from "../../../contexts/UserContext";
import columns from "../../../utils/models/column/Kinds";
import { EyeIcon, TrashIcon } from "@heroicons/react/24/outline";
import ModalAction from "../../../ui/ModalAction";

const Kinds = () => {
  const navigate = useNavigate();
  const [list, setList] = useState([]);
  const [modalContent, setModalContent] = useState(null);
  const [showModal, setShowModal] = useState([]);
  const { user } = useUser();

  const requestGetlist = useApi();
  const request = useApi();

  useEffect(() => {
    user && getListData();
  }, [user]);

  const getListData = async () => {
    try {
      const { data } = await requestGetlist.apiCall(
        "get",
        `SubSysKind/GetList/${user?.subSysId}`
      );
      setList(data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleRedirectKindCreate = () => {
    navigate("create");
  };

  const handleShow = (id) => {
    navigate(`${id}`);
  };

  const handleDelete = (id) => {
    const targetItem = list.find((item) => item.id == id);

    setModalContent({
      title: `حذف ${
        user?.role?.listSystemSet?.filter((item) => item.number == 11)[0]
          ?.fieldValue
          ? user?.role?.listSystemSet?.filter((item) => item.number == 11)[0]
              ?.fieldValue
          : "زیرمجموعه"
      }`,
      onSubmitTitle: "حذف",
      onSubmit: () => onDelete(id),
      children: (
        <div>
          آیا از حذف{" "}
          {user?.role?.listSystemSet?.filter((item) => item.number == 11)[0]
            ?.fieldValue
            ? user?.role?.listSystemSet?.filter((item) => item.number == 11)[0]
                ?.fieldValue
            : "زیرمجموعه"}{" "}
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
        `SubSysKind/Delete/${id}`
      );
      if (response?.isSuccess) {
        toast.success(
          `${
            user?.role?.listSystemSet?.filter((item) => item.number == 11)[0]
              ?.fieldValue
              ? user?.role?.listSystemSet?.filter(
                  (item) => item.number == 11
                )[0]?.fieldValue
              : "زیرمجموعه"
          } با موفقیت حذف شد`
        );
        getListData();
        setShowModal(false);
      }
    } catch (error) {
      console.log("ERR", error);
    }
  };

  const actionsList = [
    {
      title: "مشاهده",
      icon: <EyeIcon className="ml-1 h-4 w-4" aria-hidden="true" />,
      handleClick: (id) => handleShow(id),
    },
    {
      title: "حذف",
      icon: <TrashIcon className="ml-1 h-4 w-4" aria-hidden="true" />,
      handleClick: (id) => handleDelete(id),
    },
  ];
  return (
    <div className="flex flex-col space-y-4">
      <div className="text-2xl font-black text-gray-600 mb-4">
        {user?.role?.listSystemSet?.filter((item) => item.number == 11)[0]
          ?.fieldValue
          ? user?.role?.listSystemSet?.filter((item) => item.number == 11)[0]
              ?.fieldValue
          : "زیرمجموعه"}{" "}
        ها
      </div>

      <button
        type="button"
        onClick={handleRedirectKindCreate}
        className="btn-primary w-fit"
      >
        افزودن{" "}
        {user?.role?.listSystemSet?.filter((item) => item.number == 11)[0]
          ?.fieldValue
          ? user?.role?.listSystemSet?.filter((item) => item.number == 11)[0]
              ?.fieldValue
          : "زیرمجموعه"}
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

export default Kinds;
