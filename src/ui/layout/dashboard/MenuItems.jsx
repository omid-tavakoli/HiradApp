import {
  CogIcon,
  UserGroupIcon,
  ServerStackIcon,
  QuestionMarkCircleIcon,
  ChevronLeftIcon,
  HomeIcon,
  MapPinIcon,
  DocumentIcon,
  ShoppingBagIcon,
  TagIcon,
  UserIcon,
  ClipboardDocumentListIcon,
  ShieldCheckIcon,
  Cog6ToothIcon,
  CalendarIcon,
  WrenchScrewdriverIcon,
  ServerIcon,
  CalculatorIcon,
  ChatBubbleLeftEllipsisIcon,
  AdjustmentsVerticalIcon,
  ClipboardIcon,
  CurrencyDollarIcon,
} from "@heroicons/react/24/outline";
import DeviceHubOutlinedIcon from "@mui/icons-material/DeviceHubOutlined";
import WorkOutlineOutlinedIcon from "@mui/icons-material/WorkOutlineOutlined";

const getMenu = ( listSystemSet ) => {

  return [
    {
      title: "داشبورد",
      icon: <HomeIcon className="m-1 h-5 w-5" aria-hidden="true" />,
      path: "/dashboard",
      requiredPermission: "User-FillProfile",
      end: true,
    },
    {
      title: "پروفایل",
      icon: <UserIcon className="m-1 h-5 w-5" aria-hidden="true" />,
      path: "profile",
      requiredPermission: "User-FillProfile",
    },
    {
      title: "تعاریف اولیه سیستم",
      icon: (
        <AdjustmentsVerticalIcon className="m-1 h-5 w-5" aria-hidden="true" />
      ),
      children: [
        {
          title: "مدیریت کاربران",
          icon: <UserGroupIcon className="m-1 h-5 w-5" aria-hidden="true" />,
          path: "users",
          requiredPermission: "User-GetAllSubUser",
        },
        {
          title: `${listSystemSet?.filter(item => item.number == 11 )[0]?.fieldValue ? listSystemSet?.filter(item => item.number == 11 )[0]?.fieldValue : 'زیرمجموعه'} ها`,
          icon: <TagIcon className="m-1 h-5 w-5" aria-hidden="true" />,
          path: "kinds",
          requiredPermission: "SubSysKind-GetList",
        },
        {
          title: `${listSystemSet?.filter(item => item.number == 8 )[0]?.fieldValue ? listSystemSet?.filter(item => item.number == 8 )[0]?.fieldValue : 'مناطق'} ها`,
          icon: <MapPinIcon className="m-1 h-5 w-5" aria-hidden="true" />,
          path: "zones",
          requiredPermission: "Zone-GetList",
        },
        {
          title: "فرمول ها",
          icon: <CalculatorIcon className="m-1 h-5 w-5" aria-hidden="true" />,
          path: "formulas",
          requiredPermission: "CalculationFormula-GetList",
        },
        {
          title: "دسترسی ها",
          icon: <ShieldCheckIcon className="m-1 h-5 w-5" aria-hidden="true" />,
          path: "access",
          requiredPermission: "Role-GetList",
        },
      ],
      requiredPermission: "User-FillProfile",
    },
    {
      title: ` مدیریت  ${listSystemSet.filter(item => item.number == 2 )[0]?.fieldValue ? listSystemSet.filter(item => item.number == 2 )[0]?.fieldValue: 'پروژه'} ها`,
      icon: (
        <WorkOutlineOutlinedIcon className="m-1 h-5 w-5" aria-hidden="true" />
      ),
      path: "projects",
      requiredPermission: "Project-GetList",
    },
    {
      title: `سوالات و  ${listSystemSet.filter(item => item.number == 4 )[0]?.fieldValue  ? listSystemSet.filter(item => item.number == 4 )[0]?.fieldValue : 'ارزیابی'} ها`,
      icon: <ClipboardIcon className="m-1 h-5 w-5" aria-hidden="true" />,
      children: [
        {
          title: "مدیریت دسته بندی سوالات",
          icon: (
            <QuestionMarkCircleIcon
              className="m-1 h-5 w-5"
              aria-hidden="true"
            />
          ),
          path: "sk-groups",
          requiredPermission: "SKGroup-GetList",
        },
        {
          title: `مدیریت ${listSystemSet?.filter(item => item.number == 4 )[0]?.fieldValue  ? listSystemSet?.filter(item => item.number == 4 )[0]?.fieldValue : 'ارزیابی'} ها`,
          icon: (
            <ClipboardDocumentListIcon
              className="m-1 h-5 w-5"
              aria-hidden="true"
            />
          ),
          path: "exams-management",
          requiredPermission: "Exam-GetList",
        },
        {
          title: `${listSystemSet?.filter(item => item.number == 4 )[0]?.fieldValue  ? listSystemSet?.filter(item => item.number == 4 )[0]?.fieldValue : 'ارزیابی'} های من`,
          icon: (
            <ClipboardDocumentListIcon
              className="m-1 h-5 w-5"
              aria-hidden="true"
            />
          ),
          path: "exams",
          requiredPermission: "Exam-GetExamListByUserId",
        },
        {
          title: `بررسی ${listSystemSet?.filter(item => item.number == 4 )[0]?.fieldValue  ? listSystemSet?.filter(item => item.number == 4 )[0]?.fieldValue : 'ارزیابی'} ها`,
          icon: (
            <ClipboardDocumentListIcon
              className="m-1 h-5 w-5"
              aria-hidden="true"
            />
          ),
          path: "exams-review",
          requiredPermission: "Exam-GetExamListByUserId",
        },
      ],
      requiredPermission: "User-FillProfile",
    },
    {
      title: "ارسال پیام",
      icon: <ChatBubbleLeftEllipsisIcon className="m-1 h-5 w-5" />,
      path: "send-notification",
      requiredPermission: "Notification-Add",
    },
    {
      title: "پروفایل سیستم",
      icon: <ServerIcon className="m-1 h-5 w-5" />,
      path: "system-profile",
      requiredPermission: "SubSys-Get",
    },
    {
      title: "تنظیمات زیر سیستم",
      icon: <Cog6ToothIcon className="m-1 h-5 w-5" aria-hidden="true" />,
      path: "settings",
      requiredPermission: "SubSystemSet-GetList",
    },
    {
      title: "فاکتورها",
      icon: <CurrencyDollarIcon className="m-1 h-5 w-5" aria-hidden="true" />,
      path: "factors",
      requiredPermission: "Factor-GetList",
    },
    {
      title: " پیامک ها",
      icon: (
        <ChatBubbleLeftEllipsisIcon
          className="m-1 h-5 w-5"
          aria-hidden="true"
        />
      ),
      path: "sms",
      requiredPermission: "sms",
    },
    {
      title: "مدیریت پکیج ها",
      icon: <ShoppingBagIcon className="m-1 h-5 w-5" aria-hidden="true" />,
      children: [
        {
          title: "خرید پکیج",
          icon: <ChevronLeftIcon className="m-1 h-5 w-5" aria-hidden="true" />,
          path: "packages/buy",
          requiredPermission: "Package-Buy",
        },
        {
          title: "سوابق پکیج ها",
          icon: <ChevronLeftIcon className="m-1 h-5 w-5" aria-hidden="true" />,
          path: "packages/history",
          requiredPermission: "Package-GetSubSysPackageList",
        },
      ],
    },
    {
      title: "تنظیمات ادمین",
      icon: <Cog6ToothIcon className="m-1 h-5 w-5" aria-hidden="true" />,
      children: [
        {
          title: "نوع های سیستم",
          icon: (
            <DeviceHubOutlinedIcon className="m-1 h-5 w-5" aria-hidden="true" />
          ),
          path: "types",
          requiredPermission: "SubType-GetList",
        },
        {
          title: "زیر سیستم ها",
          icon: <ServerStackIcon className="m-1 h-5 w-5" aria-hidden="true" />,
          path: "sub-systems",
          requiredPermission: "SubSys-GetList",
        },
        {
          title: "کاربران سیستم",
          icon: <UserGroupIcon className="m-1 h-5 w-5" aria-hidden="true" />,
          path: "system/users",
          requiredPermission: "User-GetList",
        },
        {
          title: "تنظیمات کلی",
          icon: <Cog6ToothIcon className="m-1 h-5 w-5" aria-hidden="true" />,
          path: "settings-system",
          requiredPermission: "SystemSet-GetList",
        },
        {
          title: "فاکتور سیستم ها",
          icon: (
            <CurrencyDollarIcon className="m-1 h-5 w-5" aria-hidden="true" />
          ),
          path: "submit-payment",
          requiredPermission: "Factor-GetListPayment",
        },
        {
          title: "پکیج های سیستم",
          icon: <ShoppingBagIcon className="m-1 h-5 w-5" aria-hidden="true" />,
          path: "packages/systems-package",
          requiredPermission: "Package-GetList",
        },
        {
          title: "لاگ ها",
          icon: <CogIcon className="m-1 h-5 w-5" aria-hidden="true" />,
          path: "logs",
          requiredPermission: "Log-GetList",
        },
      ],
    },
    {
      title: `پروفایل ${listSystemSet.filter(item => item.number == 5 )[0]?.fieldValue2 ? listSystemSet?.filter(item => item.number == 5 )[0]?.fieldValue2 : 'پیمانکار'}`,
      icon: <WrenchScrewdriverIcon className="m-1 h-5 w-5" />,
      path: "contractor-profile",
      requiredPermission: "Contractor-Get",
    },
  ];
};

export default getMenu;
