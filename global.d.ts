import { Database as DB } from "./src/types/database.types";

//// npx supabase gen types typescript --project-id {reference id} > src/types/database.types.ts
declare global {
  type Database = DB;
  type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"];
  type PostRow = Database["public"]["Tables"]["posts"]["Row"];
  type LikeRow = Database["public"]["Tables"]["likes"]["Row"];
  type FollowingRow = Database["public"]["Tables"]["following"]["Row"];
  type SharedWorkoutTemplateRow =
    Database["public"]["Tables"]["shared_workout_templates"]["Row"];
}
