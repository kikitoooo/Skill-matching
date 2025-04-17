import { useSelector } from "../../../../features/store";
import { selectUser } from "../../../../features/slices/userSlice";
import styles from "./Dashboard.module.scss";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const Dashboard = () => {
  const user = useSelector(selectUser);
  const resumes = user?.resumes || [];
  const navigate = useNavigate();

  useEffect(() => {
    console.log("Резюме обновились:", resumes);
  }, [resumes]);

  // статистика
  const processedResumes = resumes.length;
  const successfulAnalyses = resumes.filter(
    (r) => r.matchPercentage >= 60
  ).length;
  const suitableCandidates = resumes.filter(
    (r) => r.matchPercentage >= 85
  ).length;

  // сортировка
  const sortedResumes = [...resumes].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const handleRowClick = (resumeId: number) => {
    navigate(`/resumes/${resumeId}`);
  };

  return (
    <div className={styles.dashboard}>
      <h1 className={styles.reportTitle}>Отчётность</h1>
      <p className={styles.welcomeMessage}>
        Добро пожаловать, {user.name}. Вот обзор Ваших последних анализов.
      </p>

      <h2 className={styles.sectionTitle}>Статистика</h2>
      <div className={styles.stats}>
        <div className={styles.statCard}>
          <div className={styles.statNumber}>{processedResumes}</div>
          <div className={styles.statLabel}>Обработано резюме</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statNumber}>{successfulAnalyses}</div>
          <div className={styles.statLabel}>Успешные анализы</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statNumber}>{suitableCandidates}</div>
          <div className={styles.statLabel}>Подходящих кандидатов</div>
        </div>
      </div>

      <h2 className={styles.sectionTitle}>Последние анализы</h2>
      <div className={styles.analysesTable}>
        {resumes.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Кандидат</th>
                <th>Должность</th>
                <th>Дата проверки</th>
                <th>Статус</th>
                <th>Соответствие</th>
              </tr>
            </thead>
            <tbody>
              {sortedResumes.map((resume) => (
                <tr 
                  key={resume.id}
                  onClick={() => handleRowClick(resume.id)}
                  className={styles.clickableRow}
                >
                  <td>{resume.name}</td>
                  <td>{resume.job}</td>
                  <td>{new Date(resume.date).toLocaleDateString()}</td>
                  <td>
                    <span
                      className={
                        resume.matchPercentage >= 50
                          ? styles.statusVerified
                          : styles.statusErrorCheck
                      }
                    >
                      {resume.matchPercentage >= 50
                        ? "Успешно проверено"
                        : "Ошибка анализа"}
                    </span>
                  </td>
                  <td className="percent">{Math.round(resume.matchPercentage)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>Нет данных об анализах</p>
        )}
      </div>
    </div>
  );
};