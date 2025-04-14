import styles from "./Notification.module.scss";

type NotificationType = "success" | "warning" | "error";

interface NotificationProps {
  name: string;
  message: string;
  type?: NotificationType;
  isVisible: boolean;
}

export const Notification: React.FC<NotificationProps> = ({
  name,
  message,
  type = "success",
  isVisible,
}) => {
  if (!isVisible) return null;

  const icons: Record<NotificationType, string> = {
    success: "✅",
    warning: "⚠️",
    error: "❌",
  };

  return (
    <div className={`${styles.notification_content} ${styles[type]}`}>
      <div className={styles.icon_message}>
        <span className={styles.icon}>{icons[type]}</span>
        <p>{message}</p>
      </div>
      <p>
        <strong>{name}</strong>
      </p>
    </div>
  );
};
