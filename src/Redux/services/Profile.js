/** @format */

import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { customAlert } from "../../utils/Alert";
import { HTTPURL } from "../../Constent/Matcher";
// Define the async thunk for form submission
export const submitPersonalInfo = createAsyncThunk(
  "/api/submit-personal-info",
  async (formData, thunkAPI) => {
    const state = thunkAPI.getState();
    const token = state?.auth?.token;
    try {
      let config = {
        method: "post",
        url: `${HTTPURL}save-personal-info/`,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        data: formData,
      };
      console.log("Sending Data", config.url);
      const res = await axios.request(config);
      if (res?.data?.status == true) {
        customAlert(res?.data?.message, "success");
      } else {
        customAlert(res?.data?.message);
      }
      return res.data;
    } catch (error) {
      customAlert(
        error?.response?.data ? error?.response?.data?.message : error?.message
      );
    }
  }
);
export const submit_emergency_contact = createAsyncThunk(
  "/api/submit-emergency-contact",
  async (formData, thunkAPI) => {
    const state = thunkAPI.getState();
    const token = state?.auth?.token; // Get token from state

    try {
      const config = {
        method: "post",
        url: `${HTTPURL}save-emergency-contact`, // Adjust endpoint if needed
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        data: formData, // The form data passed from React Hook Form
      };
      console.log("Sending EmergencyInfo", formData);
      console.log("Sending Emergency Contact Data", config.url);

      const res = await axios.request(config);

      if (res?.data?.status === true) {
        customAlert(res?.data?.message, "success"); // Display success message
      } else {
        customAlert(res?.data?.message); // Display error message
      }

      return res.data; // Return the response data to be used in the reducer
    } catch (error) {
      customAlert(
        error?.response?.data ? error?.response?.data?.message : error?.message,
        "error" // Alert with error style
      );
    }
  }
);
export const fetchPersonalInfo = createAsyncThunk(
  "/api/fetch-personal-info",
  async (userId, thunkAPI) => {
    const state = thunkAPI.getState();
    const token = state?.auth?.token;

    try {
      let config = {
        method: "get",
        url: `${HTTPURL}personal-info/${userId}`,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };

      console.log("Sending request to:", config.url); // Optional, for debugging
      const res = await axios.request(config); // Send the request
      if (res?.data.data) {
        return res.data;
      }
    } catch (error) {
      customAlert(
        error?.response?.data ? error?.response?.data?.message : error?.message
      );
      return thunkAPI.rejectWithValue(error?.response?.data || error.message);
    }
  }
);
export const fetchEmergencyContact = createAsyncThunk(
  "/api/fetch-emergency-contact",
  async (userId, thunkAPI) => {
    const state = thunkAPI.getState();
    const token = state?.auth?.token;

    try {
      let config = {
        method: "get",
        url: `${HTTPURL}emergency-contacts/${userId}`,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      };

      console.log("Sending request to:", config.url); // Optional, for debugging
      const res = await axios.request(config); // Send the request
      if (res?.data.data) {
        return res.data; // Return the response data if available
      }
    } catch (error) {
      customAlert(
        error?.response?.data ? error?.response?.data?.message : error?.message
      );
      return thunkAPI.rejectWithValue(error?.response?.data || error.message); // Handle errors
    }
  }
);

export const submit_bank_details = createAsyncThunk(
  "/api/submit-bank-details",
  async (formData, thunkAPI) => {
    const state = thunkAPI.getState();
    const token = state?.auth?.token; // Get token from state

    try {
      const config = {
        method: "post",
        url: `${HTTPURL}save-bank-details`, // Adjust endpoint if needed
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        data: formData, // The form data passed from React Hook Form
      };
      console.log(formData);
      console.log("Sending Bank Details Data", config.url);

      const res = await axios.request(config);

      if (res?.data?.status === true) {
        customAlert(res?.data?.message, "success"); // Display success message
      } else {
        customAlert(res?.data?.message); // Display error message
      }

      return res.data; // Return the response data to be used in the reducer
    } catch (error) {
      customAlert(
        error?.response?.data ? error?.response?.data?.message : error?.message,
        "error" // Alert with error style
      );
    }
  }
);

