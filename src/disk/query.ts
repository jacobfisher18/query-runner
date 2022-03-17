import { Query } from "../models/query";
import {
  createEntity,
  deleteEntity,
  Entity,
  getEntities,
  saveEntity,
} from "./store";

class QueryRepository {
  public get(): Record<string, Query | undefined> {
    return getEntities(Entity.Query);
  }

  public create(data: Omit<Query, "id">): [string, Query] {
    return createEntity(Entity.Query, { ...data, id: "" });
  }

  public save(queryId: string, data: Partial<Query>): Query {
    return saveEntity(Entity.Query, queryId, data);
  }

  public delete(queryId: string): Query {
    return deleteEntity(Entity.Query, queryId);
  }
}

export const queryRepository = new QueryRepository();
