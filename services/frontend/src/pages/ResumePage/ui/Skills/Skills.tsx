import { TSkill } from "../../../../entities/models/types";
import styles from "./Skills.module.scss";

export const Skills = ({
  skills,
}: {
  skills: TSkill[] | Record<string, number>;
}) => {
  const normalizedSkills = Array.isArray(skills)
    ? skills
    : Object.entries(skills).map(([name, level]) => ({
        name,
        level: Number(level),
      }));

  return (
    <div className={styles.skills}>
      <h2 className={styles.heading}>Навыки:</h2>
      <ul>
        {normalizedSkills.map((skill, index) => (
          <li key={index}>
            📌 {index + 1}
            {`) `} {skill.name}
            {" - "}
            <strong>
              {skill.level}
              {`%`}
            </strong>
          </li>
        ))}
      </ul>
    </div>
  );
};
