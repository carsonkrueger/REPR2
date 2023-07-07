import * as SQLite from "expo-sqlite";
import { workoutsTableRow } from "../types/localDBTables";
import { Exercise, WorkoutSet, WorkoutState } from "../types/workoutTypes";
import { EntityState } from "@reduxjs/toolkit";

const db = SQLite.openDatabase("repr_local");

export const initWorkoutTemplatesTable = () => {
  db.transaction((tx) =>
    tx.executeSql(
      "CREATE TABLE IF NOT EXISTS workout_templates (workout_id INTEGER PRIMARY KEY AUTOINCREMENT, workout_state STRING, exercises STRING, sets STRING, last_performed STRING);",
      undefined,
      undefined,
      (_, error) => {
        console.log("Error creating workouts_template table: ", error);
        return true;
      }
    )
  );
};

export const selectAllTemplatesByDateDESC = ():
  | SQLite.SQLResultSet
  | undefined => {
  let selection = undefined;
  db.transaction((tx) =>
    tx.executeSql(
      "SELECT * FROM workout_templates ORDERY BY last_performed DESC;",
      undefined,
      (_, result) => {
        selection = result;
      },
      (_, error) => {
        console.log("Error selecting all templates: ", error);
        return true;
      }
    )
  );
  return selection;
};

export const selectTemplateById = (
  id: number
): SQLite.SQLResultSet | undefined => {
  let selection: SQLite.SQLResultSet | undefined = undefined;
  db.transaction((tx) =>
    tx.executeSql(
      "SELECT * FROM workout_templates WHERE workout_id = ?;",
      [id],
      (_, result) => {
        selection = result;
      },
      (_, error) => {
        console.log("Error selecting template: ", error);
        return true;
      }
    )
  );
  return selection;
};

export const printAllTemplatesByDateDESC = () => {
  db.transaction((tx) =>
    tx.executeSql(
      "SELECT * FROM workout_templates ORDERY BY last_performed DESC;",
      undefined,
      (_, result) => console.log(result.rows._array),
      (_, error) => {
        console.log("Error printing all templates: ", error);
        return true;
      }
    )
  );
};

export const insertNewWorkoutTemplate = (
  workoutState: WorkoutState,
  exercises: EntityState<Exercise>,
  sets: EntityState<WorkoutSet>
) => {
  db.transaction((tx) =>
    tx.executeSql(
      "INSERT INTO workout_templates (workout_state, exercises, sets, last_performed) VALUES (?, ?, ?, date('now'));",
      [
        JSON.stringify(workoutState),
        JSON.stringify(exercises),
        JSON.stringify(sets),
      ],
      undefined,
      (_, error) => {
        console.log("Error inserting new workout template: ", error);
        return true;
      }
    )
  );
};

export const updateWorkoutTemplate = (
  workoutId: number,
  workoutState: WorkoutState,
  exercises: EntityState<Exercise>,
  sets: EntityState<WorkoutSet>
) => {
  db.transaction((tx) =>
    tx.executeSql(
      "INSERT OR REPLACE INTO workout_templates (workout_id, workout_state, exercises, sets, last_performed) VALUES (?, ?, ?, ?, date('now'));",
      [
        workoutId,
        JSON.stringify(workoutState),
        JSON.stringify(exercises),
        JSON.stringify(sets),
      ],
      undefined,
      (_, error) => {
        console.log("Error updating workout template: ", error);
        return true;
      }
    )
  );
};
