import { Fragment } from "react";
import Logo from "../../../../assets/images/hirad-logo.png";
import getMenu from "../MenuItems";
import { NavLink } from "react-router-dom";
import { Transition, Menu } from "@headlessui/react";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";
import "../../../../assets/styles/table.css";
import { useUser } from "../../../../contexts/UserContext";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const Sidebar = ({ mobile = false }) => {
  const { user } = useUser();
  const permission = new Set(
    user?.role?.permissionDto?.map((item) => item?.title) || []
  );
  const allowedPage = [];
  if (user?.role?.listSystemSet) {
    const MenuItems = getMenu(user.role.listSystemSet);
    MenuItems.forEach((item) => {
      if (permission.has(item?.requiredPermission)) allowedPage.push(item);
      else if (item?.children) {
        const children = item.children.filter((child) =>
          permission.has(child.requiredPermission)
        );
        if (children.length) allowedPage.push({ ...item, children });
      }
    });
  }

  return (
    <aside
      className={
        "bg-white lg:flex flex-col pt-8 px-4 fixed h-full w-[250px] top-0 right-0" +
        (mobile ? "" : " hidden")
      }
    >
      <div className="flex flex-row justify-center items-center mb-4">
        <img src={Logo} className=" w-auto" style={{ height: "6rem" }} alt="" />
      </div>
      <div className="overflow-y-auto flex-auto pb-12 table-scrollbar">
        <div className="flex flex-col space-y-2 text-sm text-gry-800 pl-2">
          {allowedPage.map((item, index) =>
            item.path ? (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  classNames(
                    isActive
                      ? "bg-primary-50 text-primary-800 rounded-lg"
                      : "text-gray-900",
                    "flex flex-row items-center py-1 text-sm rounded-lg hover:text-primary-800"
                  )
                }
                end={item.end}
              >
                <div className="ml-1">{item?.icon}</div>
                <div className="ml-1">{item.title}</div>
              </NavLink>
            ) : (
              <Menu
                as="div"
                className="relative inline-flex flex-col text-right"
                key={index}
              >
                {({ open }) => (
                  <>
                    <Menu.Button className="inline-flex w-full justify-between rounded-m text-gray-900">
                      <div className="flex flex-row items-center">
                        <div className="ml-1">{item?.icon}</div>
                        <div>{item.title}</div>
                      </div>
                      {open ? (
                        <ChevronUpIcon
                          className="-mr-1 h-5 w-5 text-gray-400"
                          aria-hidden="true"
                        />
                      ) : (
                        <ChevronDownIcon
                          className="-mr-1 h-5 w-5 text-gray-400"
                          aria-hidden="true"
                        />
                      )}
                    </Menu.Button>

                    {item?.children && (
                      <Transition
                        as={Fragment}
                        enter="transition ease-out duration-100"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                      >
                        <Menu.Items className="mr-4">
                          <div className="py-1">
                            {item?.children?.map((subItem, index) => (
                              <Menu.Item key={index}>
                                <NavLink
                                  to={subItem.path}
                                  className={({ isActive }) =>
                                    classNames(
                                      isActive
                                        ? "bg-primary-50 text-primary-800 rounded-lg"
                                        : "text-gray-900",
                                      "flex flex-row items-center py-1 text-xs rounded-lg hover:text-primary-800"
                                    )
                                  }
                                >
                                  <div className="ml-1">{subItem?.icon}</div>
                                  <div className="ml-1">{subItem.title}</div>
                                </NavLink>
                              </Menu.Item>
                            ))}
                          </div>
                        </Menu.Items>
                      </Transition>
                    )}
                  </>
                )}
              </Menu>
            )
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
