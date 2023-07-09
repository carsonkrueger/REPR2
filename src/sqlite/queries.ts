import * as SQLite from "expo-sqlite";
import { Exercise, WorkoutSet, WorkoutState } from "../types/workoutTypes";
import { EntityState } from "@reduxjs/toolkit";
import {
  parsedWorkoutsTableRow,
  unparsedWorkoutsTableRow,
} from "../types/localDBTables";
import { parseWorkoutTableRow } from "../util/workoutUtils";
import { getCurDate } from "../util/dates";

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

export const sqlSelectAllTemplatesByDateDESC = () => {
  return new Promise<parsedWorkoutsTableRow[]>((resolve, reject) => {
    db.transaction((tx) =>
      tx.executeSql(
        "SELECT * FROM workout_templates ORDER BY last_performed DESC;",
        undefined,
        (_, result) => {
          const templates: parsedWorkoutsTableRow[] = result.rows._array.map(
            (obj: unparsedWorkoutsTableRow) =>
              parseWorkoutTableRow(obj as unparsedWorkoutsTableRow)
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

export const sqlSelectWorkoutInfoById = (id: number) => {
  return new Promise<parsedWorkoutsTableRow>((resolve, reject) => {
    db.transaction((tx) =>
      tx.executeSql(
        "SELECT workout_id, workout_state, exercises, sets, last_performed FROM workout_templates WHERE workout_id = ?;",
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

export const sqlPrintAllTemplatesByDateDESC = () => {
  db.transaction((tx) =>
    tx.executeSql(
      "SELECT * FROM workout_templates ORDER BY last_performed DESC;",
      undefined,
      (_, result) => console.log(result.rows._array),
      (_, error) => {
        console.log("Error printing all templates: ", error);
        return true;
      }
    )
  );
};

export const sqlInsertCurrentWorkoutTemplate = (
  workoutState: WorkoutState,
  exercises: EntityState<Exercise>,
  sets: EntityState<WorkoutSet>
) => {
  return new Promise<number>((resolve, reject) => {
    db.transaction((tx) =>
      tx.executeSql(
        "INSERT INTO workout_templates (workout_state, exercises, sets, last_performed) VALUES (?, ?, ?, ?);",
        [
          JSON.stringify(workoutState),
          JSON.stringify(exercises),
          JSON.stringify(sets),
          getCurDate(),
        ],
        (_, result) => resolve(result.insertId ?? -1),
        (_, error) => {
          console.log("Error inserting new workout template: ", error);
          reject(undefined);
          return true;
        }
      )
    );
  });
};

export const sqlUpdateWorkoutTemplate = (
  workoutId: number,
  workoutState: WorkoutState,
  exercises: EntityState<Exercise>,
  sets: EntityState<WorkoutSet>
) => {
  return new Promise((resolve, reject) => {
    db.transaction((tx) =>
      tx.executeSql(
        "INSERT OR REPLACE INTO workout_templates (workout_id, workout_state, exercises, sets, last_performed) VALUES (?, ?, ?, ?, date('now'));",
        [
          workoutId,
          JSON.stringify(workoutState),
          JSON.stringify(exercises),
          JSON.stringify(sets),
        ],
        (_) => resolve(undefined),
        (_, error) => {
          console.log("Error updating workout template: ", error);
          reject(undefined);
          return true;
        }
      )
    );
  });
};

export const sqlDeleteAllWorkoutRows = () => {
  db.transaction((tx) => {
    tx.executeSql("DELETE FROM workout_templates;");
  });
};

// export const getNextRowId = () => {
//   return new Promise<number>((resolve, reject) => {
//     db.transaction((tx) => {
//       tx.executeSql(
//         "SELECT last_insert_rowid() FROM workout_templates;",
//         undefined,
//         (_, result) => {
//           console.log("next row id: ", result.rows._array[0]);
//           resolve(
//             Number(
//               (result.rows._array[0] as { "last_insert_rowid()": number })[
//                 "last_insert_rowid()"
//               ]
//             ) + 1
//           );
//         },
//         (_, error) => {
//           console.log("Error updating workout template: ", error);
//           resolve(0);
//           return true;
//         }
//       );
//     });
//   });
// };
