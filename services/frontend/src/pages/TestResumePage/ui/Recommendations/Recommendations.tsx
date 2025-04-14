import styles from "./Recommendations.module.scss";

export const Recommendations = ({
  recommendations,
}: {
  recommendations: string[];
}) => (
  <div className={styles.recommendations}>
    <h2 className={styles.heading}>Рекомендации</h2>
    <ul>
      {recommendations.map((rec, index) => (
        <li key={index}>📌 {rec}</li>
      ))}
    </ul>
  </div>
);
