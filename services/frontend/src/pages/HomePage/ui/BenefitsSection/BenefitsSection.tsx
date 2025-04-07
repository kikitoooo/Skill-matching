import clsx from "clsx";
import { CubeIcon } from "../../../../shared/ui/CubeIcon";
import styles from "./BenefitsSection.module.scss";

export const BenefitsSection = () => {
  return (
    <section className={styles.benefits_section}>
      <div className={styles.benefits_container}>
        <div className={styles.description_container}>
          <div className={styles.heading_container}>
            <h2 className={clsx(styles.heading, styles.main_heading)}>
              Преимущества платформы для анализа IT-резюме
            </h2>
            <p className={clsx(styles.paragraph, styles.heading_paragraph)}>
              Наша платформа упрощает процесс анализа резюме и поиска
              кандидатов. Мы предлагаем уникальные инструменты для
              HR-специалистов.
            </p>
          </div>
          <ul className={styles.benefits_list}>
            <li className={styles.benefits_list_item}>
              <div className={styles.benefits_list_item_head}>
                <CubeIcon className={styles.icon} />
                <h3 className={styles.heading}>Удобство использования</h3>
              </div>
              <p className={styles.paragraph}>
                Интуитивно понятный интерфейс для быстрого анализа и загрузки
                резюме.
              </p>
            </li>
            <li className={styles.benefits_list_item}>
              <div className={styles.benefits_list_item_head}>
                <CubeIcon className={styles.icon} />
                <h3 className={styles.heading}>Анализ данных</h3>
              </div>
              <p className={styles.paragraph}>
                Глубокий анализ резюме с рекомендациями по улучшению и
                адаптации.
              </p>
            </li>
          </ul>
        </div>
        <div className={styles.image_container}>
          <img
            className={styles.image}
            loading="lazy"
            alt="Проанализированное резюме"
            src="/images/advantages.jpg"
          />
        </div>
      </div>
    </section>
  );
};
