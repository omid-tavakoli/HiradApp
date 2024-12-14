import { useState, useEffect } from "react";
import BeatLoaderLoading from "../../element/loading/BeatLoader";
import SelectboxForm from "../../element/SelectboxForm";

const RoleUsers = ({ data, val, onSubmit, onClose, loading, id }) => {
  const [selectedList, setSelectedList] = useState([]);

  useEffect(() => {
    setSelectedList(val || []);
  }, [val]);

  const handleChange = (value) => {
    setSelectedList(value);
  };

  return (
    <>
      <SelectboxForm
        field={{
          value: selectedList,
          onChange: handleChange,
        }}
        options={data}
        placeholder="کاربر های مد نظر خود را انتخاب کنید"
        isMulti={true}
        disabled={loading}
      />
      <div className="px-4 mt-6 !-mb-4 sm:flex sm:flex-row sm:justify-center sm:px-6">
        <button
          type="button"
          disabled={loading}
          className="btn-primary"
          onClick={() => onSubmit(selectedList, id)}
        >
          {!loading ? (
            "ثبت تغییرات"
          ) : (
            <BeatLoaderLoading size={20} color="#fff" />
          )}
        </button>
        <button
          type="button"
          className="btn-secondary"
          onClick={onClose}
        >
          بستن
        </button>
      </div>
    </>
  );
};

export default RoleUsers;