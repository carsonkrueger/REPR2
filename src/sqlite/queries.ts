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
import exerciseNames from "../util/exerciseNames";
import sqlQuery from "./newQuery";

export const initWorkoutTemplatesTable = async () => {
  sqlQuery(
    "CREATE TABLE workout_templates (workout_id INTEGER PRIMARY KEY AUTOINCREMENT, workout_state STRING NOT NULL, exercises STRING NOT NULL, sets STRING NOT NULL, last_performed STRING NOT NULL);",
    undefined,
    () => sqlInsertDefaultExercises(),
    () => true
  );

  sqlQuery(
    "CREATE TABLE IF NOT EXISTS exercises (exercise_id INTEGER PRIMARY KEY AUTOINCREMENT, exercise_name STRING NOT NULL, best_weight INTEGER DEFAULT 0 NOT NULL, best_reps INTEGER DEFAULT 0 NOT NULL);",
    undefined,
    undefined,
    (_, error) => {
      console.log("Error creating exercises table: ", error);
      return true;
    }
  );

  sqlQuery(
    "CREATE TABLE IF NOT EXISTS workout_history (workout_history_id INTEGER PRIMARY KEY AUTOINCREMENT, workout_name STRING NOT NULL, workout_time INTEGER NOT NULL, num_prs INTEGER DEFAULT 0 NOT NULL, performed STRING NOT NULL);",
    undefined,
    undefined,
    (_, error) => {
      console.log("Error creating workout_history table: ", error);
      return true;
    }
  );

  sqlQuery(
    "CREATE TABLE IF NOT EXISTS exercise_history (exercise_history_id INTEGER PRIMARY KEY AUTOINCREMENT, workout_history_id INTEGER NOT NULL, exercise_name STRING NOT NULL, num_sets INTEGER NOT NULL, best_weight INTEGER NOT NULL, best_reps INTEGER NOT NULL, total_volume INTEGER NOT NULL);",
    undefined,
    undefined,
    (_, error) => {
      console.log("Error creating exercises table: ", error);
      return true;
    }
  );

  sqlUpdateTables();
};

async function sqlUpdateTables() {
  switch (await sqlGetUserVersion()) {
    case 0: {
      break;
    }
    default: {
      return;
    }
  }
  // update tables until latest version (default case returns out)
  //await sqlIncrementUserVersion();
  // sqlUpdateTables();
}

async function sqlGetUserVersion() {
  return new Promise<number>((resolve, reject) =>
    sqlQuery("PRAGMA user_version;", [], (_, res) => {
      resolve((res.rows.item(0) as { user_version: number }).user_version);
    })
  );
}

async function sqlIncrementUserVersion() {
  sqlQuery(`PRAGMA user_version = ${(await sqlGetUserVersion()) + 1};`);
}

async function sqlSetUserVersion(versionNum: number) {
  sqlQuery(
    `PRAGMA user_version = ${(await sqlGetUserVersion()) + versionNum};`
  );
}

export async function sqlSelectAllTemplatesByDateDESC() {
  return new Promise<parsedWorkoutsTableRow[]>((resolve, reject) => {
    sqlQuery(
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
    );
  });
}

export async function sqlSelectWorkoutInfoById(id: number) {
  return new Promise<parsedWorkoutsTableRow>((resolve, reject) => {
    sqlQuery(
      "SELECT workout_id, workout_state, exercises, sets, last_performed FROM workout_templates WHERE workout_id = ?;",
      [id],
      (_, result) => {
        const template = parseWorkoutTableRow(result.rows._array[0]);
        resolve(template);
      },
      (_, error) => {
        console.log("Error selecting template: ", error);
        reject(undefined);
        return true;
      }
    );
  });
}

export async function sqlSelectUnparsedWorkoutInfoById(id: number) {
  return new Promise<unparsedWorkoutsTableRow>((resolve, reject) => {
    sqlQuery(
      "SELECT workout_id, workout_state, exercises, sets, last_performed FROM workout_templates WHERE workout_id = ?;",
      [id],
      (_, result) => {
        resolve(result.rows._array[0]);
      },
      (_, error) => {
        console.log("Error selecting template: ", error);
        reject(undefined);
        return true;
      }
    );
  });
}

