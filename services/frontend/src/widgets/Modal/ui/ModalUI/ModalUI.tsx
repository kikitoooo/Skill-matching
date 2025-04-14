import { FC, memo } from "react";
import { ReactNode } from "react";
import { ModalOverlay } from "../ModalOverlay/ModalOverlay";
import { CloseButton } from "../CloseButton/CloseButton";
import styles from "./ModalUI.module.scss";

export type TModalUIProps = {
  title: string;
  onClose: () => void;
  children?: ReactNode;
};

export const ModalUI: FC<TModalUIProps> = memo(({ onClose, children }) => (
  <>
    <div className={styles.modal} data-cy="modal-auth">
      <div className={styles.button_container}>
        <CloseButton onClick={onClose} />
      </div>
      <div className={styles.content}>{children}</div>
    </div>
    <ModalOverlay onClick={onClose} />
  </>
));
