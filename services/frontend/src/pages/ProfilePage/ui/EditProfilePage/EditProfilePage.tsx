import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { clearErrors } from 'react-hook-form';
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch, useSelector } from "../../../../features/store";
import { TRegisterData } from "../../../../entities/models/types";
import { selectUser, updateUser } from "../../../../features/slices/userSlice";
import { LoadingOverlay } from "../../../../shared/ui/LoadingOverlay";
import styles from "./EditProfilePage.module.scss";

const profileSchema = yup.object().shape({
  name: yup.string(),
  lastName: yup.string(),
  email: yup
    .string()
    .nullable()
    .transform(value => value?.trim() || null)
    .email("Невалидный email"),
  password: yup
    .string()
    .nullable()
    .transform(value => value || null)
    .matches(
      /^[a-zA-Z0-9#%]*$/,
      "Допустимы только английские буквы, цифры и символы #, %"
    )
    .min(6, "Минимум 6 символов")
    .max(30, "Максимум 30 символов"),
  confirmPassword: yup
    .string()
    .nullable()
    .transform(value => value || null)
    .when("password", {
      is: password => !!password,
      then: schema => schema
        .required("Подтвердите пароль")
        .oneOf([yup.ref("password")], "Пароли не совпадают"),
      otherwise: schema => schema.nullable()
    })
});


type FormData = yup.InferType<typeof profileSchema>;

export const EditProfilePage = () => {
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
    watch,
    trigger,
    clearErrors
  } = useForm<FormData>({
    resolver: yupResolver(profileSchema),
    mode: "onChange",
    defaultValues: {
      name: user.name || "",
      lastName: user.lastName || "",
      email: user.email || "",
      password: null,
      confirmPassword: null
    }
    
  });

  const [name, lastName, email, password, confirmPassword] = watch([
    "name",
    "lastName",
    "email",
    "password",
    "confirmPassword"
  ]);

  useEffect(() => {
    if (password) {
      trigger("confirmPassword");
    } else {
      clearErrors("confirmPassword");
    }
  }, [password, trigger, clearErrors]);


  
  const isSubmitDisabled =
  ( !name?.trim() &&
    !lastName?.trim() &&
    !email?.trim() &&
    !password?.trim() &&
    !confirmPassword?.trim()) ||
    !!errors.name ||
    !!errors.lastName ||
    !!errors.email ||
    !!errors.password ||
    !!errors.confirmPassword ||
    (password && password !== confirmPassword);

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    setServerError("");

    try {
      const updateData: Partial<TRegisterData> = {
        ...(data.name && { name: data.name.trim() }),
        ...(data.lastName && { lastName: data.lastName.trim() }),
        ...(data.email && { email: data.email.trim() }),
        ...(data.password && { password: data.password })
      };

      await dispatch(updateUser(updateData)).unwrap();
      reset({
        ...data,
        password: null,
        confirmPassword: null
      }, { keepValues: true });
      
      alert("Данные успешно обновлены!");
    } catch (error) {
      console.error("Ошибка при обновлении:", error);
      setServerError("Ошибка при сохранении данных");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.editProfile}>
      <h2>Изменить данные профиля</h2>
      
      {isLoading && <LoadingOverlay />}

      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        <div className={styles.formGroup}>
          <label>Имя</label>
          <input 
            type="text" 
            {...register("name")}
            className={errors.name ? styles.errorInput : ""}
          />
          {errors.name && <span className={styles.error}>{errors.name.message}</span>}
        </div>

        <div className={styles.formGroup}>
          <label>Фамилия</label>
          <input 
            type="text" 
            {...register("lastName")}
            className={errors.lastName ? styles.errorInput : ""}
          />
          {errors.lastName && <span className={styles.error}>{errors.lastName.message}</span>}
        </div>

        <div className={styles.formGroup}>
          <label>Email</label>
          <input 
            type="email" 
            {...register("email")}
            className={errors.email ? styles.errorInput : ""}
          />
          {errors.email && <span className={styles.error}>{errors.email.message}</span>}
        </div>

        <div className={styles.formGroup}>
          <label>Компания</label>
          <input 
            type="text" 
            value="Газпром" 
            disabled 
          />
        </div>

        <div className={styles.formGroup}>
          <label>Новый пароль</label>
          <input
            type="password"
            placeholder="Оставьте пустым, если не нужно менять"
            {...register("password")}
            className={errors.password ? styles.errorInput : ""}
          />
          {errors.password && (
            <span className={styles.error}>{errors.password.message}</span>
          )}
        </div>

        <div className={styles.formGroup}>
          <label>Подтвердите пароль</label>
          <input
            type="password"
            placeholder={password ? "Подтвердите новый пароль" : "Оставьте пустым"}
            {...register("confirmPassword")}
            className={errors.confirmPassword ? styles.errorInput : ""}
          />
          {errors.confirmPassword && (
            <span className={styles.error}>{errors.confirmPassword.message}</span>
          )}
        </div>

        {serverError && <p className={styles.serverError}>{serverError}</p>}

        <button
          type="submit"
          className={`${styles.saveButton} ${isSubmitDisabled ? styles.disabled : ''}`}
          disabled={isSubmitDisabled}
        >
          Сохранить изменения
        </button>
      </form>
    </div>
  );
};