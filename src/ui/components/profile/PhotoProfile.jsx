import { UserCircleIcon } from "@heroicons/react/24/solid";
import useApi from "../../../hooks/useApi";
import useAuth from "../../../hooks/useAuth";
import Img from "../../element/Img";

const PhotoProfile = ({ pic, userId  , profileSystem}) => {
  const request = useApi();

  const { refreshUser } = useAuth();

  const handleChange = async (e) => {
    const formData = new FormData();
    formData.append("id", userId);
    formData.append("file", e.target.files[0]);

    try {
      !profileSystem && await request.apiCall(
        "post",
        "User/UploadProfile",
        formData,
        {
          "Content-Type": "multipart/form-data",
        }
      );
      profileSystem &&  
      await request.apiCall(
        "post",
        "SubSys/UploadLogo",
        formData,
        {
          "Content-Type": "multipart/form-data",
        }
      )
      
      profileSystem &&   profileSystem()
      !profileSystem  && refreshUser();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className=" flex flex-row items-center w-fit my-4 space-x-2 space-x-reverse">
      {pic ? (
        <Img src={pic} className="w-24 h-24 rounded-full border" />
      ) : (
        <UserCircleIcon
          className="h-24 w-24 text-gray-300"
          aria-hidden="true"
        />
      )}
      <div className="flex text-sm leading-6 text-gray-600">
        <label
          htmlFor="file-upload"
          className="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
        >
          <span>آپلود فایل</span>
          <input
            name={"photo"}
            type="file"
            id="file-upload"
            className="sr-only"
            onChange={(e) => handleChange(e)}
          />
        </label>
      </div>
    </div>
  );
};

export default PhotoProfile;
