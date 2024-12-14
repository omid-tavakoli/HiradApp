import { PhotoIcon } from "@heroicons/react/24/outline";
import { useState } from "react";

const FileInput = ({ name, register, defaultValue, label }) => {
  const [value, setValue] = useState(null);

  const handleChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      setValue(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  return (
   

    <>
      <label
        htmlFor="cover-photo"
        className="block text-sm font-medium leading-6 text-gray-900"
      >
        {label}
      </label>
      <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-4">
        <div className="text-center">
          {value ? (
            <img src={value} className="mx-auto h-20" />
          ) : (
            <PhotoIcon
              className="mx-auto h-20 text-gray-300"
              aria-hidden="true"
            />
          )}
          <div className="mt-4 flex text-sm leading-6 text-gray-600">
            <label
              htmlFor="file-upload"
              className="relative cursor-pointer rounded-md bg-white font-semibold text-primary-700 focus-within:outline-none focus-within:ring-2 focus-within:ring-primary-600 focus-within:ring-offset-2 hover:text-primary-800"
            >
              <span className="ml-2 ">آپلود فایل</span>
              <input
                name={name}
                type="file"
                {...register(name)}
                id="file-upload"
                className="sr-only"
                onChange={handleChange}
              />
            </label>            <p className="pl-1">یا بکشید و رها کنید</p>
          </div>
          <p className="text-xs leading-5 text-gray-600">
            PNG, JPG, GIF up to 10MB
          </p>
        </div>
      </div>
    </>
  );
};

export default FileInput;
