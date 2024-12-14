import React, { useEffect, useState } from "react";
import { useUser } from "../../contexts/UserContext";

const MassExamList = ({
  data,
  setSelectedProject,
  selectedProject,
  setSubSysKindId,
  setShowModal,
}) => {
  const [selectedIds, setSelectedIds] = useState([]);
  const [selectedSubSysKindIds, setSelectedSubSysKindIds] = useState([]);
  const [filter, setFilter] = useState("");
  const { user } = useUser();

  useEffect(() => {
    if (selectedProject.length > 0) {
      setSelectedIds(selectedProject);
    }
  }, [selectedProject]);

  useEffect(() => {
    setSelectedProject(selectedIds);
    setSubSysKindId(selectedSubSysKindIds);
  }, [selectedIds, selectedSubSysKindIds, setSelectedProject, setSubSysKindId]);

  const toggleSelect = (id, subSysKindId) => {
    setSelectedIds((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((selectedId) => selectedId !== id)
        : [...prevSelected, id]
    );
    setSelectedSubSysKindIds((prevSelected) =>
      prevSelected.includes(subSysKindId)
        ? prevSelected.filter(
            (selectedSubSysKindId) => selectedSubSysKindId !== subSysKindId
          )
        : [...prevSelected, subSysKindId]
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === data.length) {
      setSelectedIds([]);
      setSelectedSubSysKindIds([]);
    } else {
      setSelectedIds(data.map((item) => item.id));
      setSelectedSubSysKindIds(data.map((item) => item.subSysKindId));
    }
  };

  const filteredData = data.filter(
    (item) =>
      item.subSysKindName.toLowerCase().includes(filter.toLowerCase()) ||
      item.title.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="flex flex-col items-center">
      <div>
        <button className="btn-primary !mb-4 w-28" onClick={toggleSelectAll}>
          {selectedIds.length === data.length ? "لغو انتخاب همه" : "انتخاب همه"}
        </button>
      </div>
      <div className="mb-4 w-3/4">
        <input
          type="text"
          className="input-primary"
          placeholder={`فیلتر بر اساس نام ${user?.role?.listSystemSet?.filter(item => item.number == 11 )[0]?.fieldValue ? user?.role?.listSystemSet?.filter(item => item.number == 11 )[0]?.fieldValue : 'زیرمجموعه'} یا نام معدن`}
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
      </div>
      <div className="flex gap-4 flex-wrap justify-center sm:w-[41rem]">
        {filteredData.map((item) => (
          <div
            key={item.id}
            className="flex flex-col items-center gap-y-2 border rounded-xl p-2.5 w-72"
          >
            <div className="flex gap-x-2">
              <label>نام:</label>
              <h3>{item.title}</h3>
            </div>
            <div className="flex gap-x-2">
              <label>نام {user?.role?.listSystemSet?.filter(item => item.number == 11 )[0]?.fieldValue ? user?.role?.listSystemSet?.filter(item => item.number == 11 )[0]?.fieldValue : 'زیرمجموعه'}:</label>
              <h3>{item.subSysKindName}</h3>
            </div>
            <button
              className="btn-primary"
              onClick={() => toggleSelect(item.id, item.subSysKindId)}
            >
              {selectedIds.includes(item.id) ? "لغو انتخاب" : "انتخاب"}
            </button>
          </div>
        ))}
      </div>
      <button
        className="btn-primary mt-4 w-28"
        onClick={() => setShowModal(false)}
      >
        تایید
      </button>
    </div>
  );
};

export default MassExamList;
