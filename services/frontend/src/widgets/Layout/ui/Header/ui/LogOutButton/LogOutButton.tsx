import React from "react";
import { LogOutIcon } from "./LogOutIcon";
import clsx from "clsx";
import styles from "./LogOutButton.module.scss";

export const LogOutButton: React.FC<{
  title: string;
  handleLogout: () => void;
  type?: React.ButtonHTMLAttributes<HTMLButtonElement>["type"];
  className: string;
}> = ({ title, handleLogout, type, className }) => {
  return (
    <button
      onClick={handleLogout}
      className={clsx(className, styles.button)}
      type={type}
    >
      <div className={styles.content_button}>
        <LogOutIcon className={styles.logout_icon} />
        <span className=" ">{title}</span>
      </div>
    </button>
  );
};
