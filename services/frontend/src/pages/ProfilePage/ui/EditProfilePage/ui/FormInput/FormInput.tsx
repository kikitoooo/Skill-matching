import styles from "../../EditProfilePage.module.scss";

interface FormInputProps {
  label: string;
  type: string;
  register: any;
  error?: { message?: string };
  placeholder?: string;
  disabled?: boolean;
  value?: string;
}

export const FormInput = ({
  label,
  type,
  register,
  error,
  placeholder,
  disabled,
  value,
}: FormInputProps) => {
  return (
    <div className={styles.formGroup}>
      <label>{label}</label>
      <input
        type={type}
        {...register}
        className={error ? styles.errorInput : ""}
        placeholder={placeholder}
        disabled={disabled}
        value={value}
      />
      {error && <span className={styles.error}>{error.message}</span>}
    </div>
  );
};