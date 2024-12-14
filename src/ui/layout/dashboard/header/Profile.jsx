import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import {
  UserIcon,
  ArrowLeftStartOnRectangleIcon,
  Cog6ToothIcon,
  HomeIcon,
} from "@heroicons/react/24/outline";
import { useUser } from "../../../../contexts/UserContext";
import Avatar from "@mui/material/Avatar";
import useAuth from "../../../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import Img from "../../../element/Img";


function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const Profile = () => {
  const { user } = useUser();
  const { userLogout } = useAuth();

  const navigate = useNavigate();

  const items = [
    {
      name: "حساب کاربری",
      icon: <UserIcon className="h-4 w-4 text-gray-800" aria-hidden="true" />,
      handleClick: () => {
        navigate("/dashboard/profile");
      },
    },
    {
      name: "داشبورد",
      icon: <HomeIcon className="h-4 w-4 text-gray-800" aria-hidden="true" />,
      handleClick: () => {
        navigate("/dashboard");
      },
    },
    {
      name: "مدیریت تنظیمات",
      icon: (
        <Cog6ToothIcon className="h-4 w-4 text-gray-800" aria-hidden="true" />
      ),
      handleClick: () => {
        navigate("/dashboard/settings");
      },
    },
  ];

  return (
    <Menu as="div" className="relative inline-block text-right">
      <div>
        <Menu.Button className="inline-flex flex-col w-full items-center justify-center gap-x-.5">
          {!user?.pic ? (
            <Avatar>
              {user?.name?.charAt(0)} {user?.family?.charAt(0)}
            </Avatar>
          ) : (
            <Img
              src={user.pic}
              className="rounded-full h-10 w-10"
            />
          )}
        </Menu.Button>
      </div>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute left-0 z-10 mt-2 w-40 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1">
            {user?.name && user?.family && (
              <Menu.Item>
                {({ active }) => (
                  <div
                    className={classNames(
                      "text-gray-700",
                      "w-full px-4 py-2 text-sm flex flex-col items-center"
                    )}
                  >
                    <div>{user.name + " " + user.family}</div>
                    <div>({user.role.displayName})</div>
                  </div>
                )}
              </Menu.Item>
            )}
            {items.map((item, index) => (
              <Menu.Item key={index}>
                {({ active }) => (
                  <button
                    onClick={item.handleClick}
                    className={classNames(
                      active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                      "w-full px-4 py-2 text-sm flex flex-row items-center"
                    )}
                  >
                    <div className="ml-2">{item.icon}</div>
                    <div>{item.name}</div>
                  </button>
                )}
              </Menu.Item>
            ))}
            <Menu.Item>
              {({ active }) => (
                <button
                  onClick={() => userLogout()}
                  className={classNames(
                    active
                      ? "bg-primary-100 text-primary-800"
                      : "text-gray-700",
                    "w-full px-4 py-2 text-sm flex flex-row items-center"
                  )}
                >
                  <div className="ml-2">
                    <ArrowLeftStartOnRectangleIcon
                      className={classNames(
                        active
                          ? "bg-primary-100 text-primary-800"
                          : "text-gray-700",
                        "h-4 w-4 "
                      )}
                      aria-hidden="true"
                    />
                  </div>
                  <div>خروج</div>
                </button>
              )}
            </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
};

export default Profile;
