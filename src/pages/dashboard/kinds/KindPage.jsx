import { useNavigate, useParams } from "react-router-dom";
import { Tab } from "@headlessui/react";
import InfoTab from "../../../ui/components/kinds/kind-page/InfoTab";
import KindDetailsTab from "../../../ui/components/kinds/kind-page/KindDetailsTab";
import SupervisorsTab from "../../../ui/components/kinds/kind-page/SupervisorsTab";
import { useUser } from "../../../contexts/UserContext";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const KindPage = () => {
  const {user} = useUser()
  const navigate = useNavigate();
  const Supervisors = `${user?.role?.listSystemSet?.filter(item => item.number == 5 )[0]?.fieldValue ? user?.role?.listSystemSet?.filter(item => item.number == 5 )[0]?.fieldValue : ' ناظر'} ها`
  let { kindId } = useParams();
  let tabs = {
    "مشخصات": <InfoTab kindId={kindId} />,
    "سربرگ ها": <KindDetailsTab kindId={kindId} />,
    [Supervisors] : <SupervisorsTab kindId={kindId} />,
  };
  return (
    <div className="w-full sm:px-0">
      <div className="flex items-center mb-4">
        <div className="text-2xl font-black text-gray-600">
          ویرایش {user?.role?.listSystemSet?.filter(item => item.number == 11 )[0]?.fieldValue ? user?.role?.listSystemSet?.filter(item => item.number == 11 )[0]?.fieldValue : 'زیرمجموعه'}
        </div>
        <div className="w-5"></div>
        <button
          type="button"
          className="btn-primary w-fit !mb-0"
          onClick={() => navigate("/dashboard/kinds")}
        >
          لیست {user?.role?.listSystemSet?.filter(item => item.number == 11 )[0]?.fieldValue ? user?.role?.listSystemSet?.filter(item => item.number == 11 )[0]?.fieldValue : 'زیرمجموعه'} ها
        </button>
      </div>
      <Tab.Group>
        <div className="flex flex-col">
          <Tab.List className="flex flex-row space-x-3 space-x-reverse rounded-xl p-1">
            {Object.keys(tabs).map((category) => (
              <Tab
                key={category}
                className={({ selected }) =>
                  classNames(
                    "rounded-lg p-2 text-sm text-right ",
                    " focus:outline-none ",
                    selected
                      ? "btn-primary"
                      : 
                        "btn-primary !bg-inherit !text-gray-700 !shadow-none"
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

export default KindPage;
