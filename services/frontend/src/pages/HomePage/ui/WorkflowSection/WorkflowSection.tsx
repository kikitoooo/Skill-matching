import { Link } from "react-router-dom";
import styles from "./WorkflowSection.module.scss";
import { ArrowIcon } from "../../../../shared/ui/MainButton/ui/ArrowIcon";
import clsx from "clsx";

export const WorkflowSection = () => {
  return (
    <section className={styles.workflow_section}>
      <div className={styles.workflow_container}>
        <div className={styles.heading_container}>
          <h2 className={clsx(styles.heading, styles.main_heading)}>
            Как это работает
          </h2>
          <p className={clsx(styles.paragraph, styles.heading_paragraph)}>
            Простая и интуитивно понятная платформа для анализа резюме
          </p>
        </div>
        <div className={styles.cards_container}>
          <div className={styles.card}>
            <div className={styles.card_description}>
              <div className={styles.card_heading}>
                <h3 className={styles.heading}>Шаги для работы с платформой</h3>
                <p className={styles.paragraph}>
                  Загрузите резюме и получите структурированный анализ
                </p>
              </div>
              <Link to={`/analysis`} className={styles.arrow_link}>
                Начать <ArrowIcon className={styles.arrow} />
              </Link>
            </div>
            <div className={styles.image_container}>
              <img
                className={styles.image}
                loading="lazy"
                alt="Анализ резюме"
                src="/images/steps.jpg"
              />
            </div>
          </div>
          <div className={styles.card}>
            <div className={styles.card_description}>
              <div className={styles.card_heading}>
                <h3 className={styles.heading}>Хранение результатов</h3>
                <p className={styles.paragraph}>
                  Зарегистрируйтесь и получите возможность хранить и
                  просматривать полученные отчеты
                </p>
              </div>
              <Link to={`/profile`} className={styles.arrow_link}>
                Войти в профиль <ArrowIcon className={styles.arrow} />
              </Link>
            </div>
            <div className={styles.image_container}>
              <img
                className={styles.image}
                loading="lazy"
                alt="Сматрфон с результатами анализа"
                src="/images/store.jpg"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
