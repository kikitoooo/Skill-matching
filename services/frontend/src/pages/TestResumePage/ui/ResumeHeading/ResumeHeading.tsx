import clsx from "clsx";
import styles from "./ResumeHeading.module.scss";

export const ResumeHeading = ({
  fileName,
  date,
}: {
  fileName: string;
  date: string;
}) => (
  <div className={styles.heading_container}>
    <h1 className={clsx(styles.heading, styles.main_heading)}>
      Результаты анализа
    </h1>
    <div className={styles.meta}>
      <span className={styles.filename}>{fileName}</span>
      <span className={styles.date}>{date}</span>
    </div>
  </div>
);
