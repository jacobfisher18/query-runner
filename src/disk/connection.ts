import { Connection } from "../models/connection";
import {
  createEntity,
  deleteEntity,
  Entity,
  getEntities,
  saveEntity,
} from "./store";

const DEFAULT_CONNECTION: Connection = {
  id: "",
  name: "",
  host: "",
  user: "",
  port: "",
  password: "",
  database: "",
  type: "Postgres",
};

class ConnectionRepository {
  public get(): Record<string, Connection | undefined> {
    return getEntities(Entity.Connection);
  }

  public create(data: Partial<Connection>): [string, Connection] {
    return createEntity(Entity.Connection, { ...DEFAULT_CONNECTION, ...data });
  }

  public save(connectionId: string, data: Partial<Connection>): Connection {
    return saveEntity(Entity.Connection, connectionId, data);
  }

  public delete(connectionId: string): Connection {
    return deleteEntity(Entity.Connection, connectionId);
  }
}

export const connectionRepository = new ConnectionRepository();
