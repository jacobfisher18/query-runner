export interface IFolderNode<T> {
  type: "folder";
  name: string;
  children: Array<IFileSystemNode<T>>;
}

export interface IFileNode<T> {
  type: "file";
  data: T;
}

export type IFileSystemNode<T> = IFolderNode<T> | IFileNode<T>;
