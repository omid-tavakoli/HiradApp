import { useEffect, useState } from "react";
import { useUser } from "../../../contexts/UserContext";
import useApi from "../../../hooks/useApi";
import UpgradePackage from "./UpgradePackage";
import RadialBar from "../../element/chart/RadialBar";
import { format, parse, differenceInDays, startOfDay } from "date-fns-jalali";

const PackageStatistics = () => {
  const [statistic, setStatistic] = useState(null);
  const [modalContent, setModalContent] = useState(null);
  const [showModal, setShowModal] = useState([]);
  const [daysDifference, setDaysDifference] = useState(0);
  const [daysRemaining, setDaysRemaining] = useState(0);
  const [allDays, setAllDays] = useState(0);

  const request = useApi();

  const { user } = useUser();

  useEffect(() => {
    if (user?.subSysId) getPackage();
  }, [user]);

  useEffect(() => {
    if (statistic?.startDate && statistic?.endDate) {
      const today = startOfDay(new Date());
      const start = parse(statistic.startDate, "yyyy/MM/dd", new Date());
      const end = parse(statistic.endDate, "yyyy/MM/dd", new Date());

      const Allday = differenceInDays(end, start);
      const diffDays = differenceInDays(end, today);
      const daysRemain = differenceInDays(today, start);

      setAllDays(Allday);
      setDaysDifference(diffDays > 0 ? diffDays : 0);
      setDaysRemaining(daysRemain > 0 ? daysRemain : 0);
    }
  }, [statistic]);

  const items = [
    {
      name: "sms",
      title: "پیام های باقیمانده",
    },
    {
      name: "email",
      title: "ایمیل های باقیمانده",
    },
    {
      name: "user",
      title: "کاربران باقیمانده",
    },
    {
      name: "project",
      title: `${
        user?.role?.listSystemSet?.filter((item) => item.number == 2)[0]
          ?.fieldValue
          ? user?.role?.listSystemSet?.filter((item) => item.number == 2)[0]
              ?.fieldValue
          : "پروژه"
      } های باقیمانده`,
    },
  ];

  const getPackage = async () => {
    try {
      const { data } = await request.apiCall(
        "get",
        `Package/GetSubSysActivePackage/${user.subSysId}`
      );
      setStatistic(data);
    } catch (error) {
      if (error.response.status !== 401) console.log(error);
    }
  };

  const handleShow = () => {
    setModalContent({
      title: "انتخاب پکیج",
      onSubmit: false,
      children: <UpgradePackage />,
    });
    setShowModal(true);
  };

  return (
    statistic && (
      <div className="sm:p-8  mb-10">
        <div className="flex">
          <span className="text-2xl font-black text-gray-600 mb-4">
            اطلاعات پکیج فعال
          </span>
          <button
            className="mb-4 mr-4 text-xs text-primary-800"
            onClick={handleShow}
          >
            ارتقای پکیج
          </button>
        </div>
        <div className="flex flex-wrap gap-4 justify-center   ">
          {items.map((item) => (
            <div
              key={item.name}
              className="relative p-4 rounded-2xl bg-white shadow w-60 h-52"
            >
              <div className="">
                <div className="flex items-center space-x-2 rtl:space-x-reverse text-sm font-medium text-gray-500">
                  <span>{item.title} :</span>
                  <div className="text-xl text-black">
                    {statistic[item.name + "Remaining"]}
                  </div>
                </div>
                <div className="flex items-center space-x-1 rtl:space-x-reverse text-sm font-medium">
                  <span>تعداد کل: {statistic[item.name + "Quantity"]}</span>
                </div>

                <RadialBar
                  total={statistic[item.name + "Quantity"]}
                  remain={statistic[item.name + "Remaining"]}
                  label={"میزان مصرف"}
                />
              </div>
            </div>
          ))}
          <div className="relative p-4 rounded-2xl bg-white shadow w-60 h-52">
            <div className="space-y-2">
              <div className="flex items-center space-x-2 rtl:space-x-reverse text-sm font-medium text-gray-500">
                <span>روز های باقی مانده :</span>
                <div className="text-xl text-black">{daysDifference}</div>
              </div>
              <div className="flex items-center space-x-1 rtl:space-x-reverse text-sm font-medium">
                <span>تعداد کل: {allDays}</span>
              </div>
              <div className="h-20">
                <RadialBar
                  total={allDays}
                  remain={daysRemaining}
                  label={"میزان مصرف"}
                />
              </div>
            </div>
          </div>
        </div>

        {showModal && modalContent && (
          <ModalAction
            {...modalContent}
            show={showModal}
            onClose={() => setShowModal(false)}
          />
        )}
      </div>
    )
  );
};

export default PackageStatistics;
