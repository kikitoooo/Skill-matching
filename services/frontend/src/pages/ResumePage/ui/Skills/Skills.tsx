import { TSkill } from "../../../../entities/models/types";
import styles from "./Skills.module.scss";

export const Skills = ({
  skills,
}: {
  skills: TSkill[];
}) => (
  <div className={styles.recommendations}>
    <h2 className={styles.heading}>Навыки:</h2>
    <ul>
      {skills.map((skill, index) => (
        <li key={index}>📌 {skill.name}</li>
      ))}
    </ul>
  </div>
);
