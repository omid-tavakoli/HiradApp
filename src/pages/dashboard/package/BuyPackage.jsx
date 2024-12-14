import { useEffect, useState } from "react";
import useApi from "../../../hooks/useApi";
import BeatLoaderLoading from "../../../ui/element/loading/BeatLoader";
import { numberToWords, digitsEnToFa } from "@persian-tools/persian-tools";
import { CheckIcon } from "@heroicons/react/24/outline";
import ModalAction from "../../../ui/ModalAction";
import toast from "react-hot-toast";
import { useUser } from "../../../contexts/UserContext";
import BuyInfo from "./BuyInfo";

const BuyPackage = () => {
  const [list, setList] = useState([]);
  const [modalContent, setModalContent] = useState(null);
  const [showModal, setShowModal] = useState([]);

  const requestGetlist = useApi();
  const requestBuy = useApi();

  const { user } = useUser();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await requestGetlist.apiCall(
          "get",
          "Package/GetList?Filters=subTypeId==" + user?.subSysTypeId
        );
        setList(data);
      } catch (error) {
        console.log(error);
   
      }
    };

    fetchData();
  }, []);

  const handleBuy = (id) => {
    setModalContent({
      title: "خرید پکیج",
      children: (
        <BuyInfo
          onClose={() => setShowModal(false)}
          onSubmit={(data) => onBuy(id, data)}
        />
      ),
      id: id,
      loading: requestBuy.loading,
    });
    setShowModal(true);
  };

  const onBuy = async (id, data) => {
    try {
      const response = await requestBuy.apiCall("post", `Factor/Add`, {
        subSysId: user?.subSysId,
        packageId: id,
        ...data,
      });
      if (response?.isSuccess) {
        toast.success("فاکتور برای شما ثبت شد");
        setShowModal(false);
      }
    } catch (error) {
      console.log("ERR", error);
    }
  };

  return (
    <div className="flex flex-col space-y-4">
      <div className="text-2xl font-black text-gray-600 mb-4">پکیج ها</div>

      {requestGetlist.loading ? (
        <div className="w-full flex justify-center">
          <BeatLoaderLoading size={50} />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {list?.map((item) => (
            <div key={item?.id} className="bg-white p-4 shadow rounded-md">
              <div className="text-lg font-semibold">{item?.name}</div>
              <div className="text-xs text-gray-600 mt-4 mb-6">
                {item?.description}
              </div>
              <div className="flex flex-row items-center">
                <div className="text-xl font-bold">
                  {numberToWords(item?.price)} تومان
                </div>
                <div className="text-gray-500 text-sm">
                  /{digitsEnToFa(item?.dayQuantity)}روزه
                </div>
              </div>

              <div className="flex flex-col space-y-2 mt-8 text-sm text-gray-700">
                <div className="flex flex-row items-center">
                  <CheckIcon className="w-5 h-5 ml-1 text-primary-800" />
                  <span>
                    پشتبانی از {digitsEnToFa(item?.userQuantity)} کاربر
                  </span>
                </div>
                <div className="flex flex-row items-center">
                  <CheckIcon className="w-5 h-5 ml-1 text-primary-800" />
                  <span>{digitsEnToFa(item?.projectQuantity)} {user?.role?.listSystemSet?.filter(item => item.number == 2 )[0]?.fieldValue ? user?.role?.listSystemSet?.filter(item => item.number == 2 )[0]?.fieldValue: 'پروژه'}</span>
                </div>
                <div className="flex flex-row items-center">
                  <CheckIcon className="w-5 h-5 ml-1 text-primary-800" />
                  <span>{digitsEnToFa(item?.smsQuantity)} پیامک</span>
                </div>
                <div className="flex flex-row items-center">
                  <CheckIcon className="w-5 h-5 ml-1 text-primary-800" />
                  <span>{digitsEnToFa(item?.emailQuantity)} ایمیل</span>
                </div>
                <div className="flex flex-row flex-wrap items-center">
                  <CheckIcon className="w-5 h-5 ml-1 text-primary-800" />
                  مدت اعتبار از
                  <span className=" mx-1">{digitsEnToFa(item?.startDate)}</span>
                  تا
                  <span className=" mx-1">{digitsEnToFa(item?.endDate)}</span>
                </div>
              </div>
              <button
                onClick={() => handleBuy(item?.id)}
                className="btn-primary w-full mt-2"
              >
                خرید پکیج
              </button>
            </div>
          ))}
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

export default BuyPackage;
