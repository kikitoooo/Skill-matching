import styles from "./ReturnButton.module.scss";

export const ReturnButton = ({ onClick }: { onClick: () => void }) => (
  <span onClick={onClick} className={styles.return}>
    <div className={styles.return_icon}>&laquo;</div> Назад
  </span>
);
