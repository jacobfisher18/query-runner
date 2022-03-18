import { IFolderNode } from "../models/fileSystem";
import {
  createEntity,
  deleteEntity,
  Entity,
  getEntities,
  saveEntity,
} from "./store";
import * as uuid from "uuid";

export interface FileStructureData {
  queryId: string;
}

export type FileStructure = IFolderNode<FileStructureData>;

const DEFAULT_FILE_STRUCTURE: FileStructure = {
  id: uuid.v4(),
  type: "folder",
  name: "root",
  children: [],
};

class FileStructureRepository {
  /**
   * This file structure data is a singleton, so there is only be one per
   * workspace.
   */
  public get(): FileStructure {
    const [, val] = this._getExisting();
    return val ?? DEFAULT_FILE_STRUCTURE;
  }

  public upsert(data: FileStructure): void {
    const [key] = this._getExisting();
    const entityId =
      key ??
      createEntity(Entity.FileStructure, DEFAULT_FILE_STRUCTURE, false)[0];
    saveEntity(Entity.FileStructure, entityId, data);
  }

  /**
   * Clears the entire store, only to be used during local development.
   */
  public clear(): void {
    const [key] = this._getExisting();

    if (key) {
      deleteEntity(Entity.FileStructure, key);
    }
  }

  private _getExisting(): [string | null, FileStructure | null] {
    const prev = getEntities<FileStructure>(Entity.FileStructure);
    const prevEntities = Object.entries(prev || {});
    if (prevEntities.length > 1) {
      throw new Error("Expected file structure to be a singleton.");
    }
    if (prevEntities.length === 1) {
      const [prevEntity] = prevEntities;
      const [key, val] = prevEntity;
      return [key, val ?? null];
    }
    return [null, null];
  }
}

export const fileStructureRepository = new FileStructureRepository();
