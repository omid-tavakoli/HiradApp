import FiberManualRecordOutlinedIcon from "@mui/icons-material/FiberManualRecordOutlined";


export default function SubmitPaymentDetails({data}) {
    const PaymentDetails = data.row.original
  return (
    <div className="flex flex-col space-y-2 text-sm">
      <div className="flex flex-row items-center">
        <FiberManualRecordOutlinedIcon className="!text-xs" />
        <span className="mx-1 font-medium">نام :</span>
        <span>{PaymentDetails.name}</span>
      </div>
      <div className="flex flex-row items-center">
        <FiberManualRecordOutlinedIcon className="!text-xs" />
        <span className="mx-1 font-medium">نام خانوادگی :</span>
        <span>{PaymentDetails.family}</span>
      </div>
      <div className="flex flex-row items-center">
        <FiberManualRecordOutlinedIcon className="!text-xs" />
        <span className="mx-1 font-medium">نام سازمان :</span>
        <span>{PaymentDetails.systemName}</span>
      </div>
      <div className="flex flex-row items-center">
        <FiberManualRecordOutlinedIcon className="!text-xs" />
        <span className="mx-1 font-medium">تاریخ :</span>
        <span>{PaymentDetails.date}</span>
      </div>
      <div className="flex flex-row items-center">
        <FiberManualRecordOutlinedIcon className="!text-xs" />
        <span className="mx-1 font-medium">شناسه پرداخت :</span>
        <span>{PaymentDetails.paymentCode}</span>
      </div>
      <div className="flex flex-row items-center">
        <FiberManualRecordOutlinedIcon className="!text-xs" />
        <span className="mx-1 font-medium">کد رهگیری :</span>
        <span>{PaymentDetails.trackingCode}</span>
      </div>
    </div>
  );
}
