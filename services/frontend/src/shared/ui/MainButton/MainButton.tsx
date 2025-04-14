import React, { SyntheticEvent } from "react";
import { ArrowIcon } from "./ui/ArrowIcon";
import styles from "./MainButton.module.scss";
import clsx from "clsx";
export const MainButton: React.FC<{
  title: string;
  onClick?: (() => void) | ((e: SyntheticEvent) => void);
  type?: React.ButtonHTMLAttributes<HTMLButtonElement>["type"];
  className: string;
  disabled?: boolean | undefined;
}> = ({ title, onClick, type, className, disabled }) => {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={clsx(
        className,
        styles.button,
        disabled ? styles.button_disable : ""
      )}
      type={type}
    >
      <div className={styles.button_content}>
        <ArrowIcon
          className={clsx(
            styles.arrow_icon,
            disabled ? styles.arrow_icon_disable : styles.arrow_icon_active
          )}
        />
        <span
          className={clsx(
            styles.title,
            disabled ? styles.unanimate_title : styles.animate_title
          )}
        >
          {title}
        </span>
      </div>
    </button>
  );
};
