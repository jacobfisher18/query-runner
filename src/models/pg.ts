/**
 * Types copied from https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/pg/index.d.ts.
 * We can't import them on the frontend since pg only works on the backend.
 */

export interface FieldDef {
  name: string;
  tableID: number;
  columnID: number;
  dataTypeID: number;
  dataTypeSize: number;
  dataTypeModifier: number;
  format: string;
}

export interface QueryResultBase {
  command: string;
  rowCount: number;
  oid: number;
  fields: FieldDef[];
}

export interface QueryResultRow {
  [column: string]: any;
}

export interface QueryResult<R extends QueryResultRow = any>
  extends QueryResultBase {
  rows: R[];
}

export interface QueryArrayResult<R extends any[] = any[]>
  extends QueryResultBase {
  rows: R[];
}
