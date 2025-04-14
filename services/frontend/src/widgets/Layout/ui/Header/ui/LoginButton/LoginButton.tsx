import React from "react";
import { LogInIcon } from "./LogInIcon";
import { useLocation, useNavigate } from "react-router-dom";
import clsx from "clsx";
import styles from "./LoginButton.module.scss";

export const LoginButton: React.FC<{
  title: string;
  type?: React.ButtonHTMLAttributes<HTMLButtonElement>["type"];
  className: string;
}> = ({ title, type, className }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const redirectToLogin = () => {
    navigate("/login", { state: { from: location.pathname } });
  };

  return (
    <button
      onClick={redirectToLogin}
      className={clsx(className, styles.button)}
      type={type}
    >
      <div className={styles.content_button}>
        <LogInIcon className={styles.login_icon} />
        <span className=" ">{title}</span>
      </div>
    </button>
  );
};
