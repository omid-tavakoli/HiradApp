import { useEffect, useState } from "react";
import BeatLoaderLoading from "../../../ui/element/loading/BeatLoader";
import useApi from "../../../hooks/useApi";
import ModalAction from "../../../ui/ModalAction";
import SettingsStatus from "../../../ui/components/settings/SettingsStatus";

const SettingsSystem = () => {
  const [list, setList] = useState([]);
  const [showModal, setShowModal] = useState([]);

  const request = useApi();

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    try {
      const { data } = await request.apiCall("get", `SystemSet/GetList`);
      setList(data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex flex-col space-y-4">
      <div className="text-2xl font-black text-gray-600 mb-4">
        مدیریت تنظیمات سیستم
      </div>

      {request.loading ? (
        <div className="w-full flex justify-center">
          <BeatLoaderLoading size={50} />
        </div>
      ) : (
        <div className="flex flex-col sm:grid sm:grid-cols-3 gap-4">
          {list?.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-lg shadow-sm flex flex-col pt-4"
            >
              <div className="flex flex-row items-center justify-between px-4">
                <div>
                  <div className="text-sm mb-2">{item?.title}</div>
                  <div className="text-xs text-gray-600">
                    {item?.description}
                  </div>
                </div>
                <SettingsStatus
                  targetItem={item}
                  updateList={() => getData()}
                />
              </div>
              <div className="flex flex-row items-center mt-4 space-x-2 space-x-reverse border-t border-gray-200"></div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SettingsSystem;
