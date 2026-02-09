/** @format */

import React from "react";
import Breadcrumbs from "../../../../../components/Breadcrumbs";
import AddImages from "../../../../../components/Administration/TemplateFirm/AddImageModal";
import ImageFilter from "./ImageFilter";
import ImageTable from "./ImageTable";

function TemplateFirm() {
  return (
    <div className="page-wrapper">
      <div className="content container-fluid">
        <Breadcrumbs
          maintitle="Template Firm"
          title="Dashboard"
          subtitle="Template Firm"
          modal="#add_image"
          name="Add Images"
        />
        {/* <ImageFilter /> */}
        <ImageTable />
        <AddImages />
      </div>
    </div>
  );
}

export default TemplateFirm;
