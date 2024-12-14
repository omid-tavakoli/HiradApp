import { useState, useEffect } from "react";
import { TreeView, TreeItem } from "@mui/x-tree-view";
import { Checkbox } from "@mui/material";
import { ChevronLeft, ExpandMore } from "@mui/icons-material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import useApi from "../../../hooks/useApi";
import BeatLoaderLoading from "../../element/loading/BeatLoader";
import { CheckIcon, TrashIcon } from "@heroicons/react/24/outline";
import { data } from "autoprefixer";

const theme = createTheme({
  direction: "rtl",
  palette: {
    primary: {
      main: "#b20206",
    },
  },
});

const cacheRtl = createCache({
  key: "muirtl",
});

const TreePermission = ({ setPermissionSelected, defaultValue }) => {
  const [list, setList] = useState([]);
  const [perList, setPerList] = useState([]);
  const [checked, setChecked] = useState([]);

  const request = useApi();

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    if (list.length != 0) {
      const defaultCheck = [];

      defaultValue?.forEach((item) => {
        defaultCheck.push(item.id);
        updateParentCheckbox(item.id, defaultCheck);
      });
    }

  }, [list]);

  useEffect(() => {
    const ids = checked.filter(
      (item) => !isNaN(item) && typeof item !== "string"
    );
    let selectedList = [];
    const uniqueIds = [...new Set(ids)];
    uniqueIds.map((item) =>
      selectedList.push(perList.find((acc) => acc.id === item)?.id)
    );
    setPermissionSelected(selectedList);
  }, [checked]);

  const getData = async () => {
    try {
      const { data } = await request.apiCall("get", `Permission/GetList`);
      setPerList(data);
      const groupedItems = [];
      data.forEach((item) => {
        const [keyword, ...rest] = item.displayName.split("-");
        const key = keyword.toLowerCase();

        if (!groupedItems[key]) {
          groupedItems[key] = {
            name: keyword,
            id: item.title,
            children: [],
          };
        }
        groupedItems[key].children.push({
          id: item.id,
          name: item.displayName,
        });
      });
      setList(Object.values(groupedItems));
    } catch (error) {
      console.log(error);
    }
  };

  const handleToggle = (id) => {
    const currentIndex = checked.indexOf(id);
    const newChecked = [...checked];
    if (currentIndex == -1) {
      newChecked.push(id);
    } else {
      newChecked.splice(currentIndex, 1);
    }
    setChecked(newChecked);

    updateParentCheckbox(id, newChecked);
  };

  const handleParentToggle = (parent) => {
    const parentIndex = checked.indexOf(parent.id);
    const newChecked = [...checked];
    if (parentIndex == -1) {
      newChecked.push(parent.id);
      parent.children.forEach((child) => {
        if (newChecked.indexOf(child.id) === -1) {
          newChecked.push(child.id);
        }
      });
    } else {
      newChecked.splice(parentIndex, 1);
      parent.children.forEach((child) => {
        const childIndex = newChecked.indexOf(child.id);
        if (childIndex !== -1) {
          newChecked.splice(childIndex, 1);
        }
      });
    }
    setChecked(newChecked);
  };

  const updateParentCheckbox = (itemId, newChecked) => {
    const item = perList.find((item) => item.id === itemId);

    if (item) {
      const parent = list.find((parentItem) =>
        parentItem.children.some((child) => child.id === itemId)
      );

      if (parent) {
        const allChildrenChecked = parent.children.every((child) =>
          newChecked.includes(child.id)
        );
        const parentIndex = newChecked.indexOf(parent.id);

        if (allChildrenChecked && parentIndex === -1) {
          newChecked.push(parent.id);
        } else if (!allChildrenChecked && parentIndex !== -1) {
          newChecked.splice(parentIndex, 1);
        }
        setChecked(newChecked);
      }
    }
  };

  const handleSelectAll = () => {
    const allIds = list.reduce((acc, curr) => {
      acc.push(curr.id);
      curr.children.forEach((child) => acc.push(child.id));
      return acc;
    }, []);
    setChecked(allIds);
  };

  const handleDeselectAll = () => {
    setChecked([]);
  };

  return (
    <>
      {request.loading && (
        <div className="w-full flex justify-center">
          <BeatLoaderLoading size={50} />
        </div>
      )}
      {request.error && "خطا در دیافت داده"}
      {list && (
        <>
          <div className="flex flex-col mt-4">
            <span className="text-sm text-gray-600 mb-4">دسترسی ها</span>
            <div className="flex flex-row space-x-4 space-x-reverse mb-2">
              <button
                onClick={handleSelectAll}
                className="w-full cursor-pointer flex justify-center rounded-md bg-white p-1.5 text-xs text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
              >
                <CheckIcon className="w-4 h-4 " />
                <span>انتخاب همه</span>
              </button>
              <button
                onClick={handleDeselectAll}
                className="w-full cursor-pointer flex justify-center rounded-md bg-white p-1.5 text-xs text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
              >
                <TrashIcon className="w-4 h-4 ml-1" />
                <span>حذف همه</span>
              </button>
            </div>

            <CacheProvider value={cacheRtl}>
              <ThemeProvider theme={theme}>
                <TreeView
                  defaultCollapseIcon={<ExpandMore />}
                  defaultExpandIcon={<ChevronLeft />}
                  sx={{ fontSize: ".75rem" }}
                >
                  {list.map((item) => (
                    <TreeItem
                      key={item.id}
                      nodeId={item.id.toString()}
                      sx={{
                        "& .muirtl-1vvwt8-MuiTreeItem-content.MuiTreeItem-content.Mui-selected":
                          { borderRadius: ".5rem !important" },
                        ".muirtl-1vvwt8-MuiTreeItem-content:hover": {
                          borderRadius: ".5rem !important",
                        },
                      }}
                      label={
                        <div className="text-xs">
                          <Checkbox
                            checked={checked.indexOf(item.id) !== -1}
                            onChange={() => handleParentToggle(item)}
                            onClick={(e) => e.stopPropagation()}
                            size="small"
                            sx={{ padding: ".5rem" }}
                          />
                          {item.name}
                        </div>
                      }
                    >
                      {item?.children.map((child) => (
                        <TreeItem
                          key={child.id}
                          nodeId={child.id.toString()}
                          sx={{
                            marginRight: "1rem",
                            "& .muirtl-1vvwt8-MuiTreeItem-content.MuiTreeItem-content.Mui-selected":
                              { borderRadius: ".5rem !important" },
                            ".muirtl-1vvwt8-MuiTreeItem-content:hover": {
                              borderRadius: ".5rem !important",
                            },
                          }}
                          label={
                            <div className="text-xs">
                              <Checkbox
                                checked={checked.indexOf(child.id) !== -1}
                                onChange={() => handleToggle(child.id)}
                                size="small"
                                sx={{ padding: ".5rem" }}
                              />
                              {child.name}
                            </div>
                          }
                        />
                      ))}
                    </TreeItem>
                  ))}
                </TreeView>
              </ThemeProvider>
            </CacheProvider>
          </div>
        </>
      )}
    </>
  );
};

export default TreePermission;
