import { decode } from "base64-arraybuffer";
import { supabase } from "../types/supabaseClient";

export async function uploadToSupabase(
  base64Image: string,
  bucketName: string,
  pathUrl: string,
  imageExtension = "jpg"
): Promise<string | null> {
  try {
    const base64Str = base64Image.includes("base64,")
      ? base64Image.substring(base64Image.indexOf("base64,") + "base64,".length)
      : base64Image;
    const res = decode(base64Str);

    if (!(res.byteLength > 0)) {
      console.error("[uploadToSupabase] ArrayBuffer is null");
      return null;
    }

    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(pathUrl, res, {
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
