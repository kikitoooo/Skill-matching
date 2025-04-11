import styles from "./MatchInfo.module.scss";

export const MatchInfo = ({
  name,
  percentage,
  position,
}: {
  name: string;
  percentage: number;
  position: string;
}) => (
  <div className={styles.appropriate}>
    <h2 className={styles.heading}>
      Подходит на <span>{percentage}%</span> для роли <span>{position}</span>
    </h2>
    <p className={styles.paragraph}>
      Основываясь на навыках и опыте, кандидат <strong>{name}</strong> на{" "}
      <strong>{percentage}%</strong> соответствует требованиям, предъявляемым к
      должности <strong>{position}</strong>.
    </p>
  </div>
);
