import * as yup from "yup";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch } from "../../features/store";
import { loginUser } from "../../features/slices/userSlice";
import { MainButton } from "../../shared/ui/MainButton";
import { LoadingOverlay } from "../../shared/ui/LoadingOverlay";
import { TLoginData } from "../../entities/models/types";
import styles from "./Login.module.scss";

export const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const authFormSchema = yup.object().shape({
    email: yup.string().required("Введите email").email("Некорректный email"),
    password: yup
      .string()
      .required("Введите пароль")
      .matches(
        /^[\w#%]+$/,
        "Неверно заполнен пароль. Допускаются английские буквы, цифры и знаки # и %"
      )
      .min(6, "Неверно заполнен пароль. Минимум 6 символов")
      .max(30, "Неверно заполнен пароль. Максимум 30 символов"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    resolver: yupResolver(authFormSchema),
    mode: "onChange",
  });

  const onSubmit = async (data: TLoginData) => {
    setIsLoading(true);
    try {
      setError("");
      await dispatch(loginUser(data)).unwrap();
      redirectToMain();
    } catch (error) {
      setError("Данного пользователя не существует.");
    } finally {
      setIsLoading(false);
    }
  };

  const redirectToRegister = () => {
    navigate("/register", { state: { from: location.pathname } });
  };

  const redirectToMain = () => {
    navigate("/", { state: { from: location.pathname } });
  };

  return (
    <main className={styles.container}>
      <h2 className={styles.heading}>Вход</h2>

      {isLoading && <LoadingOverlay />}

      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        <div className={styles.inputGroup}>
          <label className={styles.label}>Почта</label>
          <input
            {...register("email")}
            className={styles.input}
            type="email"
            placeholder="Введите email"
          />
          {errors.email && (
            <span className={styles.error}>{errors.email.message}</span>
          )}
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label}>Пароль</label>
          <input
            {...register("password")}
            className={styles.input}
            type="password"
            placeholder="Введите пароль"
          />
          {errors.password && (
            <span className={styles.error}>{errors.password.message}</span>
          )}
        </div>

        {error && <p className={styles.error}>{error}</p>}

        <div className={styles.buttonContainer}>
          <MainButton
            title="Войти"
            className={styles.mainButton}
            type="submit"
            disabled={!isValid}
          />
        </div>
      </form>

      <div className={styles.registerPrompt}>
        Нет профиля?{" "}
        <span className={styles.registerLink} onClick={redirectToRegister}>
          Зарегистрироваться
        </span>
      </div>
    </main>
  );
};