export function sqlPrintAllTemplatesByDateDESC() {
  sqlQuery(
    "SELECT * FROM workout_templates ORDER BY last_performed DESC;",
    undefined,
    (_, result) => console.log(result.rows._array),
    (_, error) => {
      console.log("Error printing all templates: ", error);
      return true;
    }
  );
}

export async function sqlInsertCurrentWorkoutTemplate(
  workoutState: WorkoutState,
  exercises: EntityState<Exercise>,
  sets: EntityState<WorkoutSet>
) {
  return new Promise<number>((resolve, reject) => {
    sqlQuery(
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
    sqlQuery(
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
    );
  });
}

export function sqlDeleteAllWorkoutRows() {
  sqlQuery("DELETE FROM workout_templates;");
}

export async function sqlInsertWorkoutHistory(
  workoutState: WorkoutState,
  numPrs: number = 0
) {
  return new Promise<WorkoutMetric>((resolve, reject) => {
    sqlQuery(
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
    sqlQuery(
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
          performed: getCurDate(),
        }),
      (_, error) => {
        console.log("Error updating workout template: ", error);
        reject(error);
        return true;
      }
    );
  });
}

export function sqlPrintWorkoutHistoryByDateDESC() {
  sqlQuery(
    "SELECT * FROM workout_history ORDER BY performed DESC;",
    undefined,
    (_, result) => console.log(result.rows._array),
    (_, error) => {
      console.log("Error printing all workout history: ", error);
      return true;
    }
  );
}

export async function sqlSelectAllWorkoutHistoryByDateDESC() {
  return new Promise<workoutHistoryTableRow[]>((resolve, reject) => {
    sqlQuery(
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
    );
  });
}

export async function sqlSelectExerciseHistoryByWorkoutId(
  workoutHistoryId: number
) {
  return new Promise<exerciseHistoryTableRow[]>((resolve, reject) => {
    sqlQuery(
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
    );
  });
}

export function sqlDeleteAllWorkoutAndExerciseHistoryRows() {
  sqlQuery("DELETE FROM workout_history;");
  sqlQuery("DELETE FROM exercise_history;");
}

export function sqlDropExercisesTable() {
  sqlQuery("DROP TABLE exercises;");
}

export function sqlDropHistoryTables() {
  sqlQuery("DROP TABLE exercise_history;");
  sqlQuery("DROP TABLE workout_history;");
}

export function sqlDropWorkoutTemplatesTable() {
  sqlQuery("DROP TABLE workout_templates;");
}

export function sqlDropAllTables() {
  sqlDropExercisesTable();
  sqlDropHistoryTables();
  sqlDropWorkoutTemplatesTable();
}

export async function sqlSelectLikeExercisesByName(
  name: string,
  offset: number,
  numToSelect = 10
) {
  return new Promise<exercisesTableRow[]>((resolve, reject) => {
    sqlQuery(
      "SELECT exercise_id, exercise_name, best_weight, best_reps FROM exercises WHERE exercise_name LIKE ? LIMIT ? OFFSET ?;",
      [`%${name}%`, numToSelect, offset],
      (_, res) => resolve(res.rows._array),
      (_, error) => {
        console.log("Could not select exercise", error);
        reject(error);
        return true;
      }
    );
  });
}

export async function sqlInsertDefaultExercises() {
  exerciseNames.map((name: string) =>
    sqlQuery("INSERT INTO exercises (exercise_name) VALUES (?)", [name])
  );
}

export async function sqlInsertNewExerciseName(name: string) {
  sqlQuery("INSERT OR IGNORE INTO exercises (exercise_name) VALUES (?)", [
    name,
  ]);
}

export async function sqlDeleteWorkoutTemplateById(workoutId: number) {
  sqlQuery("DELETE FROM workout_templates WHERE workout_id = ?", [workoutId]);
}
