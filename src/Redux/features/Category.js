import { createSlice } from "@reduxjs/toolkit";
import {
  addCategory,
  addChildSubCategory,
  addSubCategory,
  deleteCategory,
  editCategory,
  editChildSubCategory,
  editSubCategory,
  getCategories,
  getChildSubCategories,
  getSubCategories,
} from "../services/Category";


const initialState = {
  isLoading: false,
  error: false,
  errorMsg: "",
  CategoryList: [],
  SubCategoryList: [],
  ChildSubCategoryList: [],
  editObject: {},
  editSubCategoryObject: {},
  editChildSubCategoryObject: {},
  token: localStorage.getItem("token"),
};

const categorySlice = createSlice({
  name: "Category",
  initialState,
  reducers: {
    editObjectList: (state, action) => {
      state.editObject = action?.payload;
    },
    editSubCategoryObjectList :(state, action) => {
      state.editSubCategoryObject = action?.payload
      console.log(state.editSubCategoryObject)
    },
    editChildSubCategoryObjectList: (state, action) => {
      state.editChildSubCategoryObject = action?.payload
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Categories
      .addCase(getCategories.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getCategories.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action?.payload?.status) {
          state.CategoryList = action.payload.data;
          state.error = false;
        }
      })
      .addCase(getCategories.rejected, (state, action) => {
        state.isLoading = false;
        state.error = true;
        state.errorMsg = action.error?.message || "Failed to fetch categories";
      })

      // Fetch Sub Categories
      .addCase(getSubCategories.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getSubCategories.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action?.payload?.status) {
          state.SubCategoryList = action.payload.data;
          state.error = false;
        }
      })
      .addCase(getSubCategories.rejected, (state, action) => {
        state.isLoading = false;
        state.error = true;
        state.errorMsg =
          action.error?.message || "Failed to fetch subcategories";
      })

      // Add Category
      .addCase(addCategory.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addCategory.fulfilled, (state) => {
        state.isLoading = false;
        state.error = false;
      })
      .addCase(addCategory.rejected, (state, action) => {
        state.isLoading = false;
        state.error = true;
        state.errorMsg = action.error?.message || "Failed to add category";
      })

      // Add Sub Category
      .addCase(addSubCategory.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addSubCategory.fulfilled, (state) => {
        state.isLoading = false;
        state.error = false;
      })
      .addCase(addSubCategory.rejected, (state, action) => {
        state.isLoading = false;
        state.error = true;
        state.errorMsg = action.error?.message || "Failed to add subcategory";
      })

      // Add Child Sub Category
      .addCase(addChildSubCategory.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addChildSubCategory.fulfilled, (state) => {
        state.isLoading = false;
        state.error = false;
      })
      .addCase(addChildSubCategory.rejected, (state, action) => {
        state.isLoading = false;
        state.error = true;
        state.errorMsg =
          action.error?.message || "Failed to add child subcategory";
      })

      // Fetch Child Sub Categories
      .addCase(getChildSubCategories.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getChildSubCategories.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action?.payload?.status) {
          state.ChildSubCategoryList = action.payload.data;
          state.error = false;
        }
      })
      .addCase(getChildSubCategories.rejected, (state, action) => {
        state.isLoading = false;
        state.error = true;
        state.errorMsg =
          action.error?.message || "Failed to fetch child subcategories";
      })
      .addCase(deleteCategory.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = false;
      })
      .addCase(deleteCategory.rejected, (state, action) => {
        state.isLoading = false;
        state.error = true;
        state.errorMsg = action.error?.message || "Failed to delete";
      })
      .addCase(editCategory.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(editCategory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = false;
      })
      .addCase(editCategory.rejected, (state, action) => {
        state.isLoading = false;
        state.error = true;
        state.errorMsg = action.error?.message || "Failed to edit";
      })
      .addCase(editSubCategory.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(editSubCategory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = false;
      })
      .addCase(editSubCategory.rejected, (state, action) => {
        state.isLoading = false;
        state.error = true;
        state.errorMsg = action.error?.message || "Failed to edit";
      })
      .addCase(editChildSubCategory.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(editChildSubCategory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = false;
      })
      .addCase(editChildSubCategory.rejected, (state, action) => {
        state.isLoading = false;
        state.error = true;
        state.errorMsg = action.error?.message || "Failed to edit";
      });
  },
});

export default categorySlice.reducer;
export const { editObjectList, editSubCategoryObjectList, editChildSubCategoryObjectList } = categorySlice.actions;
