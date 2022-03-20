import { QueryResult } from "../store/queryResult";
import { QueryResult as PgQueryResult } from "../models/pg";

// TODO: Better parsing, validate results, handle edge cases, etc.
export const parseQueryResult = (
  result: PgQueryResult
): QueryResult | string | null => {
  if (Array.isArray(result)) {
    console.error("Cannot handle array result at this time...");
    return null;
  }

  if (!result) {
    return null;
  }

  const { command } = result;

  switch (command) {
    case "SELECT": {
      if (result.fields && result.rows) {
        return result;
      } else {
        console.error(`Failed to parse query result`, { result });
        return null;
      }
    }
    case "INSERT": {
      return "Insert query complete";
    }
  }

  console.error(`Failed to parse query result`, { result });
  return null;
};
