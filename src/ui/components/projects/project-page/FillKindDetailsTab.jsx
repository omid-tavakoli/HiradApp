import useApi from "../../../../hooks/useApi";
import { useState, useEffect } from "react";
import FillKindDetailsForm from "../fill-kind-details/FillKindDetailsForm";
import BeatLoaderLoading from "../../../element/loading/BeatLoader";

const FillKindDetailsTab = ({ projectId }) => {
  const [list, setList] = useState([]);
  const requestGetlist = useApi();

  useEffect(() => {
    getListData();
  }, []);

  const getListData = async () => {
    try {
      const { data } = await requestGetlist.apiCall(
        "get",
        `Project/GetProjectKindDetail/${projectId}`
      );
      setList(data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      {requestGetlist.loading ? (
        <div className="w-full flex justify-center">
          <BeatLoaderLoading size={50} />
        </div>
      ) : (
        <FillKindDetailsForm
          KindDetails={list}
          projectId={projectId}
          reFetch={() => getListData()}
        />
      )}
    </>
  );
};

export default FillKindDetailsTab;
