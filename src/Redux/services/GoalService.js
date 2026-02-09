/** @format */
import axios from "axios";
import { HTTPURL } from "../../Constent/Matcher"; // Base URL

/**
 * Fetch all goals
 * @returns {Promise} Axios response
 */
export const getGoals = async () => {
  try {
    const res = await axios.get(`${HTTPURL}goals`);
    return res;
  } catch (err) {
    console.error("Error fetching goals:", err);
    throw err;
  }
};

/**
 * Add a new goal
 * @param {Object} data - Goal data
 * @returns {Promise} Axios response
 */
export const addGoal = async (data) => {
  try {
    const res = await axios.post(`${HTTPURL}goals`, data);
    return res;
  } catch (err) {
    console.error("Error adding goal:", err);
    throw err;
  }
};

/**
 * Update an existing goal
 * @param {string} id - Goal ID
 * @param {Object} data - Goal data to update
 * @returns {Promise} Axios response
 */
export const updateGoal = async (id, data) => {
  try {
    const res = await axios.put(`${HTTPURL}goals/${id}`, data);
    return res;
  } catch (err) {
    console.error(`Error updating goal ${id}:`, err);
    throw err;
  }
};

/**
 * Delete a goal
 * @param {string} id - Goal ID
 * @returns {Promise} Axios response
 */
export const deleteGoal = async (id) => {
  try {
    const res = await axios.delete(`${HTTPURL}goals/${id}`);
    return res;
  } catch (err) {
    console.error(`Error deleting goal ${id}:`, err);
    throw err;
  }
};
