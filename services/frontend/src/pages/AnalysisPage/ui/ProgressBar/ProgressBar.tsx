import styles from "./ProgressBar.module.scss";

interface ProgressBarProps {
  name: string;
  progress: number;
  status: "uploading" | "done";
  isVisible: boolean;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  name,
  progress,
  status,
  isVisible,
}) => {
  return (
    <div
      className={`${styles.progress_container} ${
        !isVisible ? styles.fade_out : ""
      }`}
    >
      <div className={styles.progress_bar} style={{ width: `${progress}%` }} />
      {status === "uploading" && (
        <span className={styles.analysis_text}>Анализируем файл "{name}"</span>
      )}
    </div>
  );
};
