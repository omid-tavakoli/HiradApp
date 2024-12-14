import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import { EllipsisVerticalIcon } from "@heroicons/react/20/solid";
import { useState } from "react";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function DropdownActions({ id, actions, data }) {
  const [location, setLocation] = useState();
  const handleClick = (e) => {
    const { top, left } = e.target.getBoundingClientRect();
    setLocation({ top: top, left: left });
  };
  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button
          className="inline-flex w-full justify-center px-4 py-2 rounded-md hover:bg-gray-50"
          onClick={handleClick}
        >
          <EllipsisVerticalIcon
            className="-mr-1 h-5 w-5 text-gray-400"
            aria-hidden="true"
          />
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
        <Menu.Items
          className="fixed botttn-0 z-10 mt-2 text-gray-600 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
          style={{ left: location?.left, top: location?.top }}
        >
  
          <div className="p-2 space-y-1">
            {actions?.map((item, index) => (
              <Menu.Item key={index}>
                {({ active }) => (
                  <button
                    key={index}
                    data-id={id}
                    className={classNames(
                      active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                      " p-1 text-sm text-right w-full rounded-md transition-all flex flex-row"
                    )}
                    onClick={() => item.handleClick(id)}
                  >
                    <div className="mr-2">{item.icon}</div>
                    <div className="text-xs">{item.title}</div>
                  </button>
                )}
              </Menu.Item>
            ))}
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
