import _ from "lodash";

export class Stack<T> {
  private _data: Array<T> = [];

  public constructor(items?: Array<T>) {
    if (items) {
      for (const item of items) {
        this.push(item);
      }
    }
  }

  public push(item: T) {
    this._data.push(item);
  }

  public pop(): T | undefined {
    return this._data.pop();
  }

  public peek(): T | undefined {
    return _.last(this._data);
  }

  public size(): number {
    return this._data.length;
  }
}
