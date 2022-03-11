import { storeLogger } from "../log";
import { Connection } from "../store/connections";
import { buildCollectionKey, buildEntityKey, Entity } from "./store";
import * as uuid from "uuid";

/**
 * TODO: Add some sort of schema validation before/after inserting/reading from
 * the local store.
 */

export const getConnections = (
  userId: string,
  workspaceId: string
): Record<string, Connection | undefined> => {
  const key = buildCollectionKey(userId, workspaceId, Entity.Connection);
  const result =
    window.electron.getStore<Record<string, Connection | undefined>>(key);
  storeLogger.info(`Store fetch at ${key}`, { data: result });
  return result;
};

export const addConnection = (
  userId: string,
  workspaceId: string,
  data: Partial<Connection>
): void => {
  const id = uuid.v4();
  const key = buildEntityKey(userId, workspaceId, Entity.Connection, id);
  const connection: Connection = {
    id,
    name: data.name ?? "",
    host: data.host ?? "",
    user: data.user ?? "",
    port: data.port ?? "",
    password: data.password ?? "",
    database: data.database ?? "",
    type: data.type ?? "Postgres",
  };
  window.electron.setStore(key, connection);
  storeLogger.info(`Store set at ${key}`, { data: connection });
};

export const saveConnection = (
  userId: string,
  workspaceId: string,
  connectionId: string,
  data: Partial<Connection>
) => {
  const key = buildEntityKey(
    userId,
    workspaceId,
    Entity.Connection,
    connectionId
  );
  const prevData = window.electron.getStore<Connection | undefined>(key);
  if (!prevData) {
    throw new Error(`Couldn't find entity to save at location ${key}`);
  }
  const newData = { ...prevData, ...data };
  storeLogger.info(`Store set at ${key}`, { prevData, newData });
  window.electron.setStore(key, newData);
};

export const deleteConnection = (
  userId: string,
  workspaceId: string,
  connectionId: string
): void => {
  const key = buildEntityKey(
    userId,
    workspaceId,
    Entity.Connection,
    connectionId
  );
  window.electron.deleteStore(key);
  storeLogger.info(`Store delete at ${key}`);
};
