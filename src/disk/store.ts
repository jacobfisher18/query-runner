export enum Entity {
  Connection = "connection",
}

const buildContextKey = (userId: string, workspaceId: string) => {
  return `${userId}.${workspaceId}`;
};

export const buildCollectionKey = (
  userId: string,
  workspaceId: string,
  entity: Entity
) => {
  return `${buildContextKey(userId, workspaceId)}.${entity}`;
};

export const buildEntityKey = (
  userId: string,
  workspaceId: string,
  entity: Entity,
  entityId: string
) => {
  return `${buildCollectionKey(userId, workspaceId, entity)}.${entityId}`;
};
