import * as SQLite from "expo-sqlite";
const db = SQLite.openDatabase("repr_local");

export default async function sqlQuery(
  query: string,
  args?: any[],
  successCB?: (
    transaction?: SQLite.SQLTransaction,
    resultSet?: SQLite.SQLResultSet
  ) => void,
  failCB?: (
    transaction?: SQLite.SQLTransaction,
    error?: SQLite.SQLError
  ) => boolean
) {
  db.transaction((tx) => tx.executeSql(query, args, successCB, failCB));
}
