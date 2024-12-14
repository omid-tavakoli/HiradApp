import { digitsEnToFa, addCommas } from "@persian-tools/persian-tools";
import ModalAction from "../../../ui/ModalAction";
import FiberManualRecordOutlinedIcon from "@mui/icons-material/FiberManualRecordOutlined";
import { useEffect, useState } from "react";
import useApi from "../../../hooks/useApi";
import AddFactor from "./AddFactor";
import { useUser } from "../../../contexts/UserContext";

const FactorPage = ({ id, status }) => {
  const [factor, setFactor] = useState();
  const [showModal, setShowModal] = useState([]);
  const [modalContent, setModalContent] = useState(null);
  const [ defaultNationalCode , setDefaultNationalCode] = useState("")
  const request = useApi();
  const { user } = useUser();

  const getData = async () => {
    try {
      const { data } = await request.apiCall("get", "Factor/Get?id=" + id);
      setFactor(data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    user && getUser();
  }, [user]);

  const getUser = async () => {
    try {
      const { data } = await request.apiCall("get", `User/Get/${user?.userId}`);
      setDefaultNationalCode(data.nationalCode);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getData();
  }, []);


  if (factor)
    return (
      <div className="flex flex-col space-y-4">
        <div className="flex flex-col space-y-2 text-sm">
          <div className="flex flex-row items-center">
            <FiberManualRecordOutlinedIcon className="!text-xs" />
            <span className="mx-1 font-medium">قیمت</span>
            <span>: {digitsEnToFa(addCommas(factor?.price ?? ""))} ریال</span>
          </div>
          {status == true && (
            <div className="flex flex-row items-center">
              <FiberManualRecordOutlinedIcon className="!text-xs" />
              <span className="mx-1 font-medium">کدپستی</span>
              <span>: {digitsEnToFa(factor?.postalCode)}</span>
            </div>
          )}
          <div className="flex flex-row items-center">
            <FiberManualRecordOutlinedIcon className="!text-xs" />
            <span className="mx-1 font-medium">تاریخ</span>
            <span>: {digitsEnToFa(factor?.dateTime || "")}</span>
          </div>
          {status == false && (
            <>
              <div className="flex flex-row items-center">
                <FiberManualRecordOutlinedIcon className="!text-xs" />
                <span className="mx-1 font-medium">شناسه</span>
                <span>: {digitsEnToFa(factor?.paymentcode || "")}</span>
              </div>
              <div className="flex flex-row items-center">
                <FiberManualRecordOutlinedIcon className="!text-xs" />
                <span className="mx-1 font-medium">اطلاعات پرداخت</span>
                <span>: {digitsEnToFa(factor?.description || "")}</span>
              </div>
            </>
          )}
        </div>
        {status == false && (
          <div className="flex justify-end">
            <button
              type="submit"
              className="btn-primary w-fit"
              onClick={() => {
                setModalContent({
                  title: "اطلاعات پرداخت فاکتور",
                  children: <AddFactor defaultNationalCode={defaultNationalCode}/>,
                });
                setShowModal(true);
              }}
            >
             پرداخت فاکتور
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

export default FactorPage;
