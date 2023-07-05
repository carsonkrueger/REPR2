import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { Profile } from "../../types/profileType";
import { supabase } from "../../types/supabaseClient";
import { profilesTable } from "../../types/dbTables";
import { Session } from "@supabase/supabase-js";

const initialSettings: Profile = {
  userId: 0,
  email: "",
  username: "",
  firstname: "",
  lastname: "",
  isPremium: false,
  isDarkMode: false,
  session: null,
};

export const getSession = createAsyncThunk("getSession", async () => {
  return await supabase.auth.getSession();
});

export const getProfile = createAsyncThunk("getProfile", async () => {
  const { data, error } = await supabase
    .from("profiles")
    .select("user_id, user_name, first_name, last_name, is_premium")
    .single();
  if (error) console.log("Error getting profile: ", error.message);
  return data as profilesTable;
});

export const profileSlice = createSlice({
  name: "profile",
  initialState: initialSettings,
  reducers: {
    toggleDarkMode(state) {
      state.isDarkMode = !state.isDarkMode;
    },
    setSession(state, action: PayloadAction<{ session: Session }>) {
      state.session = action.payload.session;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(getSession.fulfilled, (state, action) => {
        state.session = action.payload.data.session;
      })
      .addCase(getProfile.fulfilled, (state, action) => {
        if (action.payload) {
          state.userId = action.payload.user_id;
          state.firstname = action.payload.first_name;
          state.lastname = action.payload.last_name;
          state.username = action.payload.user_name;
          state.isPremium = action.payload.is_premium;
        }
      });
  },
});

export const profileReducer = profileSlice.reducer;
export const { toggleDarkMode, setSession } = profileSlice.actions;
