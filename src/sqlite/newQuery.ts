import * as SQLite from "expo-sqlite";
const db = SQLite.openDatabase("repr_local");

export default async function sqlQuery(
  query: string,
  args?: any[],
  successCB?: SQLite.SQLStatementCallback,
  failCB?: SQLite.SQLStatementErrorCallback
) {
  db.transaction((tx) => tx.executeSql(query, args, successCB, failCB));
}
