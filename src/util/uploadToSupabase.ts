import { decode } from "base64-arraybuffer";
import { supabase } from "../types/supabaseClient";

export async function uploadToSupabase(
  base64Image: string,
  bucketName: string,
  pathUrl: string,
  imageExtension = "jpg"
): Promise<string | null> {
  try {
    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(pathUrl, decode(base64Image), {
        contentType: `image/${imageExtension}`,
      });

    if (!data) {
      console.error("[uploadToSupabase] Data is null");
      return null;
    }

    if (error) {
      console.error("[uploadToSupabase] upload: ", error);
      return null;
    }

    return data.path;
  } catch (err) {
    console.error(err);
    return null;
  }
}
