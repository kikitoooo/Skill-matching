import { FC } from "react";
import { CloseIcon } from "./ui/CloseIcon";
import styles from "./CloseButton.module.scss";

type CloseButtonProps = {
  onClick: () => void;
};

export const CloseButton: FC<CloseButtonProps> = ({ onClick }) => (
  <button
    type="button"
    className={styles.button}
    onClick={onClick}
    data-cy="closeX"
  >
    <CloseIcon className={styles.icon} />
  </button>
);
