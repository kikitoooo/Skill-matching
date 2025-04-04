import { useLocation, useNavigate } from "react-router-dom";
import { MainButton } from "../../../../shared/ui/MainButton";
import styles from "./HeroSection.module.scss";

export const HeroSection = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const redirectToAnalysis = () => {
    navigate("/analysis", { state: { from: location.pathname } });
  };
  return (
    <div className={styles.hero_container}>
      <div className={styles.promo_block}>
        <div className={styles.promo_block_content}>
          <div className={styles.heading_container}>
            <h1 className={styles.heading}>
              Анализируйте резюме с помощью нашей платформы
            </h1>
            <p className={styles.heading_paragraph}>
              Наша платформа предлагает простой и эффективный способ анализа
              IT-резюме. Начните использовать наши инструменты для улучшения
              подбора кандидатов.
            </p>
          </div>
          <MainButton
            title="Начать"
            className={styles.button}
            onClick={redirectToAnalysis}
          />
        </div>
      </div>
      <div></div>
    </div>
  );
};
