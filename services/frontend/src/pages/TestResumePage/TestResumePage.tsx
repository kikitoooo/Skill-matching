import clsx from "clsx";
import { useNavigate } from "react-router-dom";
import { testResumes } from "../../app/testData";
import { SkillDiagram } from "./ui";
import styles from "./TestResumePage.module.scss";

export const TestResumePage = () => {
  const resume = testResumes[0];
  const navigate = useNavigate();
  const onBack = () => {
    navigate(-1);
  };

  return (
    <main className={styles.container}>
      <section className={styles.resume_section}>
        <span onClick={onBack} className={styles.return}>
          <div className={styles.return_icon}>&laquo;</div> Назад
        </span>
        <div className={styles.heading_container}>
          <h1 className={clsx(styles.heading, styles.main_heading)}>
            Результаты анализа
          </h1>
          <div className={styles.meta}>
            <span className={styles.filename}>{resume.fileName}</span>
            <span className={styles.date}>{resume.date}</span>
          </div>
        </div>
        <div className={styles.match}>
          <h2 className={styles.heading}>Найденные навыки</h2>
          <div className={styles.chart_wrapper}>
            <SkillDiagram resume={resume} />
          </div>
        </div>
        <div className={styles.appropriate}>
          <h2 className={styles.heading}>
            Подходит на <span>{resume.matchPercentage}%</span> для роли{" "}
            <span>{resume.appropriate_position}</span>
          </h2>
          <p className={styles.paragraph}>
            Основываясь на навыках и опыте, кандидат{" "}
            <strong>{resume.candidat_name}</strong> на{" "}
            <strong>{resume.matchPercentage}%</strong> соответствует
            требованиям, предъявляемым к должности{" "}
            <strong>{resume.appropriate_position}</strong>.
          </p>
        </div>
        <div className={styles.missing}>
          <h2 className={styles.heading}>Недостающие навыки</h2>
          <ul>
            {resume.missing_skills.map((skill, index) => (
              <li key={index}>
                <span className={styles.icon}>❗</span>
                {skill}
              </li>
            ))}
          </ul>
        </div>
        <div className={styles.recommendations}>
          <h2 className={styles.heading}>Рекомендации</h2>
          <ul>
            {resume.recommendations.map((rec, index) => (
              <li key={index}>📌 {rec}</li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
};
