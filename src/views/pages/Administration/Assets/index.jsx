import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Breadcrumbs from "../../../../components/Breadcrumbs";
import AssetsSearchFilter from "./AssetsSearchFilter";
import AssetsTable from "./AssetsTable";
import AddAssetPopup from "../../../../components/modelpopup/Assets/AddAssetpopup";
import { fetchAssets } from "../../../../Redux/services/Assets"; // adjust path if needed

const Assets = () => {
  const dispatch = useDispatch();
  const assetsState = useSelector((state) => state.assets);
  const { assets = [], loading } = assetsState || {};

  useEffect(() => {
    // fetch assets from backend on mount
    dispatch(fetchAssets());
  }, [dispatch]);

  return (
    <div className="page-wrapper">
      <div className="content container-fluid">
        <Breadcrumbs
          maintitle="Assets"
          title="Dashboard"
          subtitle="Assets"
          modal="#add_asset"
          name="Add Asset"
        />
        <AddAssetPopup />
        {/* <AssetsSearchFilter assetData={assets} setAssetData={() => {}} /> */}
        <AssetsTable assetData={assets} setAssetData={() => {}} />
      </div>
    </div>
  );
};

export default Assets;
