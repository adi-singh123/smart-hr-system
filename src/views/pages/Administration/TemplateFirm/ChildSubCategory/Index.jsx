/** @format */

import Breadcrumbs from "../../../../../components/Breadcrumbs";
import AddChildSubCategory from "../../../../../components/Administration/TemplateFirm/AddChildSubCategory";
import ChildSubCategoryTable from "./ChildSubCategoryTable";

function TemplateFirmChildSubCategory() {
  return (
    <div className="page-wrapper">
      <div className="content container-fluid">
        <Breadcrumbs
          maintitle="Template Firm Child Sub Categories"
          title="Dashboard"
          subtitle="Template Firm / Child Sub Categories"
          modal="#add_child_sub_category"
          name="Add Child Sub Category"
        />
        <ChildSubCategoryTable />
        <AddChildSubCategory />
      </div>
    </div>
  );
}

export default TemplateFirmChildSubCategory;
