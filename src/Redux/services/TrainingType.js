/** @format */

// services/TrainingType.js
import axios from "axios";
import { HTTPURL } from "../../Constent/Matcher.jsx"; // adjust your base URL

const BASE_URL = `${HTTPURL}/training-types`;

export const getTrainingTypes = async () => {
  try {
    const res = await axios.get(BASE_URL);
    return res.data;
  } catch (err) {
    console.error("Error fetching training types:", err);
    throw err;
  }
};

export const addTrainingType = async (payload) => {
  try {
    const res = await axios.post(BASE_URL, payload);
    return res.data;
  } catch (err) {
    console.error("Error adding training type:", err);
    throw err;
  }
};

export const updateTrainingType = async (id, payload) => {
  try {
    const res = await axios.put(`${BASE_URL}/${id}`, payload);
    return res.data;
  } catch (err) {
    console.error("Error updating training type:", err);
    throw err;
  }
};

export const deleteTrainingType = async (id) => {
  try {
    const res = await axios.delete(`${BASE_URL}/${id}`);
    return res.data;
  } catch (err) {
    console.error("Error deleting training type:", err);
    throw err;
  }
};
