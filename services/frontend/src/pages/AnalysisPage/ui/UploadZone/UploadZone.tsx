import styles from "./UploadZone.module.scss";

interface UploadZoneProps {
  isDragging: boolean;
  onDrop: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragLeave: () => void;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  triggerFileSelect: () => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
}

export const UploadZone = ({
  isDragging,
  onDrop,
  onDragOver,
  onDragLeave,
  onFileChange,
  triggerFileSelect,
  inputRef,
}: UploadZoneProps) => {
  return (
    <div
      className={`${styles.dropzone} ${isDragging ? styles.dragging : ""}`}
      onDrop={onDrop}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onClick={triggerFileSelect}
    >
      <p className={styles.paragraph}>Перетащите своё резюме сюда</p>
      <p className={styles.format}>Поддерживаемый формат: PDF, DOCX</p>
      <button className={styles.select_button}>Или выберите файл</button>
      <input
        type="file"
        accept=".pdf,.docx"
        onChange={onFileChange}
        hidden
        ref={inputRef}
      />
    </div>
  );
};
