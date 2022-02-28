export interface ElectronAPI {
  queryDatabase: (query: string) => Promise<[unknown, string | undefined]>;
}

declare global {
  interface Window {
    electron: ElectronAPI;
  }
}
