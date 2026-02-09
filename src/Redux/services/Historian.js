import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { customAlert } from "../../utils/Alert";
import { HTTPURL } from "../../Constent/Matcher";
// add historian
export const Add_historian = createAsyncThunk(
    "/api/add-historian",
    async (formData, thunkAPI) => {
        const state = thunkAPI.getState();
        const token = state?.auth?.token;
        // const refreshToken = localStorage.getItem('refreshToken');
        const { rejectWithValue } = thunkAPI;
        try {
            let config = {
                method: 'Post',
                url: `${HTTPURL}add-blog`,
                headers: {
                    // "Content-Type": "application/json",
                    'Authorization': `Bearer ${token}`,
                    // 'refreshToken': `${refreshToken}`,
                },
                data: formData
            };
            const res = await axios.request(config);
            if (res?.data?.status == true) {
                customAlert(res?.data?.message, 'success');
            } else {
                customAlert(res?.data?.message);
            }
            return res.data;
        } catch (error) {
            customAlert(error?.response?.data ? error?.response?.data?.message : error?.message);
        }

    }

);

//get blogs
export const get_historian_data = createAsyncThunk(
    "api/all-blogs",
    async (SearchData, thunkAPI) => {
        const state = thunkAPI.getState();
        const token = state?.auth?.token;
        const refreshToken = localStorage.getItem('refreshToken');
        
        try {
            let config = {
                method: 'post',  // Use POST method
                url: `${HTTPURL}all-blogs`,  // Your API endpoint
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',  // Ensure the content type is set for JSON
                },
                data: {
                    filterData: SearchData  // Send the filterData (SearchData) in the request body
                }
            };

            // Make the POST request and return the response data
            const response = await axios.request(config);
            console.log("response",response)
            return response.data;  // The data returned from the backend

        } catch (error) {
            // Handle error and display appropriate message
            customAlert(error?.response?.data ? error?.response?.data?.message : error?.message);
        }
    }
);


// edit historian data
export const edit_historian_data = createAsyncThunk(
    "api/edit-blog",
    async (id, thunkAPI) => {
        const state = thunkAPI.getState();
        const token = state?.auth?.token;
        try {
            let config = {
                method: 'get',
                url: `${HTTPURL}edit-blog?id=${id}`,
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

// all contacts list 
export const get_historian_contact = createAsyncThunk(
    "api/all-historian-contact",
    async (SearchData, thunkAPI) => {
        const state = thunkAPI.getState();
        const token = state?.auth?.token;
        try {
            let config = {
                method: 'get',
                url: `${HTTPURL}all-historian-contact`,
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

export const deleteHistorian = createAsyncThunk(
    "api/delete-blog",
    async (id, thunkAPI) => {
      const state = thunkAPI.getState();
      const token = state?.auth?.token;
  
      try {
        let config = {
          method: "delete", // DELETE method
          url: `${HTTPURL}delete-blog/${id}`, // API endpoint with historian ID
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        };
  
        // Make the DELETE request
        const response = await axios.request(config);
        console.log("Delete Response:", response);
        if(response?.payload?.status===true){
        customAlert("Deleted Successfully");
        }
        return response.data; // Return backend response data
  
      } catch (error) {
        // Handle errors and display an alert
        customAlert(error?.response?.data ? error?.response?.data?.message : error?.message);
        return thunkAPI.rejectWithValue(error?.response?.data || error);
      }
    }
  );