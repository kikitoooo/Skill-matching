import { Link } from "react-router-dom";
import { LogoIcon } from "../Header/ui/LogoIcon";
import styles from "./Footer.module.scss";
import { GitIcon } from "./ui/GitIcon";
export const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.footer_container}>
        <div className={styles.main_container}>
          <div className={styles.logo_container}>
            <Link className={styles.logo_link} to={"/"}>
              <LogoIcon className={styles.logo_icon} />
            </Link>
          </div>
          <address className={styles.contacts_container}>
            <h4 className={styles.contacts}>Контакты</h4>
            <p className={styles.heading_mail}>
              Email:{" "}
              <span className={styles.mail_contacts}>webmaster@gazprom.ru</span>
            </p>
          </address>
        </div>
        <div className={styles.rights_container}>
          <p className={styles.rights_description}>
            © 2025 Skill-Matcher. Все права защищены.
          </p>
          <button className={styles.git_icon_button}>
            <Link
              className={styles.git_icon_link}
              target="_blank"
              to={"https://github.com/kikitoooo/Skill-matching"}
            >
              <GitIcon className={styles.git_icon} />
            </Link>
          </button>
        </div>
      </div>
    </footer>
  );
};
