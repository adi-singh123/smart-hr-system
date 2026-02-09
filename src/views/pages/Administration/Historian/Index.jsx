/** @format */

import React, { useState } from "react";

import Breadcrumbs from "../../../../components/Breadcrumbs";
import HistorianFilter from "./HistorianFilter";
import HistorianTable from "./HistorianTable";
import AddHistorian from "../../../../components/Administration/Historian/AddHistorianModal";

const Historian = () => {
  return (
    <div className="page-wrapper">
      <div className="content container-fluid">
        <Breadcrumbs
          maintitle="Historian "
          title="Dashboard"
          subtitle="Historian"
          modal="#add_user"
          name="Add Historian"
        />

        <HistorianTable />
        <AddHistorian />
      </div>
    </div>
  );
};

export default Historian;
