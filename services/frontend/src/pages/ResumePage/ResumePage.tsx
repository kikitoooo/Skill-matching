import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "../../features/store";
import { TResume } from "../../entities/models/types";
import { selectIsLoading } from "../../features/slices/resumeSlice";
import { Preloader } from "../../widgets/Preloader";
import { SkillDiagram } from "./ui/SkillDiagram/SkillDiagram";
import { ReturnButton } from "./ui/ReturnButton";
import { ResumeHeading } from "./ui/ResumeHeading";
import { MatchInfo } from "./ui/MatchInfo";
import { MissingSkills } from "./ui/MissingSkills";
import { Recommendations } from "./ui/Recommendations/Recommendations";
import styles from "./ResumePage.module.scss";

export const ResumePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const resumeId = Number(id);
  const user = useSelector((state) => state.user.user);
  const resume = user.resumes?.find((r: TResume) => r.id === resumeId);
  const isLoading = useSelector(selectIsLoading);

  if (isLoading) {
    return <Preloader />;
  }

  if (!resume)
    return (
      <div className={styles.not_found}>
        Резюме не найдено <span>&#9785;</span>
      </div>
    );

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
