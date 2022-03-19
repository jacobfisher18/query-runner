export interface Context {
  userId: string;
  workspaceId: string;
}

/**
 * All data will be saved under these anonymous ids for now. In the future, we will
 * support multiple users and multiple workspaces, and then this will be dynamic.
 */
export const context: Context = {
  userId: "ANONYMOUS_USER_ID",
  workspaceId: "ANONYMOUS_WORKSPACE_ID",
};
