import { useEffect, useState } from "react";
import DataTable from "../../ui/table/DataTable";
import BeatLoaderLoading from "../../ui/element/loading/BeatLoader";
import useApi from "../../hooks/useApi";

export default function AllSms() {
  const [list, setList] = useState([]);
  const request = useApi();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // const { data } = await request.apiCall("get", "Log/GetList");
      // setList(data);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="flex flex-col space-y-4">
      <div className="text-2xl font-black text-gray-600">پیامک ها</div>
      {request.loading ? (
        <div className="w-full flex justify-center">
          <BeatLoaderLoading size={50} />
        </div>
      ) : (
        <DataTable columns={columns} data={list} />
      )}
    </div>
  );
}
