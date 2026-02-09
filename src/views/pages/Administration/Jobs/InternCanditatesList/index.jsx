/** @format */

import React from "react";

import Breadcrumbs from "../../../../../components/Breadcrumbs";
import InternCandidatesTable from "./InternCanditatesTable";
import { DownloadOutlined } from "@ant-design/icons";
import { exportInternCandidatesExcel } from "./InternCanditatesTable";
import { fetchInternshipApplications } from "../../../../../Redux/services/InternshipForm";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
const InternCandidatesList = () => {
  const dispatch = useDispatch();
  const { internshipApplications, loading } = useSelector(
    (state) => state.internship
  );

  useEffect(() => {
    dispatch(fetchInternshipApplications());
  }, [dispatch]);
  return (
    <>
      <div className="page-wrapper">
        <div className="content container-fluid">
          <div className="d-flex justify-content-between align-items-center mb-3">
            {/* LEFT SIDE → Breadcrumbs */}
            <Breadcrumbs
              maintitle="Internship Candidates"
              title="Dashboard"
              subtitle="Internship / Candidates List"
              hideButton={true}
            />

            {/* RIGHT SIDE → Download Button */}
            <button
              className="btn btn-success"
              onClick={() =>
                exportInternCandidatesExcel(internshipApplications)
              }
            >
              <DownloadOutlined /> Download Excel
            </button>
          </div>

          <InternCandidatesTable />
        </div>
      </div>
    </>
  );
};

export default InternCandidatesList;
