import * as yup from "yup";
import { useEffect, useState } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch, useSelector } from "../../../../features/store";
import { TRegisterData } from "../../../../entities/models/types";
import { selectUser, updateUser } from "../../../../features/slices/userSlice";
import { LoadingOverlay } from "../../../../shared/ui/LoadingOverlay";
import { MainButton } from "../../../../shared/ui/MainButton";
import { Notification } from "../../../AnalysisPage/ui/Notification";
import { AvatarUploader } from "./ui/AvatarUploader";
import { FormInput } from "./ui/FormInput";
import styles from "./EditProfilePage.module.scss";

type NotificationType = "success" | "warning" | "error";

const profileSchema = yup.object({
  name: yup.string().optional(),
  lastName: yup.string().optional(),
  email: yup
    .string()
    .nullable()
    .transform((value) => value?.trim() || null)
    .email("Невалидный email")
    .optional(),
  password: yup
    .string()
    .nullable()
    .transform((value) => value || null)
    .matches(
      /^[a-zA-Z0-9#%]*$/,
      "Допустимы только английские буквы, цифры и символы #, %"
    )
    .min(6, "Минимум 6 символов")
    .max(30, "Максимум 30 символов")
    .optional(),
  confirmPassword: yup
    .string()
    .nullable()
    .transform((value) => value || null)
    .when("password", {
      is: (password: string | null | undefined) => !!password,
      then: (schema) =>
        schema
          .required("Подтвердите пароль")
          .oneOf([yup.ref("password")], "Пароли не совпадают"),
      otherwise: (schema) => schema.nullable(),
    })
    .optional(),
});

type FormData = yup.InferType<typeof profileSchema>;

export const EditProfilePage = () => {
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState("");
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [notification, setNotification] = useState({
    isVisible: false,
    name: "",
    message: "",
    type: "success" as NotificationType,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    trigger,
    clearErrors,
  } = useForm<FormData>({
    resolver: yupResolver(profileSchema) as Resolver<FormData>,
    mode: "onChange",
    defaultValues: {
      name: user.name || "",
      lastName: user.lastName || "",
      email: user.email || "",
      password: null,
      confirmPassword: null,
    },
  });

  const [name, lastName, email, password, confirmPassword] = watch([
    "name",
    "lastName",
    "email",
    "password",
    "confirmPassword",
  ]);

  useEffect(() => {
    if (password) {
      trigger("confirmPassword");
    } else {
      clearErrors("confirmPassword");
    }
  }, [password, trigger, clearErrors]);

  const showNotification = (
    name: string,
    message: string,
    type: NotificationType = "success"
  ) => {
    setNotification({
      isVisible: true,
      name,
      message,
      type,
    });

    setTimeout(() => {
      setNotification((prev) => ({ ...prev, isVisible: false }));
    }, 2000);
  };

  const isSubmitDisabled =
    (!name?.trim() &&
      !lastName?.trim() &&
      !email?.trim() &&
      !password?.trim() &&
      !confirmPassword?.trim() &&
      !previewImage) ||
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
        ...(data.password && { password: data.password }),
        ...(previewImage && { image: previewImage }),
      };

      await dispatch(updateUser(updateData)).unwrap();
      reset(
        {
          ...data,
          password: null,
          confirmPassword: null,
        },
        { keepValues: true }
      );

      showNotification("Успех", "Данные профиля успешно обновлены");
    } catch (error) {
      console.error("Ошибка при обновлении:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Ошибка при сохранении данных";
      setServerError(errorMessage);
      showNotification("Ошибка", errorMessage, "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.editProfile}>
      <h2>Изменить данные профиля</h2>

      {isLoading && <LoadingOverlay />}

      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        <div className={styles.formColumns}>
          <div className={styles.leftColumn}>
            <AvatarUploader
              previewImage={previewImage}
              userImage={user.image}
              onImageChange={setPreviewImage}
              serverError={serverError}
              setServerError={setServerError}
            />

            <FormInput
              label="Имя"
              type="text"
              register={register("name")}
              error={errors.name}
            />

            <FormInput
              label="Фамилия"
              type="text"
              register={register("lastName")}
              error={errors.lastName}
            />
          </div>

          <div className={styles.rightColumn}>
            <FormInput
              label="Email"
              type="email"
              register={register("email")}
              error={errors.email}
            />

            <div className={styles.formGroup}>
              <label>Компания</label>
              <input type="text" value="Газпром" disabled />
            </div>

            <FormInput
              label="Новый пароль"
              type="password"
              register={register("password")}
              error={errors.password}
            />

            <FormInput
              label="Подтвердите пароль"
              type="password"
              placeholder={password ? "Подтвердите новый пароль" : ""}
              register={register("confirmPassword")}
              error={errors.confirmPassword}
            />
          </div>
        </div>

        <div className={styles.notificationWrapper}>
          <Notification
            isVisible={notification.isVisible}
            name={notification.name}
            message={notification.message}
            type={notification.type}
          />
        </div>

        <MainButton
          title="Сохранить изменения"
          className={`${styles.mainButton} ${
            isSubmitDisabled ? styles.disabled : ""
          }`}
          type="submit"
        />
      </form>
    </div>
  );
};
