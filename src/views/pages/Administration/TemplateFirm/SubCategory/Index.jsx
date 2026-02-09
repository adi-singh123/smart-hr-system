import Breadcrumbs from "../../../../../components/Breadcrumbs";
import AddSubCategory from "../../../../../components/Administration/TemplateFirm/AddSubCategoryModal";
import SubCategoryTable from "./SubCategoryTable";

function TemplateFirmSubCategory() {
  return (
    <div className="page-wrapper">
      <div className="content container-fluid">
        <Breadcrumbs
          maintitle="Template Firm Sub Categories"
          title="Dashboard"
          subtitle="Template Firm / Sub Categories"
          modal="#add_sub_category"
          name="Add Sub Category"
        />
        <SubCategoryTable />
        <AddSubCategory />
      </div>
    </div>
  );
}

export default TemplateFirmSubCategory;
