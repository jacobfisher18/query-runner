import _ from "lodash";
import create from "zustand";

export interface Connection {
  id: string;
  name: string;
  host: string;
  user: string;
  port: string;
  password: string;
  database: string;
  type: "Postgres"; // | 'MySQL', etc.
  isConnected: boolean;
}

interface ConnectionsState {
  selectedConnectionId: string | null;
  connections: Record<string, Connection | undefined>;
  addConnection: (data: Partial<Omit<Connection, "id">>) => Connection;
  updateConnection: (id: string, data: Partial<Connection>) => void;
  removeConnection: (id: string) => void;
  selectConnection: (id: string) => void;
  getSelectedConnection: () => Connection | null;
}

// TODO: Get rid of this
const DUMMY_DB_CONNECTIONS: Record<string, Connection | undefined> = {
  1: {
    id: "1",
    name: "Test DB",
    host: "localhost",
    user: "postgres",
    port: "5432",
    password: "somePassword",
    database: "",
    type: "Postgres",
    isConnected: false,
  },
  2: {
    id: "2",
    name: "Jaba Local",
    host: "localhost",
    user: "postgres",
    port: "1234",
    password: "password",
    database: "",
    type: "Postgres",
    isConnected: false,
  },
  3: {
    id: "3",
    name: "Grubber Local",
    host: "localhost",
    user: "postgres",
    port: "5678",
    password: "pass123",
    database: "main",
    type: "Postgres",
    isConnected: false,
  },
};

export const useConnectionsStore = create<ConnectionsState>((set, get) => ({
  // initial state
  connections: DUMMY_DB_CONNECTIONS, // TODO: {}
  selectedConnectionId: null,
  // methods for manipulating state
  addConnection: (data: Partial<Omit<Connection, "id">>): Connection => {
    const connection: Connection = {
      id: _.uniqueId(),
      name: data.name ?? "",
      host: data.host ?? "",
      user: data.user ?? "",
      port: data.port ?? "",
      password: data.password ?? "",
      database: data.database ?? "",
      type: data.type ?? "Postgres",
      isConnected: data.isConnected ?? false,
    };
    set((state) => ({
      ...state,
      connections: {
        ...state.connections,
        [connection.id]: connection,
      },
    }));
    return connection;
  },
  updateConnection: (id: string, data: Partial<Connection>) => {
    set((state) => {
      const existing = state.connections[id];
      if (!existing) {
        console.error("Cannot update non-existent item");
        return state;
      }

      return {
        ...state,
        connections: {
          ...state.connections,
          [id]: {
            ...existing,
            ...data,
          },
        },
      };
    });
  },
  removeConnection: (id: string) => {
    set((state) => {
      const newState = { ...state };
      if (newState.connections[id]) {
        delete newState.connections[id];
      }
      return newState;
    });
  },
  selectConnection: (id: string) => {
    set((state) => ({
      ...state,
      selectedConnectionId: id,
    }));
  },
  getSelectedConnection: () => {
    const { connections, selectedConnectionId } = get();
    return selectedConnectionId
      ? connections[selectedConnectionId] ?? null
      : null;
  },
}));
