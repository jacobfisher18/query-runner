export interface Context {
  userId: string;
  workspaceId: string;
}

/**
 * TODO: These are hard-coded for now, should be dynamic in the future
 */
export const context: Context = {
  userId: "test-user-id",
  workspaceId: "test-workspace-id",
};
