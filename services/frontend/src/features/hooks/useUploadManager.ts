import { useState } from "react";
import { useDispatch } from "../store";
import { analyzeResume } from "../slices/resumeSlice";
import { v4 as uuidv4 } from "uuid";
import { getUser } from "../slices/userSlice";

export type UploadStatus = "uploading" | "done";
export type NotificationType = "success" | "warning" | "error";

export interface UploadProgress {
  id: string;
  name: string;
  progress: number;
  status: UploadStatus;
  isVisible: boolean;
}

export interface NotificationItem {
  name: string;
  message: string;
  type: NotificationType;
  isVisible: boolean;
}

export const useUploadManager = () => {
  const dispatch = useDispatch();
  const [error, setError] = useState<string | null>(null);
  const [uploads, setUploads] = useState<UploadProgress[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const validateFile = (file: File): boolean => {
    const validTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    const validExtensions = [".pdf", ".docx"];
    const extension = file.name.slice(file.name.lastIndexOf(".")).toLowerCase();

    if (
      !validTypes.includes(file.type) &&
      !validExtensions.includes(extension)
    ) {
      setError("Поддерживаются только файлы PDF или DOCX.");
      return false;
    }

    return true;
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    const id = uuidv4();
    const name = selectedFile.name;

    const newUpload: UploadProgress = {
      id,
      name,
      progress: 0,
      status: "uploading",
      isVisible: true,
    };

    setUploads((prev) => [...prev, newUpload]);
    setSelectedFile(null);

    try {
      setUploads((prev) =>
        prev.map((u) => (u.id === id ? { ...u, progress: 30 } : u))
      );

      const result = await dispatch(analyzeResume(selectedFile)).unwrap();
      dispatch(getUser());

      if (!result.job || Object.keys(result.skills).length === 0) {
        throw new Error("Невозможно извлечь данные из резюме.");
      }

      setUploads((prev) =>
        prev.map((u) =>
          u.id === id ? { ...u, progress: 100, status: "done" } : u
        )
      );

      setNotifications((prev) => [
        ...prev,
        {
          name,
          message: "Анализ завершён. Посмотрите результат в личном кабинете.",
          type: "success",
          isVisible: true,
        },
      ]);
    } catch (error: any) {
      const errorMessage =
        typeof error === "string"
          ? error
          : error?.message || "Неизвестная ошибка";

      setNotifications((prev) => [
        ...prev,
        {
          name,
          message:
            errorMessage === "Невозможно извлечь данные из резюме."
              ? "Файл не содержит распознаваемой информации."
              : "Ошибка сервера. Попробуйте снова.",
          type: errorMessage.includes("распознаваемой") ? "warning" : "error",
          isVisible: true,
        },
      ]);
    }

    setTimeout(() => {
      setUploads((prev) =>
        prev.map((u) => (u.id === id ? { ...u, isVisible: false } : u))
      );
      setNotifications((prev) =>
        prev.map((n) => (n.name === name ? { ...n, isVisible: false } : n))
      );
    }, 3000);

    setTimeout(() => {
      setUploads((prev) => prev.filter((u) => u.id !== id));
      setNotifications((prev) => prev.filter((n) => n.name !== name));
    }, 4000);
  };

  return {
    error,
    uploads,
    notifications,
    selectedFile,
    setSelectedFile,
    setError,
    validateFile,
    handleUpload,
  };
};
