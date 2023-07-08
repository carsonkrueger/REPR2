import * as SQLite from "expo-sqlite";
import { Exercise, WorkoutSet, WorkoutState } from "../types/workoutTypes";
import { EntityState } from "@reduxjs/toolkit";
import {
  parsedWorkoutsTableRow,
  unparsedWorkoutsTableRow,
} from "../types/localDBTables";
import { parseWorkoutTableRow } from "../util/workoutUtils";

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

export const selectAllTemplatesByDateDESC = () => {
  return new Promise<parsedWorkoutsTableRow[]>((resolve, reject) => {
    db.transaction((tx) =>
      tx.executeSql(
        "SELECT * FROM workout_templates ORDER BY last_performed DESC;",
        undefined,
        (_, result) => {
          const templates: parsedWorkoutsTableRow[] = result.rows._array.map(
            (obj: unparsedWorkoutsTableRow) => parseWorkoutTableRow(obj)
          );
          resolve(templates);
        },
        (_, error) => {
          console.log("Error selecting all templates: ", error);
          reject(undefined);
          return true;
        }
      )
    );
  });
};

export const selectWorkoutInfoById = (id: number) => {
  return new Promise<parsedWorkoutsTableRow>((resolve, reject) => {
    db.transaction((tx) =>
      tx.executeSql(
        "SELECT * FROM workout_templates WHERE workout_id = ?;",
        [id],
        (_, result) => {
          const template = parseWorkoutTableRow(
            result.rows._array[0] as unparsedWorkoutsTableRow
          );
          resolve(template);
        },
        (_, error) => {
          console.log("Error selecting template: ", error);
          reject(undefined);
          return true;
        }
      )
    );
  });
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

export const insertCurrentWorkoutTemplate = (
  workoutState: WorkoutState,
  exercises: EntityState<Exercise>,
  sets: EntityState<WorkoutSet>
) => {
  let insertedId = -1;

  db.transaction((tx) =>
    tx.executeSql(
      "INSERT INTO workout_templates (workout_state, exercises, sets, last_performed) VALUES (?, ?, ?, date('now'));",
      [
        JSON.stringify(workoutState),
        JSON.stringify(exercises),
        JSON.stringify(sets),
      ],
      (tx, rs) => (insertedId = rs.insertId ?? -1),
      (_, error) => {
        console.log("Error inserting new workout template: ", error);
        return true;
      }
    )
  );

  return insertedId;
};

export const updateWorkoutTemplate = (
  workoutState: WorkoutState,
  exercises: EntityState<Exercise>,
  sets: EntityState<WorkoutSet>
) => {
  db.transaction((tx) =>
    tx.executeSql(
      "INSERT OR REPLACE INTO workout_templates (workout_id, workout_state, exercises, sets, last_performed) VALUES (?, ?, ?, ?, date('now'));",
      [
        workoutState.id,
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
