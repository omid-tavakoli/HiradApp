import { PhotoIcon } from "@heroicons/react/24/outline";
import FiberManualRecordOutlinedIcon from "@mui/icons-material/FiberManualRecordOutlined";
import { digitsEnToFa } from "@persian-tools/persian-tools";
import Img from "../../element/Img";

const ShowUser = ({ user }) => {

  return (
    <div className="flex flex-col space-y-2 text-sm">
      <div className="flex flex-row items-center">
        {user?.pic ? (
          <Img src={user?.pic} className="w-8 h-8 ml-4" />
        ) : (
          <PhotoIcon className="h-20 text-gray-300 ml-4" aria-hidden="true" />
        )}
        <div className="flex flex-col">
          <div className="flex flex-row mb-1">
            <span>{user?.name}</span>
            <span>{user?.family}</span>
          </div>
          <div className="text-xs">{user?.role}</div>
        </div>
      </div>
      <div className="flex flex-row items-center">
        <FiberManualRecordOutlinedIcon className="!text-xs" />
        <span className="mx-1 font-medium">زیر سیستم</span>
        <span>: {user?.subSysName}</span>
      </div>
      <div className="flex flex-row items-center">
        <FiberManualRecordOutlinedIcon className="!text-xs" />
        <span className="mx-1 font-medium">موبایل</span>
        <span>: {digitsEnToFa(user?.mobile)}</span>
      </div>
      <div className="flex flex-row items-center">
        <FiberManualRecordOutlinedIcon className="!text-xs" />
        <span className="mx-1 font-medium">فعال/غیرفعال</span>
        <span>: {user?.isLock == 0 ? "فعال" : "غیر فعال"}</span>
      </div>
      {user?.telephone && (
      <div className="flex flex-row items-center">
        <FiberManualRecordOutlinedIcon className="!text-xs" />
        <span className="mx-1 font-medium">تلفن</span>
        <span>: {user?.telephone && digitsEnToFa(user?.telephone)}</span>
      </div>
      )}
      <div className="flex flex-row items-center">
        <FiberManualRecordOutlinedIcon className="!text-xs" />
        <span className="mx-1 font-medium">کد ملی</span>
        <span>: {user?.nationalCode && digitsEnToFa(user?.nationalCode)}</span>
      </div>
      {user?.email && (
      <div className="flex flex-row items-center">
        <FiberManualRecordOutlinedIcon className="!text-xs" />
        <span className="mx-1 font-medium">ایمیل</span>
        <span>: {user?.email}</span>
      </div>
      )}
      {user?.birthDate && (
      <div className="flex flex-row items-center">
        <FiberManualRecordOutlinedIcon className="!text-xs" />
        <span className="mx-1 font-medium">تاریخ تولد</span>
        <span>: {user?.birthDate && digitsEnToFa(user?.birthDate)}</span>
      </div>
      )}
      <div className="flex flex-row items-center">
        <FiberManualRecordOutlinedIcon className="!text-xs" />
        <span className="mx-1 font-medium">تاریخ عضویت</span>
        <span>: {user?.registerDate && digitsEnToFa(user?.registerDate)}</span>
      </div>
      {user?.address && (
        <div className="flex flex-row">
          <FiberManualRecordOutlinedIcon className="!text-xs mt-1" />
          <span className="mx-1 font-medium">آدرس</span>
          <span>: {user?.address}</span>
        </div>
      )}
    </div>
  );
};

export default ShowUser;
