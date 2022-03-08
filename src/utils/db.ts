export interface QueryResult {
  fields: Array<{ name: string }>;
  rows: Array<Record<string, unknown>>;
}

// TODO: Better parsing, validate results, handle edge cases, etc.
export const parseQueryResult = (result: any): QueryResult | string | null => {
  if (Array.isArray(result)) {
    console.error("result is an array, TODO handle this");
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
