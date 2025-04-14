import { useNavigate } from "react-router-dom";
import { testResumes } from "../../app/testData";
import { SkillDiagram } from "./ui/SkillDiagram";
import { ReturnButton } from "./ui/ReturnButton";
import { ResumeHeading } from "./ui/ResumeHeading";
import styles from "./TestResumePage.module.scss";
import { MatchInfo } from "./ui/MatchInfo";
import { MissingSkills } from "./ui/MissingSkills";
import { Recommendations } from "./ui/Recommendations/Recommendations";

export const TestResumePage = () => {
  const resume = testResumes[0];
  const navigate = useNavigate();
  const onBack = () => {
    navigate(-1);
  };

  return (
    <main className={styles.container}>
      <section className={styles.resume_section}>
        <ReturnButton onClick={onBack} />
        <ResumeHeading date={resume.date} fileName={resume.fileName} />
        <div className={styles.match}>
          <h2 className={styles.heading}>Найденные навыки</h2>
          <div className={styles.chart_wrapper}>
            <SkillDiagram resume={resume} />
          </div>
        </div>
        <MatchInfo
          name={resume.candidat_name}
          percentage={resume.matchPercentage}
          position={resume.appropriate_position}
        />
        <MissingSkills skills={resume.missing_skills} />
        <Recommendations recommendations={resume.recommendations} />
      </section>
    </main>
  );
};
