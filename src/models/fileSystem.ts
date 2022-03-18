export interface IFolderNode<T> {
  id: string;
  type: "folder";
  name: string;
  children: Array<IFileSystemNode<T>>;
}

export interface IFileNode<T> {
  id: string;
  type: "file";
  data: T;
}

export type IFileSystemNode<T> = IFolderNode<T> | IFileNode<T>;