export const fetchBankDetails = createAsyncThunk(
  "/api/fetch-bank-details",
  async (userId, thunkAPI) => {
    const state = thunkAPI.getState(); // Access the Redux state
    const token = state?.auth?.token; // Extract the token from state

    try {
      // Define the request configuration
      let config = {
        method: "get",
        url: `${HTTPURL}bank-details/${userId}`,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      };

      console.log("Sending request to:", config.url);

      const res = await axios.request(config);

      if (res?.data.data) {
        return res.data;
      }
    } catch (error) {
      customAlert(error?.response?.data?.message || error.message);

      return thunkAPI.rejectWithValue(error?.response?.data || error.message);
    }
  }
);

export const submit_family_information = createAsyncThunk(
  "/api/submit-family-information",
  async (formData, thunkAPI) => {
    const state = thunkAPI.getState();
    const token = state?.auth?.token;
    try {
      const config = {
        method: "post",
        url: `${HTTPURL}save-family-information`,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        data: formData,
      };
      console.log(formData);
      console.log("Sending Family Information Data", config.url);

      const res = await axios.request(config);

      if (res?.data?.status === true) {
        customAlert(res?.data?.message, "success");
      } else {
        customAlert(res?.data?.message);
      }

      return res.data;
    } catch (error) {
      customAlert(
        error?.response?.data ? error?.response?.data?.message : error?.message,
        "error"
      );
    }
  }
);

export const fetchFamilyInfo = createAsyncThunk(
  "/api/fetch-family-info",
  async (userId, thunkAPI) => {
    const state = thunkAPI.getState(); // Access the Redux state
    const token = state?.auth?.token; // Extract the token from state

    try {
      // Define the request configuration
      let config = {
        method: "get",
        url: `${HTTPURL}family-info/${userId}`, // Adjust endpoint as needed
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      };

      console.log("Sending request to:", config.url);

      const res = await axios.request(config);

      if (res?.data?.data) {
        return res.data; // Return the data on success
      }
    } catch (error) {
      customAlert(error?.response?.data?.message || error.message); // Show error alert

      return thunkAPI.rejectWithValue(error?.response?.data || error.message); // Reject with error data
    }
  }
);

export const update_family_information = createAsyncThunk(
  "/api/update-family-information",
  async (formData, thunkAPI) => {
    const state = thunkAPI.getState();
    const token = state?.auth?.token; // Get auth token from Redux state

    try {
      const config = {
        method: "PUT", // Use PUT or PATCH for updating data
        url: `${HTTPURL}update-family-information/${formData.id}`, // API endpoint
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        data: formData,
      };

      console.log("Updating Family Information Data", formData);
      console.log("API Request:", config.url);

      const res = await axios.request(config);

      if (res?.data?.status === true) {
        customAlert(res?.data?.message, "success");
      } else {
        customAlert(res?.data?.message);
      }

      return res.data; // Return updated data
    } catch (error) {
      customAlert(
        error?.response?.data ? error?.response?.data?.message : error?.message,
        "error"
      );
      return thunkAPI.rejectWithValue(error?.response?.data);
    }
  }
);
export const submit_education_information = createAsyncThunk(
  "/api/submit-education-information",
  async (formData, thunkAPI) => {
    const state = thunkAPI.getState();
    const token = state?.auth?.token;

    try {
      const config = {
        method: "POST",
        url: `${HTTPURL}submit-education-information`,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        data: formData,
      };

      console.log("Submitting Education Information Data", formData);
      console.log("API Request:", config.url);

      const res = await axios.request(config);

      if (res?.data?.status === true) {
        customAlert(res?.data?.message, "success");
      } else {
        customAlert(res?.data?.message);
      }

      return res.data;
    } catch (error) {
      customAlert(
        error?.response?.data ? error?.response?.data?.message : error?.message,
        "error"
      );
      return thunkAPI.rejectWithValue(error?.response?.data); // Return error data for rejection
    }
  }
);
export const submit_exp_details = createAsyncThunk(
  "/api/submit-experience-details",
  async (formData, thunkAPI) => {
    const state = thunkAPI.getState();

    const token = state?.auth?.token;
    try {
      const config = {
        method: "POST",
        url: `${HTTPURL}submit-experience-details`,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        data: formData,
      };

      console.log("Submitting Experience Details Data", formData);
      console.log("API Request:", config.url);

      const res = await axios.request(config);

      if (res?.data?.status === true) {
        customAlert(res?.data?.message, "success");
      } else {
        customAlert(res?.data?.message);
      }

      return res.data;
    } catch (error) {
      customAlert(
        error?.response?.data ? error?.response?.data?.message : error?.message,
        "error"
      );
      return thunkAPI.rejectWithValue(error?.response?.data); // Return error data for rejection
    }
  }
);

