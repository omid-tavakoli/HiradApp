import { useEffect, useState } from "react";
import DataTable from "../../../ui/table/DataTable";
import BeatLoaderLoading from "../../../ui/element/loading/BeatLoader";
import useApi from "../../../hooks/useApi";
import columns from "../../../utils/models/column/users/SystemUsers";
import { createColumnHelper } from "@tanstack/react-table";
import IsLockUser from "../../../ui/components/users/IsLockUser";
import { EyeIcon } from "@heroicons/react/24/outline";
import ModalAction from "../../../ui/ModalAction";
import ShowUser from "../../../ui/components/users/ShowUser";

const UsersSystem = () => {
  const [list, setList] = useState([]);
  const [modalContent, setModalContent] = useState(null);
  const [showModal, setShowModal] = useState([]);
  const request = useApi();
  const columnHelper = createColumnHelper();
  useEffect(() => {
    const isItemExist = columns.some((item) => item.accessorKey === "isLock");
    !isItemExist &&
    columns.push(
      columnHelper.accessor("isLock", {
        header: () => "فعال/غیرفعال",
        cell: (info) => (
            <IsLockUser
              targetItem={info.row.original}
              updateList={() => fetchData()}
            />
          ),
        }),
        columnHelper.accessor("actions", {
          header: () => "عملیات",
          cell: (info) => (
            <button
              onClick={() => handleShow(info.row.original)}
              className=" w-full flex justify-center rounded-md bg-white p-2 text-xs text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
            >
              <EyeIcon className="w-4 h-4 ml-1" />
              <span>مشاهده</span>
            </button>
          ),
        })
      );
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const { data } = await request.apiCall("get", "User/GetList");
      setList(data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleShow = (user) => {
    setModalContent({
      title: "مشاهده کاربر",
      onSubmit: false,
      children: <ShowUser user={user} />,
    });
    setShowModal(true);
  };
  
  return (
    <div className="flex flex-col space-y-4">
      <div className="text-2xl font-black text-gray-600 mb-4">
        کاربران سیستم
      </div>

      {request.loading ? (
        <div className="w-full flex justify-center">
          <BeatLoaderLoading size={50} />
        </div>
      ) : 
        list ? (
          <DataTable columns={columns} data={list} />
        ) : (
          <div className="flex justify-center text-primary-600 text-2xl pt-6">
            داده ای یافت نشد
          </div>
        )
      }

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

export default UsersSystem;
