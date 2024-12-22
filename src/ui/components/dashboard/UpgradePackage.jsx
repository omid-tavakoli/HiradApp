import { useEffect, useState } from "react";
import useApi from "../../../hooks/useApi";
import { useUser } from "../../../contexts/UserContext";
import toast from "react-hot-toast";
import ModalAction from "../../ModalAction";
import BuyInfo from "../../../pages/dashboard/package/BuyInfo";

const UpgradePackage = () => {
  const [packages, setPackages] = useState([]);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [modalContent, setModalContent] = useState(null);
  const [showModal, setShowModal] = useState([]);

  const { user } = useUser();

  const request = useApi();
  const requestBuy = useApi();

  useEffect(() => {
    getPackages();
  }, []);

  const getPackages = async () => {
    try {
      const { data } = await request.apiCall("get", `Package/GetList`);
      setPackages(data);
    } catch (error) {
      console.log(error);
    }
  };
  const handleBuy = () => {
    setModalContent({
      title: "خرید پکیج",
      children: (
        <BuyInfo
          onClose={() => setShowModal(false)}
          onSubmit={(data) => onBuy(data)}
        />
      ),
      id: selectedPackage.id,
      loading: requestBuy.loading,
    });
    setShowModal(true);
  };

  const onBuy = async (data) => {
    try {
      const response = await requestBuy.apiCall("post", `Factor/Add`, {
        subSysId: user?.subSysId,
        packageId:  selectedPackage.id,
        ...data
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
    <div>
      <div className="grid gap-4 lg:gap-2 md:grid-cols-2">
        {packages.map((item) => (
          <div
            key={item.id}
            className={`relative p-6 rounded-2xl shadow cursor-pointer ${
              selectedPackage?.id === item.id ? "bg-primary-100" : ""
            }`}
            onClick={() => setSelectedPackage(item)}
          >
            <div className="space-y-2">
              <div className="flex items-center space-x-2 rtl:space-x-reverse text-sm font-medium text-gray-500">
                <span>{item.name}</span>
              </div>
              <span className="text-sm">{item.description}</span>
              <div className="flex flex-col space-x-1 rtl:space-x-reverse text-sm font-medium">
                <span>تعداد {user?.role?.listSystemSet?.filter(item => item.number == 2 )[0]?.fieldValue ? user?.role?.listSystemSet?.filter(item => item.number == 2 )[0]?.fieldValue: 'پروژه'}: {item.projectQuantity}</span>
                <span>تعداد کاربر: {item.userQuantity}</span>
                <span>تعداد روز: {item.dayQuantity}</span>
                <span>تعداد ایمیل: {item.emailQuantity}</span>
                <span>تعداد پیامک: {item.smsQuantity}</span>
                <span>تعداد {user?.role?.listSystemSet?.filter(item => item.number == 4 )[0]?.fieldValue  ? user?.role?.listSystemSet?.filter(item => item.number == 4 )[0]?.fieldValue : 'ارزیابی'}: {item.examQuantity}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      {selectedPackage && (
        <div className="mt-5">
          <button type="button" className="btn-primary w-full" onClick={ () => handleBuy()}>
            خرید
          </button>
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

export default UpgradePackage;
