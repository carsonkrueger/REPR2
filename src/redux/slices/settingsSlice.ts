import { createSlice } from "@reduxjs/toolkit";

import { Settings } from "../../types/settingsTypes";

const initialSettings: Settings = {
  isDarkMode: false,
};

export const settingsSlice = createSlice({
  name: "settings",
  initialState: initialSettings,
  reducers: {
    toggleDarkMode: (state: Settings) => {
      state.isDarkMode = !state.isDarkMode;
    },
  },
});

export const settingsReducer = settingsSlice.reducer;
export const { toggleDarkMode } = settingsSlice.actions;
