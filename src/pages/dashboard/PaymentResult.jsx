import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/20/solid";

const ContractortemProfile = () => {
  return (
    <div className="flex flex-col space-y-4">
      <div className="flex flex-row items-center  mb-4">
        <div className="text-2xl font-black text-gray-600">نتیجه پرداخت</div>
      </div>
      <div className="flex flex-col rounded-xl bg-white shadow-sm p-4 h-full w-full">
        <div className="flex flex-col items-center">
          <CheckCircleIcon className="text-green-500 size-60" />

          <div className="text-lg">پرداخت با موفقیت انجام شد. </div>
        </div>

        <div className="flex flex-col items-center">
          <XCircleIcon className="text-primary-500 size-60" />

          <div className="text-lg">پرداخت با موفقیت با خطا خورد. </div>
        </div>
      </div>
    </div>
  );
};

export default ContractortemProfile;
