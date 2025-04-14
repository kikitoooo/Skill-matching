import { FC } from "react";
import styles from "./ModalOverlay.module.scss";

type ModalOverlayProps = {
  onClick: () => void;
};

export const ModalOverlay: FC<ModalOverlayProps> = ({ onClick }) => (
  <div className={styles.overlay} onClick={onClick} data-cy="closeOverlay" />
);
