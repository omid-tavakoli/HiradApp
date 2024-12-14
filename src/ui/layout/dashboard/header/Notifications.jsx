import { Fragment, useEffect, useState } from "react";
import { Menu, Transition } from "@headlessui/react";
import { BellIcon } from "@heroicons/react/24/outline";
import { HubConnectionBuilder } from "@microsoft/signalr";
import useApi from "../../../../hooks/useApi";
import { useUser } from "../../../../contexts/UserContext";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [numberOfNotif, setNumberOfNotif] = useState(false);
  const [connection, setConnection] = useState(null);

  const { user } = useUser();

  const request = useApi();

  useEffect(() => {
    const newConnection = new HubConnectionBuilder()
      .withUrl(import.meta.env.VITE_API_URL + "notification")
      .withAutomaticReconnect()
      .build();
    setConnection(newConnection);
  }, []);

  useEffect(() => {
    if (connection) {
      connection.on("SendExamNotificationToUser", (notif) => {
        console.log(notif);
        setNotifications((prev) => [...prev, notif]);
      });
      connection
        .start()
        .then(() => {
          connection.invoke("startMessaging", user?.userId);
        })
        .catch((e) => console.log("Connection failed: ", e));
      return () => {
        connection.stop();
      };
    }
  }, [connection]);

  useEffect(() => {
      if(user?.subSysId) getNotifications();
  }, [user, numberOfNotif]);

  const getNotifications = async () => {
    try {
      const { data } = await request.apiCall(
        "get",
        `Notification/GetList?subSysId=${user?.subSysId}`
      );
      setNumberOfNotif(data.filter((item) => item.seen === false).length);
      setNotifications(data || []);
    } catch (error) {
      console.log(error);
    }
  };

  const seenNotification = () => {
    request.apiCall(
      "post",
      `Notification/SeenMessage`,
      notifications?.map((n) => n.id)
    );
    setNumberOfNotif(0);
  };

  return (
    <Menu as="div" className="relative inline-block text-right ml-8 mt-1">
      <div>
        <Menu.Button
          className="inline-flex w-full items-center justify-center gap-x-.5"
          onClick={seenNotification}
        >
          <BellIcon className="w-6 h-6" />
          {numberOfNotif != 0 && (
            <div className="absolute inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 border-2 border-white rounded-full -top-2 -start-2">
              {numberOfNotif}
            </div>
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
        <Menu.Items className="absolute left-0 z-10 mt-2 w-80 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none ">
          <div className="py-1 divide-gray-100 divide-y">
            {!!notifications.length ? (
              notifications.map((item, index) => (
                <Menu.Item key={index}>
                  {() => (
                    <div className="w-full px-4 py-2 text-sm flex flex-row items-center">
                      {item.text}
                    </div>
                  )}
                </Menu.Item>
              ))
            ) : (
              <Menu.Item>
                {() => (
                  <div className="w-full px-4 py-2 text-sm flex flex-row items-center">
                    اعلانی وجود ندارد.
                  </div>
                )}
              </Menu.Item>
            )}
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
};

export default Notifications;
