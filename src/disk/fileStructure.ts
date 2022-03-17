import { IFolderNode } from "../models/fileSystem";
import {
  createEntity,
  deleteEntity,
  Entity,
  getEntities,
  saveEntity,
} from "./store";

export interface FileStructureData {
  queryId: string;
}

export type FileStructure = IFolderNode<FileStructureData>;

const DEFAULT_FILE_STRUCTURE: FileStructure = {
  type: "folder",
  name: "root",
  children: [],
};

class FileStructureRepository {
  /**
   * This file structure data is a singleton, so there is only be one per
   * workspace. This function updates it, or creates it if it hasn't been
   * created yet.
   */
  public get(): FileStructure {
    const prev = getEntities<FileStructure>(Entity.FileStructure);
    const prevEntities = Object.values(prev || {});
    if (prevEntities.length > 1) {
      throw new Error("Expected file structure to be a singleton.");
    }

    return prevEntities[0] ?? DEFAULT_FILE_STRUCTURE;
  }

  public upsert(data: FileStructure): void {
    const prev = getEntities(Entity.FileStructure);
    const prevEntityIds = Object.keys(prev || {});
    if (prevEntityIds.length > 1) {
      throw new Error("Expected file structure to be a singleton.");
    }

    const entityId = prevEntityIds.length
      ? prevEntityIds[0]
      : createEntity(Entity.FileStructure, DEFAULT_FILE_STRUCTURE, false)[0];

    saveEntity(Entity.FileStructure, entityId, data);
  }

  /**
   * Clears the entire store, only to be used during local development.
   */
  public clear(): void {
    const prev = getEntities(Entity.FileStructure);
    const prevEntityIds = Object.keys(prev || {});
    if (prevEntityIds.length > 1) {
      throw new Error("Expected file structure to be a singleton.");
    }

    if (prevEntityIds.length) {
      deleteEntity(Entity.FileStructure, prevEntityIds[0]);
    }
  }
}

export const fileStructureRepository = new FileStructureRepository();