export const fetchExperienceInfo = createAsyncThunk(
  "/api/fetch-experience-info",
  async (userId, thunkAPI) => {
    const state = thunkAPI.getState();
    const token = state?.auth?.token;

    try {
      let config = {
        method: "get",
        url: `${HTTPURL}experience-info/${userId}`,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };

      console.log("Sending request to:", config.url); // Optional, for debugging
      const res = await axios.request(config); // Send the request
      if (res?.data.data) {
        return res.data;
      }
    } catch (error) {
      customAlert(
        error?.response?.data ? error?.response?.data?.message : error?.message
      );
      return thunkAPI.rejectWithValue(error?.response?.data || error.message);
    }
  }
);
export const fetchEducationInfo = createAsyncThunk(
  "/api/fetch-education-info",
  async (userId, thunkAPI) => {
    const state = thunkAPI.getState();
    const token = state?.auth?.token;

    try {
      let config = {
        method: "get",
        url: `${HTTPURL}education-info/${userId}`,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      };

      console.log("Sending request to:", config.url); // Optional, for debugging
      const res = await axios.request(config); // Send the request
      if (res?.data.data) {
        return res.data; // Return the response data if available
      }
    } catch (error) {
      customAlert(
        error?.response?.data ? error?.response?.data?.message : error?.message
      );
      return thunkAPI.rejectWithValue(error?.response?.data || error.message); // Handle errors
    }
  }
);

export const submitProfileInfo = createAsyncThunk(
  "/api/submit-profile-info", // Action type for this request
  async (formData, thunkAPI) => {
    const state = thunkAPI.getState();
    const token = state?.auth?.token; // Get token from state

    try {
      const config = {
        method: "post",
        url: `${HTTPURL}save-profile-info`, // Adjust endpoint if needed
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        data: formData, // The form data passed from React Hook Form
      };

      console.log("Sending Profile Info", formData);
      console.log("Sending Profile Data to:", config.url);

      const res = await axios.request(config);

      if (res?.data?.status === true) {
        customAlert(res?.data?.message, "success"); // Display success message
      } else {
        customAlert(res?.data?.message); // Display error message
      }

      return res.data; // Return the response data to be used in the reducer
    } catch (error) {
      customAlert(
        error?.response?.data ? error?.response?.data?.message : error?.message,
        "error" // Alert with error style
      );
    }
  }
);

export const fetchProfileInfo = createAsyncThunk(
  "/api/fetch-profile-info",
  async (userId, thunkAPI) => {
    const state = thunkAPI.getState();
    const token = state?.auth?.token;

    try {
      let config = {
        method: "get",
        url: `${HTTPURL}profile-info/${userId}`, // Assuming the endpoint is /profile-info/{userId}
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      };

      console.log("Sending request to:", config.url); // Optional, for debugging
      const res = await axios.request(config); // Send the request

      if (res?.data.data) {
        return res.data; // Return the response data if available
      }
    } catch (error) {
      customAlert(
        error?.response?.data ? error?.response?.data?.message : error?.message
      );
      return thunkAPI.rejectWithValue(error?.response?.data || error.message); // Handle errors
    }
  }
);

