import { useLocation, useNavigate } from "react-router-dom";
import { MainButton } from "../../shared/ui/MainButton";
import styles from "./Registration.module.scss";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch, useSelector } from "../../features/store";
import { useState } from "react";
import { registerUser } from "../../features/slices/userSlice";
import { LoadingOverlay } from "../../shared/ui/LoadingOverlay";

export const RegistrationPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const isLoading = useSelector((state) => state.user.isLoading);
  const [error, setError] = useState("");

  const regFormSchema = yup.object().shape({
    email: yup
      .string()
      .required("Введите email")
      .email("Некорректный email"),
    name: yup
      .string()
      .required("Введите имя")
      .min(2, "Неверно заполнено имя. Минимум 2 символа"),
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
    resolver: yupResolver(regFormSchema),
    mode: "onChange",
  });

  const onSubmit = async (data) => {
    setError("");
    const { name, email, password } = data;

    try {
      await dispatch(registerUser({ username: name, email, password })).unwrap();
      navigate("/", { state: { from: location.pathname } });
    } catch (err) {
      setError("Ошибка при регистрации. Попробуйте снова.");
    }
  };

  const redirectToLogin = () => {
    navigate("/login", { state: { from: location.pathname } });
  };

  return (
    <main className={styles.container}>
      <h2>Регистрация</h2>

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
          <label className={styles.label}>Имя</label>
          <input
            {...register("name")}
            className={styles.input}
            type="text"
            placeholder="Введите имя"
          />
          {errors.name && (
            <span className={styles.error}>{errors.name.message}</span>
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
            title="Зарегистрироваться"
            className={styles.mainButton}
            type="submit"
            disabled={!isValid}
          />
        </div>
      </form>

      <div className={styles.registerPrompt}>
        Уже зарегистрированы?{" "}
        <span className={styles.registerLink} onClick={redirectToLogin}>
          Войти
        </span>
      </div>
    </main>
  );
};
