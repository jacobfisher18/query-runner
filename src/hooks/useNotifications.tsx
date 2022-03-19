import {
  NotificationProps,
  useNotifications as useMantineNotifications,
} from "@mantine/notifications";
import { FiCheck } from "react-icons/fi";

export enum NotificationType {
  ConnectionSaved = "connectionSaved",
  ConnectionDeleted = "connectionDeleted",
  QuerySaved = "querySaved",
}

const baseSuccessNotification: NotificationProps = {
  autoClose: 2000,
  icon: <FiCheck />,
  color: "teal",
  message: "Action was a success.",
};

const notificationMap: Record<NotificationType, NotificationProps> = {
  [NotificationType.ConnectionSaved]: {
    ...baseSuccessNotification,
    title: "Connection saved",
    message: "Database connection has been saved.",
  },
  [NotificationType.ConnectionDeleted]: {
    ...baseSuccessNotification,
    title: "Connection deleted",
    message: "Database connection has been deleted.",
  },
  [NotificationType.QuerySaved]: {
    ...baseSuccessNotification,
    title: "Query saved",
    message: "Query has been saved.",
  },
};

export function useNotifications() {
  const notifications = useMantineNotifications();

  const showNotification = (type: NotificationType) => {
    notifications.showNotification(notificationMap[type]);
  };

  return { showNotification };
}
