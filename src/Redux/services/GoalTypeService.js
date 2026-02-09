/** @format */

import axios from "axios";
import { HTTPURL } from "../../Constent/Matcher"; // base URL

// ✅ Fetch all goal types
export const getGoalTypes = async () => {
  try {
    const res = await axios.get(`${HTTPURL}goal-types`);
    // Return only the actual array from backend response
    return res.data.data || [];
  } catch (err) {
    console.error("Error fetching goal types:", err);
    throw err;
  }
};

// ✅ Add a new goal type
export const addGoalType = async (data) => {
  try {
    const res = await axios.post(`${HTTPURL}goal-types`, data);
    return res.data;
  } catch (err) {
    console.error("Error adding goal type:", err);
    throw err;
  }
};

// ✅ Update an existing goal type
export const updateGoalType = async (id, data) => {
  try {
    const res = await axios.put(`${HTTPURL}goal-types/${id}`, data);
    return res.data;
  } catch (err) {
    console.error("Error updating goal type:", err);
    throw err;
  }
};

// ✅ Delete a goal type
export const deleteGoalType = async (id) => {
  try {
    const res = await axios.delete(`${HTTPURL}goal-types/${id}`);
    return res.data;
  } catch (err) {
    console.error("Error deleting goal type:", err);
    throw err;
  }
};
