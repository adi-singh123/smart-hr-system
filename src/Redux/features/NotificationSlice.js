/** @format */

import { createSlice } from "@reduxjs/toolkit";
import {
  fetchNotifications,
  markNotificationsRead,
  clearAllNotifications,
  clearNotificationsByIds, // ✅ import new thunk
} from "../services/Notifications";

const initialState = {
  notifications: [],
  unreadCount: 0,
  loading: false,
};

const notificationsSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    setNotifications: (state, action) => {
      state.notifications = action.payload;
      state.unreadCount = action.payload.filter((n) => !n.is_read).length;
    },
    addNotification: (state, action) => {
      state.notifications.unshift(action.payload);
      state.unreadCount += 1;
    },
    markAllRead: (state) => {
      state.notifications = state.notifications.map((n) => ({
        ...n,
        is_read: true,
      }));
      state.unreadCount = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      // ✅ Fetch notifications
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload?.data) {
          state.notifications = action.payload.data;
          state.unreadCount = action.payload.data.filter(
            (n) => !n.is_read
          ).length;
        }
      })
      .addCase(fetchNotifications.rejected, (state) => {
        state.loading = false;
      })

      // ✅ Mark all as read
      .addCase(markNotificationsRead.fulfilled, (state) => {
        state.notifications = state.notifications.map((n) => ({
          ...n,
          is_read: true,
        }));
        state.unreadCount = 0;
      })

      // ✅ Clear all notifications
      .addCase(clearAllNotifications.fulfilled, (state) => {
        state.notifications = [];
        state.unreadCount = 0;
      })

      // ✅ Clear specific notifications by IDs
      .addCase(clearNotificationsByIds.fulfilled, (state, action) => {
        const deletedIds = action.meta.arg; // ids jo humne bheje the
        state.notifications = state.notifications.filter(
          (n) => !deletedIds.includes(n.id)
        );
        state.unreadCount = state.notifications.filter(
          (n) => !n.is_read
        ).length;
      });
  },
});

export const { setNotifications, addNotification, markAllRead } =
  notificationsSlice.actions;
export default notificationsSlice.reducer;
