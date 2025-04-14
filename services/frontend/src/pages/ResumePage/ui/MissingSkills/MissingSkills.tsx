import styles from "./MissingSkills.module.scss";

export const MissingSkills = ({ skills }: { skills: string[] }) => (
  <div className={styles.missing}>
    <h2 className={styles.heading}>Недостающие навыки</h2>
    <ul>
      {skills.map((skill, index) => (
        <li key={index}>
          <span className={styles.icon}>❗</span>
          {skill}
        </li>
      ))}
    </ul>
  </div>
);
