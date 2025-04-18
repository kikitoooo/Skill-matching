import clsx from "clsx";
import { formatServerDate } from "../../../../features/hooks/dateFormatter";
import styles from "./ResumeHeading.module.scss";

export const ResumeHeading = ({
  fileName,
  date,
}: {
  fileName: string;
  date: string;
}) => {
  const formattedDate = formatServerDate(date);

  return (
    <div className={styles.heading_container}>
      <h1 className={clsx(styles.heading, styles.main_heading)}>
        Результаты анализа
      </h1>
      <div className={styles.meta}>
        <span className={styles.filename}>{fileName}</span>
        <span className={styles.date}>{formattedDate}</span>
      </div>
    </div>
  );
};
