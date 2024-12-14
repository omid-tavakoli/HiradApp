import { useEffect, useState } from "react";
import DataTable from "../../../ui/table/DataTable";
import BeatLoaderLoading from "../../../ui/element/loading/BeatLoader";
import useApi from "../../../hooks/useApi";
import columns from "../../../utils/models/column/packages/HistoryPackages";
import { useUser } from "../../../contexts/UserContext";

const HistoryPackages = () => {
  const [list, setList] = useState(null);

  const request = useApi();
  const { user } = useUser();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await request.apiCall(
          "get",
          `Package/GetSubSysPackageList/${user?.subSysId}`
        );
        setList(data);
      } catch (error) {
        console.log(error);
      }
    };

    user && fetchData();
  }, [user]);
  return (
    <div className="flex flex-col space-y-4">
      <div className="text-2xl font-black text-gray-600 mb-4">
        تاریخچه پکیج ها
      </div>
      <span className="mr-2 text-gray-500">
        در این صفحه میتوانید لیست پکیج های خریداری شده را مشاهده کنید
      </span>
      {request.loading && (
        <div className="w-full flex justify-center">
          <BeatLoaderLoading size={50} />
        </div>
      )}
      {list ? (
        <DataTable columns={columns} data={list} />
      ) : (
        <div className="flex justify-center text-primary-600 text-2xl pt-6">
          داده ای یافت نشد
        </div>
      )}
    </div>
  );
};

export default HistoryPackages;
