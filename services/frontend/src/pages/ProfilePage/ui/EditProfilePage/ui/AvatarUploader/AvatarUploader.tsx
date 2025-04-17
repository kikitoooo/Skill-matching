import { useRef } from "react";
import styles from "../../EditProfilePage.module.scss";

interface AvatarUploaderProps {
  previewImage: string | null;
  userImage: string | undefined;
  onImageChange: (image: string | null) => void;
  serverError: string;
  setServerError: (error: string) => void;
}

export const AvatarUploader = ({
  previewImage,
  userImage,
  onImageChange,
  serverError,
  setServerError,
}: AvatarUploaderProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.match("image.*")) {
        setServerError("Пожалуйста, выберите файл изображения");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setServerError("Размер файла не должен превышать 5MB");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        onImageChange(reader.result as string);
      };
      reader.readAsDataURL(file);
      setServerError("");
    }
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={styles.avatarContainer}>
      <div className={styles.avatarWrapper} onClick={handleImageClick}>
        {previewImage ? (
          <img
            src={previewImage}
            alt="Preview"
            className={styles.avatarImage}
          />
        ) : userImage ? (
          <img src={userImage} alt="User" className={styles.avatarImage} />
        ) : (
          <div className={styles.avatarPlaceholder}>
            <span>+</span>
          </div>
        )}
      </div>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImageChange}
        accept="image/*"
        style={{ display: "none" }}
      />
      <p className={styles.avatarHint}>
        {previewImage ? "Изменить фото" : "Добавить фото"}
      </p>
    </div>
  );
};
