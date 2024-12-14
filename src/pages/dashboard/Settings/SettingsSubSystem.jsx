import { useEffect, useState } from "react";
import BeatLoaderLoading from "../../../ui/element/loading/BeatLoader";
import useApi from "../../../hooks/useApi";
import { PencilIcon } from "@heroicons/react/24/outline";
import ModalAction from "../../../ui/ModalAction";
import toast from "react-hot-toast";
import SettingsSubSysStatus from "../../../ui/components/settings/SettingsSubSysStatus";
import SettimgForm from "../../../ui/components/settings/SettimgForm";
import { useUser } from "../../../contexts/UserContext";
import useAuth from "../../../hooks/useAuth";

const SettingsSubSystem = () => {
  const [list, setList] = useState([]);
  const [modalContent, setModalContent] = useState(null);
  const [showModal, setShowModal] = useState([]);
  const [modalContent2, setModalContent2] = useState(null);
  const [showModal2, setShowModal2] = useState([]);
  const request = useApi();
  const { user } = useUser();
  const { userLogout } = useAuth();

  useEffect(() => {
    if(user?.subSysId){
      getData();
    }
  }, [user]);

  const getData = async () => { 
    try {
      const { data } = await request.apiCall("get", `SubSystemSet/GetList/${user.subSysId}`);
      setList(data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleEdit = async (id , enable) => {
    try {
      const { data } = await request.apiCall("get", `SubSystemSet/Get/${id}`);
      setModalContent({
        title: "ویرایش تنظیمات",
        children: (
          <SettimgForm
            onSubmitTitle={"ویرایش"}
            onSubmit={(formData) => onEdit(formData, id , enable)}
            onClose={() => setShowModal(false)}
            loading={request.loading}
            defaultValues={data}
          />
        ),
      });
      setShowModal(true);
    } catch (error) {
      console.log(error);
    }
  };

  const onEdit = async (formData, id , enable) => {
    try {
      const response = await request.apiCall(
        "post",
        `SubSystemSet/ChangeSystemSet`,
        {
          subsysId: user.subSysId,
          ...formData,
          id: id,
          enable : enable
        }
      );
      if (response?.isSuccess) {
        toast.success("تنظیمات با موفقیت ویرایش شد");
        getData();
        setShowModal(false);
      }
    } catch (error) {
      console.log("ERR", error);
    }
  };

  const onSubmit = (formData) => {
    setModalContent2({
      title: "اخطار",
      onSubmitTitle: "بله",
      onSubmit: () => userLogout(),
      children: (
        <div className="flex  w-full justify-center text-lg">
          برای ثبت تغییرات شمااز سیستم خارج میشوید از سیستم آیا از این عمل مطمئن
          هستید؟
        </div>
      ),
    });
    setShowModal2(true);
  };
  return (
    <div className="flex flex-col space-y-4">
      <div className="text-2xl font-black text-gray-600 mb-4">
        مدیریت تنظیمات
      </div>

      {request.loading && (
        <div className="w-full flex justify-center">
          <BeatLoaderLoading size={50} />
        </div>
      )}
      {request.error && "خطا در دیافت داده"}
      {list ? (
        <div className="flex flex-col sm:grid sm:grid-cols-2 md:grid-cols-3  xl:grid-cols-4 2xl:grid-cols-5 gap-4">
          {list?.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-lg shadow-sm flex flex-col py-4"
            >
              <div className="flex flex-row items-center justify-between px-4">
                <div>
                  <div className="text-sm mb-2">{item?.title}</div>
                  <div className="text-xs text-gray-600">
                    {item?.description}
                  </div>
                </div>
                <div className="flex flex-col">
                  <div className=" ml-5 sm:ml-0 sm:mr-1">
                    <SettingsSubSysStatus
                      targetItem={item}
                      updateList={() => getData()}
                    />
                  </div>
                  <button
                    onClick={() => handleEdit(item.id , item.enable)}
                    className="w-full cursor-pointer flex justify-center rounded-md bg-white p-1.5 text-xs text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-16 sm:mr-5"
                  >
                    <PencilIcon className="w-3 h-3 ml-1" />
                    <span className="text-xs">ویرایش</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        ""
      )}
      <div className="w-full flex justify-end">
        <button
          type="submit"
          className="btn-primary my-4 w-fit"
          onClick={onSubmit}
        >
          ثبت تغییرات
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
    </div>
  );
};

export default SettingsSubSystem;
