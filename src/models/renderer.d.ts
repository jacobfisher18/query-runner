export interface ElectronAPI {
  connectClient: (options: {
    id: string;
    user: string;
    password: string;
    port: number;
    host: string;
    database?: string;
  }) => Promise<void>;
  disconnectClient: (id: string) => Promise<void>;
  queryClient: (id: string, query: string) => Promise<unknown>;
  getStore: <T>(key: string) => T;
  setStore: <T>(key: string, data: T) => unknown;
  deleteStore: (key: string) => unknown;
}

declare global {
  interface Window {
    electron: ElectronAPI;
  }
}
