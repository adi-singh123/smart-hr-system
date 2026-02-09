import { Table } from "antd";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getCategories } from "../../../../../Redux/services/Category";
import DeleteCategory from "../../../../../components/Administration/TemplateFirm/DeleteCategory";
import EditCategory from "../../../../../components/Administration/TemplateFirm/EditCategoryModal";
import {editObjectList} from "../../../../../Redux/features/Category"

const CategoryTable = () => {
  const dispatch = useDispatch();
  const { CategoryList } = useSelector((state) => state?.category);
  const [currentId, setCurrentId] = useState("");

  useEffect(() => {
    if (!CategoryList?.length) {
      dispatch(getCategories());
    }
  }, [CategoryList, dispatch]);

  const data = CategoryList?.map((item, index) => ({
    sno: index,
    id: item?.id,
    name: item?.name,
    is_active: item?.is_active ? "Yes" : "No",
  }));

  const handleDelete = (id) => {
    setCurrentId(id); 
  };

  const handleEdit = async (id, name, is_active) => {
    dispatch(editObjectList({
      id,
      name,
      is_active: is_active === "Yes"?true: false
    }))
  }

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
            data-bs-target="#edit_category"
            onClick={() => handleEdit(record.id, record.name, record.is_active)}
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

        <DeleteCategory id={currentId} name="category" />
        <EditCategory />
      </div>
    </div>
  );
};

export default CategoryTable;
