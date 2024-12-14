import { useState, Fragment } from "react";
import Drawer from "@mui/material/Drawer";
import Sidebar from "../sidebar/Sidebar";
import getMenu from "../MenuItems";
import { NavLink } from "react-router-dom";
import { Transition, Menu } from "@headlessui/react";
import { ChevronDownIcon, Bars3Icon } from "@heroicons/react/24/outline";
import Logo from "../../../../assets/images/hirad-logo.png";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const MobileMenu = () => {
  const [open, setOpen] = useState(false);

  const toggleDrawer = (newOpen) => {
    setOpen(newOpen);
  };

  return (
    <>
      <button onClick={() => toggleDrawer(true)} className="lg:hidden">
        <Bars3Icon className="w-8 h-8" />
      </button>
      <Drawer anchor={"right"} open={open} onClose={() => toggleDrawer(false)}>
        <Sidebar mobile />
      </Drawer>
    </>
  );
};

export default MobileMenu;
