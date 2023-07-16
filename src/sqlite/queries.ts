import * as SQLite from "expo-sqlite";
import { Exercise, WorkoutSet, WorkoutState } from "../types/workoutTypes";
import { EntityState } from "@reduxjs/toolkit";
import {
  exerciseHistoryTableRow,
  exercisesTableRow,
  parsedWorkoutsTableRow,
  unparsedWorkoutsTableRow,
  workoutHistoryTableRow,
} from "../types/localDBTables";
import { parseWorkoutTableRow } from "../util/workoutUtils";
import { getCurDate } from "../util/dates";
import { ExerciseMetric, WorkoutMetric } from "../types/metricsTypes";

const db = SQLite.openDatabase("repr_local");

export const initWorkoutTemplatesTable = async () => {
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

  db.transaction((tx) =>
    tx.executeSql(
      "CREATE TABLE IF NOT EXISTS exercises (exercise_id INTEGER PRIMARY KEY AUTOINCREMENT, exercise_name STRING, best_weight INTEGER, best_reps INTEGER);",
      undefined,
      undefined,
      (_, error) => {
        console.log("Error creating exercises table: ", error);
        return true;
      }
    )
  );

  db.transaction((tx) =>
    tx.executeSql(
      "CREATE TABLE IF NOT EXISTS workout_history (workout_history_id INTEGER PRIMARY KEY AUTOINCREMENT, workout_name STRING, workout_time INTEGER, num_prs INTEGER, performed STRING);",
      undefined,
      undefined,
      (_, error) => {
        console.log("Error creating workout_history table: ", error);
        return true;
      }
    )
  );

  db.transaction((tx) =>
    tx.executeSql(
      "CREATE TABLE IF NOT EXISTS exercise_history (exercise_history_id INTEGER PRIMARY KEY AUTOINCREMENT, workout_history_id INTEGER, exercise_name STRING, num_sets INTEGER, best_weight INTEGER, best_reps INTEGER, total_volume INTEGER);",
      undefined,
      undefined,
      (_, error) => {
        console.log("Error creating exercises table: ", error);
        return true;
      }
    )
  );
};

export async function sqlSelectAllTemplatesByDateDESC() {
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
}

export async function sqlSelectWorkoutInfoById(id: number) {
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
}

export function sqlPrintAllTemplatesByDateDESC() {
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
}

export async function sqlInsertCurrentWorkoutTemplate(
  workoutState: WorkoutState,
  exercises: EntityState<Exercise>,
  sets: EntityState<WorkoutSet>
) {
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
}