export const add_asset = createAsyncThunk(
  "api/add-asset",
  async (assetData, { getState, rejectWithValue }) => {
    const state = getState();
    const token = state?.auth?.token;
    const refreshToken = localStorage.getItem("refreshToken");

    try {
      const response = await axios.post(`${HTTPURL}add-asset`, assetData, {
        headers: {
          Authorization: `Bearer ${token}`,
          refreshToken: `${refreshToken}`,
          "Content-Type": "application/json",
        },
      });

      if (response?.data?.status === true) {
        customAlert(response?.data?.message, "success"); // Display success message
      } else {
        customAlert(response?.data?.message); // Display error message
      }
      return response.data;
    } catch (error) {
      const errorMessage = error?.response?.data?.message || error.message;
      customAlert(errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);
export const fetchAsset = createAsyncThunk(
  "api/fetch-asset",
  async (assetName, { getState, rejectWithValue }) => {
    const state = getState();
    const token = state?.auth?.token;

    try {
      const response = await axios.post(
        `${HTTPURL}get-assets`,
        { assetName }, // Pass assetName in the request body
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      const errorMessage = error?.response?.data?.message || error.message;
      return rejectWithValue(errorMessage);
    }
  }
);

export const deleteAsset = createAsyncThunk(
  "/api/delete-asset",
  async (assetId, thunkAPI) => {
    const { rejectWithValue, getState } = thunkAPI;
    const state = getState();
    const token = state?.auth?.token; // Get token from Redux state

    try {
      const config = {
        method: "DELETE",
        url: `${HTTPURL}delete-asset/${assetId}`, // Ensure your API expects the id in the URL
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };

      const res = await axios.request(config);
      console.log("Delete Asset Response: ", res);

      if (res?.data?.status === true) {
        customAlert(res?.data?.message, "success");
      } else {
        customAlert(res?.data?.message || "Something went wrong", "error");
      }

      return res.data;
    } catch (error) {
      const errorMessage = error?.response?.data?.message || error.message;
      customAlert(errorMessage, "error");
      return rejectWithValue(errorMessage);
    }
  }
);

export const addBank = createAsyncThunk(
  "/api/add-bank",
  async (bankData, thunkAPI) => {
    const { rejectWithValue, getState } = thunkAPI;
    const state = getState();
    const token = state?.auth?.token; // Get token from Redux state

    try {
      const config = {
        method: "POST",
        url: `${HTTPURL}add-bank`,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        data: bankData, // Bank details passed from the form
      };

      const res = await axios.request(config);
      console.log("Add Bank Response: ", res);

      if (res?.data?.status === true) {
        customAlert(res?.data?.message, "success");
      } else {
        customAlert(res?.data?.message || "Something went wrong", "error");
      }

      return res.data;
    } catch (error) {
      const errorMessage = error?.response?.data?.message || error.message;
      customAlert(errorMessage, "error");
      return rejectWithValue(errorMessage);
    }
  }
);
export const fetchBank = createAsyncThunk(
  "/api/fetch-bank",
  async (userId, thunkAPI) => {
    const { rejectWithValue, getState } = thunkAPI;
    const state = getState();
    const token = state?.auth?.token;

    try {
      const config = {
        method: "GET",
        url: `${HTTPURL}fetch-bank/${userId}`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const res = await axios.request(config);
      console.log("Fetch Bank Response: ", res);

      if (res?.data?.status === true) {
        // If data is empty or undefined, ensure we return an empty object.
        if (!res.data.data) {
          res.data.data = {};
        }
        return res.data;
      } else {
        return rejectWithValue(
          res?.data?.message || "Failed to fetch bank details"
        );
      }
    } catch (error) {
      const errorMessage = error?.response?.data?.message || error.message;
      return rejectWithValue(errorMessage);
    }
  }
);
