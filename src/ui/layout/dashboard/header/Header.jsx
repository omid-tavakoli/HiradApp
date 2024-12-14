import Info from "./Info";
import Profile from "./Profile";
import MobileMenu from "./MobileMenu";
import Notifications from "./Notifications";

const Header = () => {
  return (
    <div className="bg-white flex flex-row justify-between items-center  py-1 px-2 md:py-4 md:px-8 w-full transiton-all duration-100 ease-out z-20  md:shadow-none">
      <div className="flex flex-row items-center space-x-4 space-x-reverse">
        <MobileMenu />
        <Info />
      </div>
      <div className="flex items-center">
        <Notifications />
        <Profile />
      </div>
    </div>
  );
};

export default Header;
