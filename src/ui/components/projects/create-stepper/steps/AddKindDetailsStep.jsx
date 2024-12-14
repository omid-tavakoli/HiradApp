import {
  ArrowLeftIcon,
  ArrowRightIcon,
  PlusIcon,
} from "@heroicons/react/20/solid";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import { Box } from "@mui/material";
import Checkbox from "@mui/material/Checkbox";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import useApi from "../../../../../hooks/useApi";
import ModalAction from "../../../../ModalAction";
import AddKindDetailsForm from "../../../kinds/KindCreateStepper/forms/AddKindDetailsForm";
import { useUser } from "../../../../../contexts/UserContext";

const AddKindDetailsStep = ({
  onNext,
  onBack,
  activeStep,
  kindId,
  projectId,
}) => {
  const [list, setList] = useState([]);
  const [addedKindDetails, setAddedKindDetails] = useState([]);
  const [modalContent, setModalContent] = useState(null);
  const [showModal, setShowModal] = useState([]);
  const {user} = useUser()
  const [checkedItems, setCheckedItems] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  const requestGetlist = useApi();
  const request = useApi();

  useEffect(() => {
    getListData();
    getListAddedKindDetails();
  }, []);

  const getListData = async () => {
    try {
      const { data } = await requestGetlist.apiCall(
        "get",
        `Project/GetKindDetailList/${kindId}`
      );
      setList(data);
    } catch (error) {
      console.log(error);
    }
  };
  const getListAddedKindDetails = async () => {
    try {
      const { data } = await requestGetlist.apiCall(
        "get",
        `Project/GetProjectKindDetail/${projectId}`
      );
      setAddedKindDetails(data);
      setCheckedItems(data?.map((item) => item.kindDetailId) || []);
    } catch (error) {
      console.log(error);
    }
  };

  const handleAdd = (id) => {
    setModalContent({
      title: "افزودن سربرگ",
      children: (
        <AddKindDetailsForm
          kindId={kindId}
          onSubmitTitle={"افزودن"}
          onClose={() => setShowModal(false)}
          setShowModal={setShowModal}
          reFetch={() => getListData()}
          onSubmit={(formData) => onAdd(formData)}
          defaultValues={{}}
        />
      ),
      id: id,
    });
    setShowModal(true);
  };

  const onAdd = async (data) => {
    try {
      const response = await request.apiCall(
        "post",
        `Project/AddKindDetail`,
        data
      );
      if (response?.isSuccess) {
        getListData();
        setShowModal(false);
        toast.success("سربرگ با موفقیت اضافه شد");
      }
    } catch (error) {
      console.log("ERR", error);
    }
  };

  const handleDelete = (id) => {
    const targetItem = list.find((item) => item.id == id);
    setModalContent({
      title: "حذف سربرگ",
      onSubmitTitle: "حذف",
      onSubmit: () => onDelete(id),
      children: (
        <div>
          آیا از حذف سربرگ{" "}
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
        `Project/DeleteKindDetail/${id}`
      );
      if (response?.isSuccess) {
        toast.success("سربرگ با موفقیت حذف شد");
        getListData();
        setShowModal(false);
      }
    } catch (error) {
      console.log("ERR", error);
    }
  };

  const handleEdit = async (id) => {
    try {
      const { data } = await requestGetlist.apiCall(
        "get",
        `Project/GetKindDetail/${id}`
      );
      setModalContent({
        title: "ویرایش سربرگ",
        children: (
          <AddKindDetailsForm
            kindId={kindId}
            onSubmitTitle={"ویرایش"}
            defaultValues={data}
            onClose={() => setShowModal(false)}
            setShowModal={setShowModal}
            reFetch={() => getListData()}
            onSubmit={(formData, id) => onEdit(formData, id)}
            id={id}
          />
        ),
      });
      setShowModal(true);
    } catch (error) {
      console.log(error);
    }
  };

  const onEdit = async (formData, id) => {
    try {
      const response = await request.apiCall("post", `Project/EditKindDetail`, {
        ...formData,
        id: id,
      });
      if (response?.isSuccess) {
        toast.success("سربرگ با موفقیت ویرایش شد");
        getListData();
        setShowModal(false);
      }
    } catch (error) {
      console.log("ERR", error);
    }
  };

  const handleChangeCheckbox = (item) => {
    const currentIndex = checkedItems.indexOf(item);
    const newChecked = [...checkedItems];

    if (currentIndex === -1) {
      newChecked.push(item);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setCheckedItems(newChecked);
    setSelectAll(newChecked.length === item.length);
  };

  const handleSelectAllChange = () => {
    const newSelectAll = !selectAll;
    setSelectAll(newSelectAll);
    setCheckedItems(newSelectAll ? list.map((item) => item.id) : []);
  };

  const handleAddKindDetailsToProject = async () => {
    if (!checkedItems.length) {
      toast.error("انتخاب حداقل یک سربرگ اجباریست");
      return;
    }

    try {
      const response = await request.apiCall(
        "post",
        `Project/AddKindDetailToProject?projectId=${projectId}`,
        checkedItems
      );
      if (response?.isSuccess) {
        toast.success(`سربرگ با موفقیت به ${user?.role?.listSystemSet?.filter(item => item.number == 2 )[0]?.fieldValue ? user?.role?.listSystemSet?.filter(item => item.number == 2 )[0]?.fieldValue: 'پروژه'} اختصاص یافت شد`);
        onNext();
      }
    } catch (error) {
      console.log("ERR", error);
    }
  };


  return (
    <>
      <div className="text-xs text-gray-700 mb-2">
        در این مرحله در صورت تمایل سربرگ های مد نظر خود را انتخاب و به {user?.role?.listSystemSet?.filter(item => item.number == 2 )[0]?.fieldValue ? user?.role?.listSystemSet?.filter(item => item.number == 2 )[0]?.fieldValue: 'پروژه'}
        اختصاص دهید
      </div>
      <button
        type="button"
        className="btn-primary flex flex-row"
        onClick={() => handleAdd()}
      >
        <PlusIcon className="w-4 h-4 ml-1" />
        افزودن سربرگ
      </button>
      <div className="flex flex-row items-center">
        <Checkbox
          checked={selectAll}
          onChange={handleSelectAllChange}
          size="small"
        />
        <span className="text-sm mr-1">انتخاب همه</span>
      </div>

      <div className="mt-3 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg">
        <div className="block w-full px-4 py-2 text-gray-800 bg-gray-200 border-b border-gray-200 rounded-t-lg cursor-pointer">
          سربرگ ها
        </div>

        {!list?.length == 0 ? (
          list?.map((item) => (
            <div
              key={item.id}
              className=" flex flex-row justify-between items-center  w-full px-4 py-2  gap-x-1 border-b border-gray-200 cursor-pointer hover:bg-gray-100 hover:text-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-700 focus:text-primary-700 "
            >
              <div className="flex flex-row items-center">
                <Checkbox
                  checked={checkedItems.indexOf(item.id) !== -1}
                  onChange={() => handleChangeCheckbox(item.id)}
                  size="small"
                />
                <div className="mx-2">{item.title}</div>
              </div>
              <div className="flex flex-row items-center">
                <button
                  onClick={() => handleEdit(item.id)}
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
            سربرگی ثبت نشده است
          </span>
        )}
      </div>

      <div className="flex flex-row items-cemter mt-6">
        <button
          type="button"
          disabled={activeStep === 0}
          onClick={onBack}
          className="btn-primary flex flex-row"
        >
          <ArrowRightIcon className="w-4 h-4 ml-1" />
          قبلی
        </button>

        <Box sx={{ flex: "1 1 auto" }} />

        <button
          onClick={() => handleAddKindDetailsToProject()}
          className="btn-primary  flex flex-row"
        >
          بعدی
          <ArrowLeftIcon className="w-4 h-4 mr-1" />
        </button>
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

export default AddKindDetailsStep;