export async function sqlUpdateWorkoutTemplate(
  workoutId: number,
  workoutState: WorkoutState,
  exercises: EntityState<Exercise>,
  sets: EntityState<WorkoutSet>
) {
  return new Promise((resolve, reject) => {
    db.transaction((tx) =>
      tx.executeSql(
        "INSERT OR REPLACE INTO workout_templates (workout_id, workout_state, exercises, sets, last_performed) VALUES (?, ?, ?, ?, ?);",
        [
          workoutId,
          JSON.stringify(workoutState),
          JSON.stringify(exercises),
          JSON.stringify(sets),
          getCurDate(),
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
}

export function sqlDeleteAllWorkoutRows() {
  db.transaction((tx) => {
    tx.executeSql("DELETE FROM workout_templates;");
  });
}

export async function sqlInsertWorkoutHistory(
  workoutState: WorkoutState,
  numPrs: number = 0
) {
  return new Promise<WorkoutMetric>((resolve, reject) => {
    db.transaction((tx) =>
      tx.executeSql(
        "INSERT INTO workout_history (workout_name, workout_time, num_prs, performed) VALUES (?, ?, ?, ?);",
        [
          workoutState.name,
          Date.now() - workoutState.startedAt,
          numPrs,
          getCurDate(),
        ],
        (_, res) =>
          resolve({
            workoutHistoryId: res.insertId ?? -1,
            workoutName: workoutState.name,
            numPrs: numPrs,
            workoutTime: Date.now() - workoutState.startedAt,
            exerciseIds: [],
            performed: getCurDate(),
          }),
        (_, error) => {
          console.log("Error updating workout template: ", error);
          reject(undefined);
          return true;
        }
      )
    );
  });
}

export async function sqlInsertExerciseHistory(
  exercise: Exercise,
  workoutHistoryId: number,
  bestWeight: number,
  bestReps: number,
  totalVolume: number
) {
  return new Promise<ExerciseMetric>((resolve, reject) => {
    db.transaction((tx) =>
      tx.executeSql(
        "INSERT INTO exercise_history (workout_history_id, exercise_name, num_sets, best_weight, best_reps, total_volume) VALUES (?, ?, ?, ?, ?, ?);",
        [
          workoutHistoryId,
          exercise.name,
          exercise.Sets.length,
          bestWeight,
          bestReps,
          totalVolume,
        ],
        (_, res) =>
          resolve({
            exerciseHistoryId: res.insertId ?? -1,
            workoutHistoryId: workoutHistoryId,
            bestWeight: bestWeight,
            bestReps: bestReps,
            exerciseName: exercise.name,
            numSets: exercise.Sets.length,
          }),
        (_, error) => {
          console.log("Error updating workout template: ", error);
          reject(error);
          return true;
        }
      )
    );
  });
}

export function sqlPrintWorkoutHistoryByDateDESC() {
  db.transaction((tx) =>
    tx.executeSql(
      "SELECT * FROM workout_history ORDER BY performed DESC;",
      undefined,
      (_, result) => console.log(result.rows._array),
      (_, error) => {
        console.log("Error printing all workout history: ", error);
        return true;
      }
    )
  );
}

export function sqlPrintExerciseHistory() {
  db.transaction((tx) =>
    tx.executeSql(
      "SELECT * FROM exercise_history;",
      undefined,
      (_, result) => console.log(result.rows._array),
      (_, error) => {
        console.log("Error printing all exercise history: ", error);
        return true;
      }
    )
  );
}

export async function sqlSelectAllWorkoutHistoryByDateDESC() {
  return new Promise<workoutHistoryTableRow[]>((resolve, reject) => {
    db.transaction((tx) =>
      tx.executeSql(
        "SELECT * FROM workout_history ORDER BY performed DESC;",
        undefined,
        (_, result) => {
          resolve(result.rows._array as workoutHistoryTableRow[]);
        },
        (_, error) => {
          console.log("Error selecting all workout history: ", error);
          reject(undefined);
          return true;
        }
      )
    );
  });
}

export async function sqlSelectExerciseHistoryByWorkoutId(
  workoutHistoryId: number
) {
  return new Promise<exerciseHistoryTableRow[]>((resolve, reject) => {
    db.transaction((tx) =>
      tx.executeSql(
        "SELECT exercise_history_id, workout_history_id, exercise_name, num_sets, best_weight, best_reps, total_volume FROM exercise_history WHERE workout_history_id = ?;",
        [workoutHistoryId],
        (_, result) => {
          resolve(result.rows._array as exerciseHistoryTableRow[]);
        },
        (_, error) => {
          console.log("Error selecting all exercise history: ", error);
          reject(error);
          return true;
        }
      )
    );
  });
}

export function sqlDeleteAllWorkoutAndExerciseHistoryRows() {
  db.transaction((tx) => {
    tx.executeSql("DELETE FROM workout_history;");
  });
  db.transaction((tx) => {
    tx.executeSql("DELETE FROM exercise_history;");
  });
}

export function sqlDropExercisesTable() {
  db.transaction((tx) => {
    tx.executeSql("DROP TABLE exercises;");
  });
}

export async function sqlSelectLikeExercisesByName(name: string) {
  return new Promise<exercisesTableRow[]>((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT exercise_id, exercise_name, best_weight, best_reps FROM exercises WHERE exercise_name LIKE '%?%'",
        [name],
        (_, res) => resolve(res.rows._array as exercisesTableRow[]),
        (_, error) => {
          console.log("Could not select exercise", error);
          reject(error);
          return true;
        }
      );
    });
  });
}
