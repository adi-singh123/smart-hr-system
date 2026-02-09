/** @format */

import { Table } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getImages } from "../../../../../Redux/services/Image";
import { editImageFunction } from "../../../../../Redux/features/Image";
import {
  DeleteImageModal,
  EditImage,
  ViewImageModal,
} from "../../../../../components/Administration/TemplateFirm/EditAndDeleteImageModa";
import { HTTPURL } from "../../../../../Constent/Matcher";

const ImageTable = () => {
  const dispatch = useDispatch();
  const ImageList = useSelector((state) => state?.image?.images); // API se aaya data
  const { isLoading } = useSelector((state) => state.image);
  const [currentId, setCurrentId] = useState("");

  useEffect(() => {
    dispatch(getImages());
  }, [dispatch]);

  const handleEdit = (id, title, description, is_active, image_url) => {
    dispatch(
      editImageFunction({
        id,
        title,
        description,
        is_active,
        imageUrl: `${HTTPURL}${image_url}`, // <- yaha bhi same
      })
    );
  };

  const handleView = (record) => {
    dispatch(
      editImageFunction({
        id: record.id,
        title: record.title,
        description: record.description,
        is_active: record.is_active,
        imageUrl: `${HTTPURL}${record.image_url}`, // <- yahi fix hai
      })
    );
  };

  const handleDelete = (id) => {
    setCurrentId(id);
  };

  // API se aayi data ko table compatible banana
  const data = ImageList?.map((item, index) => ({
    sno: index + 1,
    id: item.id,
    title: item.title,
    description: item.description,
    is_active: item.is_active ? "Yes" : "No",
    image_url: item.image_url,
  }));

  const columns = [
    {
      title: "S.No",
      dataIndex: "sno",
      sorter: (a, b) => a.sno - b.sno,
    },
    {
      title: "Title",
      dataIndex: "title",
    },
    {
      title: "Image",
      dataIndex: "imageUrl",
      render: (url) =>
        url ? (
          <img
            src={url}
            alt="thumb"
            style={{
              width: 60,
              height: 40,
              objectFit: "cover",
              borderRadius: 4,
            }}
          />
        ) : (
          "No Image"
        ),
    },
    {
      title: "Description",
      dataIndex: "description",
      render: (text) => (
        <div
          style={{
            wordWrap: "break-word",
            overflowWrap: "break-word",
            whiteSpace: "normal",
          }}
        >
          {text}
        </div>
      ),
    },
    {
      title: "Is active",
      dataIndex: "is_active",
    },
    {
      title: "Action",
      render: (text, record) => (
        <div className="d-flex gap-2">
          {/* View Button */}
          <button
            className="btn btn-info btn-sm"
            data-bs-toggle="modal"
            data-bs-target="#view_image"
            onClick={() => handleView(record)}
          >
            <i className="fa fa-eye"></i> View
          </button>

          {/* Edit Button */}
          <button
            className="btn btn-primary btn-sm"
            data-bs-toggle="modal"
            data-bs-target="#edit_image"
            onClick={() =>
              handleEdit(
                record.id,
                record.title,
                record.description,
                record.is_active,
                record.image_url
              )
            }
          >
            <i className="fa fa-pencil"></i> Edit
          </button>

          {/* Delete Button */}
          <button
            className="btn btn-danger btn-sm"
            data-bs-toggle="modal"
            data-bs-target="#delete_image"
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
            dataSource={
              Array.isArray(ImageList)
                ? ImageList.map((item, index) => ({
                    ...item,
                    sno: index + 1,
                    imageUrl: `${HTTPURL}${item.image_url}`, // backend ka key
                    is_active: item.is_active ? "Yes" : "No", // boolean to Yes/No
                  }))
                : []
            }
            rowKey={(record) => record.id}
            loading={isLoading}
          />
        </div>
        <EditImage />
        <DeleteImageModal id={currentId} />
        <ViewImageModal />
      </div>
    </div>
  );
};

export default ImageTable;
