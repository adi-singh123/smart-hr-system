import Breadcrumbs from "../../../../../components/Breadcrumbs";
import AddCategory from "../../../../../components/Administration/TemplateFirm/AddCategoryModal";
import CategoryTable from "./CategoryTable"
function TemplateFirmCategory() {
  return (
    <div className="page-wrapper">
      <div className="content container-fluid">
        <Breadcrumbs
          maintitle="Template Firm Categories"
          title="Dashboard"
          subtitle="Template Firm / Categories"
          modal="#add_category"
          name="Add Category"
        />
        <CategoryTable />
        <AddCategory />
      </div>
    </div>
  );
}

export default TemplateFirmCategory;
