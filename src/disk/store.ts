import { storeLogger } from "../utils/log";
import * as uuid from "uuid";
import { context } from "../store/user";

export enum Entity {
  Connection = "connection",
  FileStructure = "fileStructure",
  Query = "query",
}

/**
 * TODO: Add some sort of schema validation before/after inserting/reading from
 * the local store.
 */

// TODO: Pull this from the actual logged in context
const buildContextKey = () => {
  return `${context.userId}.${context.workspaceId}`;
};

const buildCollectionKey = (entity: Entity) => {
  return `${buildContextKey()}.${entity}`;
};

const buildEntityKey = (entity: Entity, entityId: string) => {
  return `${buildCollectionKey(entity)}.${entityId}`;
};

/**
 * Get all of the given entity for the given user & workspace.
 */
export const getEntities = <T>(
  entity: Entity
): Record<string, T | undefined> => {
  const key = buildCollectionKey(entity);
  const result = window.electron.getStore<
    Record<string, T | undefined> | undefined
  >(key);
  storeLogger.info(`Store fetch at ${key}`, { data: result });
  return result || {};
};

/**
 * Get the given entity for the given user & workspace.
 */
export const getEntity = <T>(
  entity: Entity,
  entityId: string
): T | undefined => {
  const key = buildEntityKey(entity, entityId);
  const result = window.electron.getStore<T | undefined>(key);
  storeLogger.info(`Store fetch at ${key}`, { data: result });
  return result;
};

/**
 * Creates a new entity.
 */
export const createEntity = <T>(
  entity: Entity,
  data: T,
  shouldStoreIdOnEntity = true
): [string, T] => {
  const id = uuid.v4();
  const key = buildEntityKey(entity, id);
  const item: T = {
    ...data,
    id: shouldStoreIdOnEntity ? id : undefined,
  };
  window.electron.setStore(key, item);
  storeLogger.info(`Store set at ${key}`, { data: item });
  return [id, item];
};

/**
 * Saves an entity.
 */
export const saveEntity = <T>(
  entity: Entity,
  entityId: string,
  data: Partial<T>
): T => {
  const key = buildEntityKey(entity, entityId);
  const prevData = window.electron.getStore<T | undefined>(key);
  if (!prevData) {
    throw new Error(`Couldn't find entity to save at location ${key}`);
  }
  const newData = { ...prevData, ...data };
  storeLogger.info(`Store set at ${key}`, { prevData, newData });
  window.electron.setStore(key, newData);
  return newData;
};

/**
 * Deletes an entity.
 */
export const deleteEntity = <T>(entity: Entity, entityId: string): T => {
  const key = buildEntityKey(entity, entityId);
  const prevData = window.electron.getStore<T | undefined>(key);
  if (!prevData) {
    throw new Error(`Couldn't find entity to delete at location ${key}`);
  }
  window.electron.deleteStore(key);
  storeLogger.info(`Store delete at ${key}`);
  return prevData;
};
