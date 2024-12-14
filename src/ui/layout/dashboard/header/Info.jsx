import { useUser } from "../../../../contexts/UserContext";
import { BuildingLibraryIcon } from "@heroicons/react/24/outline";
import { format } from "date-fns-jalali"; 
import SubSystems from "./SubSystems";

const Info = () => {
  const { user } = useUser();

  const currentDate = format(new Date(), "EEEE d MMMM yyyy");

  return (
    <div className="flex flex-row items-center space-x-2 space-x-reverse">
      <div>
        {user?.logo ? (
          <Img src={user?.logo} />
        ) : (
          <BuildingLibraryIcon className="w-6 h-6" />
        )}
      </div>
      <SubSystems />
      <div className="text-xs text-gray-800 hidden sm:block">{currentDate}</div>
    </div>
  );
};

export default Info;
