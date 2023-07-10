import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { Profile } from "../../types/profileType";
import { supabase } from "../../types/supabaseClient";
import { userMetaData } from "../../types/remoteDBTables";
import { Session } from "@supabase/supabase-js";
import { RootState } from "../store";

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
  const session = await supabase.auth.getSession();
  if (session.error) throw session.error;
  return session.data.session;
});

// export const getProfile = createAsyncThunk("getProfile", async () => {
//   const { data, error } = await supabase
//     .from("profiles")
//     .select("user_id, user_name, first_name, last_name, is_premium")
//     .single();
//   if (error) console.log("Error getting profile: ", error.message);
//   return data as profilesTable;
// });

export const profileSlice = createSlice({
  name: "profile",
  initialState: initialSettings,
  reducers: {
    toggleDarkMode(state) {
      state.isDarkMode = !state.isDarkMode;
    },
    setSession(state, action: PayloadAction<{ session: Session }>) {
      const { first_name, last_name, user_name } = action.payload.session.user
        .user_metadata as userMetaData;
      state.session = action.payload.session;
      state.email = action.payload.session.user.email ?? "";
      state.firstname = first_name;
      state.lastname = last_name;
      state.username = user_name;
    },
  },
  extraReducers(builder) {
    builder.addCase(getSession.fulfilled, (state, action) => {
      state.session = action.payload;
      if (action.payload) {
        const { first_name, last_name, user_name } = action.payload.user
          .user_metadata as userMetaData;
        state.session = action.payload;
        state.email = action.payload.user.email ?? "";
        state.firstname = first_name;
        state.lastname = last_name;
        state.username = user_name;
      }
    });
    // .addCase(getProfile.fulfilled, (state, action) => {
    //   if (action.payload) {
    //     state.userId = action.payload.user_id;
    //     state.firstname = action.payload.first_name;
    //     state.lastname = action.payload.last_name;
    //     state.username = action.payload.user_name;
    //     state.isPremium = action.payload.is_premium;
    //   }
    // });
  },
});

export const profileReducer = profileSlice.reducer;
export const { toggleDarkMode, setSession } = profileSlice.actions;

export const selectProfile = (state: RootState) => state.profile;
