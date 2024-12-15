import React, { useState } from "react";
import MapComponent from "../../../../../ui/components/exams/create-stepper/steps/MapComponent";
import { useUser } from "../../../../../contexts/UserContext";
import { Box } from "@mui/material";
import toast from "react-hot-toast";
import useApi from '../../../../../hooks/useApi';
const AddLocationStep = ({ onNext, examId }) => {
  const { user } = useUser();
  const [selectedLocation, setSelectedLocation] = useState(null);
  const request = useApi()
  const onSubmit = async () => {
    if (!selectedLocation) {
      toast.error("لطفاً یک نقطه روی نقشه انتخاب کنید.");
      return;
    }
    const reqData = {
      id: examId,
      Latitude: selectedLocation.lat,
      Longitude: selectedLocation.lng,
    };
    try {
      const response = await request.apiCall("post", `Exam/Addlocation`, reqData);
      if (response?.isSuccess) {
        toast.success("موقعیت مکانی با موفقیت ثبت شد");
        onNext();
      }
    } catch (error) {
      console.log("ERR", error);
    }
  };

  return (
    <div>
      <h6 className="text-lg mb-4">
        انتخاب موقعیت مکانی{" "}
        {user?.role?.listSystemSet?.filter((item) => item.number === 2)[0]
          ?.fieldValue
          ? user?.role?.listSystemSet?.filter((item) => item.number === 2)[0]
              ?.fieldValue
          : "پروژه"}{" "}
        :
      </h6>
      <MapComponent onLocationSelect={setSelectedLocation} />
      <div className="flex flex-row items-center mt-6">
        <Box sx={{ flex: "1 1 auto" }} />
        <button onClick={onSubmit} className="btn-primary">
          اتمام فرایند
        </button>
      </div>
    </div>
  );
};

export default AddLocationStep;
