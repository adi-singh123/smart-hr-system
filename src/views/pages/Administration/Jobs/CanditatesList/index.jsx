import React from "react";

import Breadcrumbs from "../../../../../components/Breadcrumbs";
import CandidatesTable from "./CandidatesTable";
// import AddCandidatesModal from "../../../../../components/Administration/Jobs/CandidatesModal/AddCandidatesModal";

const CanditatesList = () => {
  return (
    <>
      <div className="page-wrapper">
        <div className="content container-fluid">
          <Breadcrumbs
            maintitle="Candidates List"
            title="Dashboard"
            subtitle="Jobs / Candidates List"
            hideButton={true}  // 👈 This disables the button
          />

          <CandidatesTable />
          {/* <AddCandidatesModal /> */}
        </div>
      </div>
    </>
  );
};

export default CanditatesList;
