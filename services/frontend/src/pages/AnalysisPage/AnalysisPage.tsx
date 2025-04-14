import { useRef, useState } from "react";
import { UploadZone } from "./ui/UploadZone";
import { SelectedFile } from "./ui/SelectedFile";
import { ProgressBar } from "./ui/ProgressBar";
import { Notification } from "./ui/Notification";
import { useUploadManager } from "../../features/hooks/useUploadManager";
import styles from "./AnalysisPage.module.scss";

export const AnalysisPage = () => {
  const {
    error,
    uploads,
    notifications,
    selectedFile,
    setSelectedFile,
    setError,
    validateFile,
    handleUpload,
  } = useUploadManager();

  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (!file) return;

    if (!validateFile(file)) return;

    setSelectedFile(file);
    setError(null);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!validateFile(file)) return;

    setSelectedFile(file);
    setError(null);
  };

  return (
    <main>
      <section className={styles.analysis_section}>
        <div className={styles.wrapper}>
          <h2 className={styles.heading}>Анализ резюме</h2>

          <UploadZone
            isDragging={isDragging}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onFileChange={handleFileChange}
            inputRef={inputRef}
            triggerFileSelect={() => inputRef.current?.click()}
          />

          {error && <p className={styles.error}>{error}</p>}

          {selectedFile && (
            <SelectedFile file={selectedFile} onUpload={handleUpload} />
          )}

          {uploads.map((upload) => (
            <ProgressBar
              key={upload.id}
              name={upload.name}
              progress={upload.progress}
              status={upload.status}
              isVisible={upload.isVisible}
            />
          ))}
          <div className={styles.notifications}>
            {notifications.map((n) => (
              <Notification
                key={n.name}
                name={n.name}
                message={n.message}
                type={n.type}
                isVisible={n.isVisible}
              />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};
