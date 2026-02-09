import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { customAlert } from "../../utils/Alert";
import { HTTPURL } from "../../Constent/Matcher";
export const getSubCategories = createAsyncThunk(
    "auth/sub-category-list",

    async () => {
        try {
            let config = {
                method: 'get',
                url: `${HTTPURL}sub-category-list`,
            };
            const response = await axios.request(config)
            return response.data;
        } catch (error) {
            customAlert(error?.response?.data ? error?.response?.data?.message : error?.message);
        }
    }
);

export const getRoles = createAsyncThunk(
    "auth/all-roles",
    async (SearchData, thunkAPI) => {
        const state = thunkAPI.getState();
        const token = state?.auth?.token;
        try {
            let config = {
                method: 'get',
                url: `${HTTPURL}all-roles`,
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            };
            const response = await axios.request(config)
            return response.data;
        } catch (error) {
            customAlert(error?.response?.data ? error?.response?.data?.message : error?.message);
        }
    }
);
