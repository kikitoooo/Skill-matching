import { MainButton } from "../../../../shared/ui/MainButton";
import styles from "./SelectedFile.module.scss";

interface Props {
  file: File;
  onUpload: () => void;
}

export const SelectedFile = ({ file, onUpload }: Props) => {
  return (
    <div className={styles.selected_file}>
      <p className={styles.paragraph}>
        Выбранный файл: <strong>{file.name}</strong>
      </p>
      <MainButton
        className={styles.upload_button}
        title="Загрузить"
        onClick={onUpload}
      />
    </div>
  );
};
