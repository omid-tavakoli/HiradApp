import { styled } from "@mui/material/styles";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import useApi from "../../../hooks/useApi";
import ModalAction from "../../ModalAction";
import { useState } from "react";
import toast from "react-hot-toast";

const IOSSwitch = styled((props) => (
  <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
))(({ theme }) => ({
  width: 42,
  height: 26,
  padding: 0,
  "& .MuiSwitch-switchBase": {
    padding: 0,
    margin: 2,
    transitionDuration: "300ms",
    "&.Mui-checked": {
      transform: "translateX(16px)",
      color: "#fff",
      "& + .MuiSwitch-track": {
        backgroundColor: theme.palette.mode === "dark" ? "#2ECA45" : "#65C466",
        opacity: 1,
        border: 0,
      },
      "&.Mui-disabled + .MuiSwitch-track": {
        opacity: 0.5,
      },
    },
    "&.Mui-focusVisible .MuiSwitch-thumb": {
      color: "#33cf4d",
      border: "6px solid #fff",
    },
    "&.Mui-disabled .MuiSwitch-thumb": {
      color:
        theme.palette.mode === "light"
          ? theme.palette.grey[100]
          : theme.palette.grey[600],
    },
    "&.Mui-disabled + .MuiSwitch-track": {
      opacity: theme.palette.mode === "light" ? 0.7 : 0.3,
    },
  },
  "& .MuiSwitch-thumb": {
    boxSizing: "border-box",
    width: 22,
    height: 22,
  },
  "& .MuiSwitch-track": {
    borderRadius: 26 / 2,
    backgroundColor: theme.palette.mode === "light" ? "#E9E9EA" : "#39393D",
    opacity: 1,
    transition: theme.transitions.create(["background-color"], {
      duration: 500,
    }),
  },
}));

const IsLockUser = ({ targetItem, updateList }) => {
  const [modalContent, setModalContent] = useState(null);
  const [showModal, setShowModal] = useState([]);
  const request = useApi();

  const handleChange = (id) => {
    setModalContent({
      title: "تغییر وضعیت کاربر",
      onSubmitTitle: "تایید",
      onSubmit: () => onChange(id),
      children: (
        <div>
          آیا مطمئن هستید که می خواهید کاربر
          <span className="font-bold mx-1">
            {" "}
            {targetItem?.name} {targetItem?.family}{" "}
          </span>
          را {targetItem.isLock == 0 ? "غیر فعال" : "فعال"} کنید؟
        </div>
      ),
      id: id,
      loading: request.loading,
    });
    setShowModal(true);
  };

  const onChange = async () => {
    try {
      const response = await request.apiCall(
        "post",
        `User/Lock/${targetItem?.userId}/${!targetItem.isLock ? 1 : 0}`
      );

      if (response?.isSuccess) {
        toast.success(
          `کاربر با موفقیت ${targetItem.isLock == 0 ? "غیر فعال" : "فعال"} شد`
        );
        updateList();
        setShowModal(false);
      }
    } catch (error) {
      console.log("ERR", error);
    }
  };

  return (
    <>
      <FormControlLabel
        control={
          <IOSSwitch
            sx={{ m: 1 }}
            checked={!targetItem.isLock}
            onChange={() => handleChange()}
          />
        }
      />
      {showModal && modalContent && (
        <ModalAction
          {...modalContent}
          show={showModal}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
};

export default IsLockUser;
