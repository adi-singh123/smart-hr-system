import { Table } from "antd";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getSubCategories } from "../../../../../Redux/services/Category";
import DeleteCategory from "../../../../../components/Administration/TemplateFirm/DeleteCategory";
import EditSubCategory from "../../../../../components/Administration/TemplateFirm/EditSubCategoryModal";
import { editSubCategoryObjectList } from "../../../../../Redux/features/Category";

const SubCategoryTable = () => {
  const dispatch = useDispatch();
  const { SubCategoryList } = useSelector((state) => state?.category);
  const [currentId, setCurrentId] = useState("");

  useEffect(() => {
    if (!SubCategoryList?.length) {
      dispatch(getSubCategories());
    }
  }, [SubCategoryList, dispatch]);
  const data = SubCategoryList?.map((item, index) => ({
    sno: index,
    id: item?.id,
    name: item?.name,
    is_active: item?.is_active ? "Yes" : "No",
  }));

  const handleDelete = (id) => {
    setCurrentId(id);
  };

  const handleEdit = (sno) => {
    dispatch(editSubCategoryObjectList(SubCategoryList[sno]));
  };

  const columns = [
    {
      title: "S.No",
      dataIndex: "sno",
      sorter: (a, b) => a.sno - b.sno,
    },
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Is active",
      dataIndex: "is_active",
    },
    {
      title: "Action",
      render: (text, record) => (
        <div className="d-flex gap-2">
          <button
            className="btn btn-primary btn-sm"
            data-bs-toggle="modal"
            data-bs-target="#edit_sub_category"
            onClick={() => handleEdit(record.sno)}
          >
            <i className="fa fa-pencil"></i> Edit
          </button>

          <button
            className="btn btn-danger btn-sm"
            data-bs-toggle="modal"
            data-bs-target="#delete_category"
            onClick={() => handleDelete(record.id)}
          >
            <i className="fa fa-trash"></i> Delete
          </button>
        </div>
      ),
    },
  ];
  return (
    <div className="row">
      <div className="col-md-12">
        <div className="table-responsive">
          <Table
            className="table-striped"
            style={{ overflowX: "auto" }}
            columns={columns}
            dataSource={data}
            rowKey={(record) => record.id}
          />
        </div>
        <DeleteCategory id={currentId} name="sub-category" />
        <EditSubCategory />
      </div>
    </div>
  );
};

export default SubCategoryTable;
