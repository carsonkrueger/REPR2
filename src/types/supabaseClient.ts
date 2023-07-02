import "react-native-url-polyfill/auto";
import * as SecureStore from "expo-secure-store";
import { createClient } from "@supabase/supabase-js";

const ExpoSecureStoreAdapter = {
  getItem: (key: string) => {
    return SecureStore.getItemAsync(key);
  },
  setItem: (key: string, value: string) => {
    SecureStore.setItemAsync(key, value);
  },
  removeItem: (key: string) => {
    SecureStore.deleteItemAsync(key);
  },
};

export const supabase = createClient(
  "https://tvfpapotstohiuiydymm.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR2ZnBhcG90c3RvaGl1aXlkeW1tIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODgwODI4MjgsImV4cCI6MjAwMzY1ODgyOH0.krmtxPWhsp_2AQqZdRHHWHPc_XR87QEwFON4hy5faGo",
  {
    auth: {
      storage: ExpoSecureStoreAdapter as any,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  }
);
