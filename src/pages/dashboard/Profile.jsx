import { Tab } from "@headlessui/react";
import PersonalInformation from "../../ui/components/profile/PersonalInformation";
import ChangePassword from "../../ui/components/profile/ChangePassword";
import ChangeMobile from "../../ui/components/profile/ChangeMobile";
import ChangeEmail from "../../ui/components/profile/ChangeEmail";
import { useState } from "react";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const Profile = () => {
  const [userData, setUserData] = useState(null);
  let tabs = {
    "اطلاعات حساب": <PersonalInformation setUserData={setUserData} />,
    "رمز عبور جدید": <ChangePassword userData={userData} />,
    "تغییر شماره موبایل": <ChangeMobile userData={userData} />,
  };

  return (
    <div className="w-full sm:px-0">
      <Tab.Group>
        <div className="flex flex-col">
          <Tab.List className="flex flex-row rounded-xl p-1">
            {Object.keys(tabs).map((category) => (
              <Tab
                key={category}
                className={({ selected }) =>
                  classNames(
                    "rounded-lg  text-sm text-right ",
                    " focus:outline-none ",
                    selected
                      ? "btn-primary"
                      : "btn-primary !bg-inherit !text-gray-700 !shadow-none"
                  )
                }
              >
                {category}
              </Tab>
            ))}
          </Tab.List>
          <Tab.Panels className="mt-2 basis-4/5">
            {Object.values(tabs).map((posts, idx) => (
              <Tab.Panel
                key={idx}
                className={classNames(
                  "rounded-xl bg-white shadow-sm p-4 h-full w-full"
                )}
              >
                {posts}
              </Tab.Panel>
            ))}
          </Tab.Panels>
        </div>
      </Tab.Group>
    </div>
  );
};

export default Profile;
