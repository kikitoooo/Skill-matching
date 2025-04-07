import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "../../../../features/store";
import { Link } from "react-router-dom";
import {
  authenticatedSelector,
  checkUserAuth,
  logoutUser,
} from "../../../../features/slices/userSlice";
import { LoginButton } from "./ui/LoginButton";
import { LogOutButton } from "./ui/LogOutButton";
import { ProfileIcon } from "./ui/ProfileIcon";
import { IconCross } from "../../../../shared/ui/IconCross";
import { IconBars } from "../../../../shared/ui/IconBars";
import { LogoIcon } from "./ui/LogoIcon";
import styles from "./Header.module.scss";
import clsx from "clsx";

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isAuthenticated = useSelector(authenticatedSelector);
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  const handleResize = () => {
    if (window.innerWidth > 640 && isMenuOpen) {
      setIsMenuOpen(false);
    }
  };

  useEffect(() => {
    dispatch(checkUserAuth());
  }, [dispatch]);

  useEffect(() => {
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [isMenuOpen]);
  return (
    <header className={styles.header}>
      <div className={styles.header_container}>
        <nav className={styles.nav_container}>
          <ul className={styles.nav_list}>
            <li className={styles.nav_item}>
              <Link className={styles.nav_link} to={`/`}>
                Главная
              </Link>
            </li>
            <li className={styles.nav_item}>
              <Link className={styles.nav_link} to={`/analysis`}>
                Перейти к анализу
              </Link>
            </li>
          </ul>
        </nav>
        <div className={styles.logo_container}>
          <Link className={styles.logo_link} to={"/"}>
            <LogoIcon className={styles.logo} />
          </Link>
        </div>
        <div className={styles.to_profile_container}>
          <Link className={styles.to_profile_link} to={`/profile`}>
            <ProfileIcon
              className={clsx(
                styles.profile_icon,
                ` ${
                  isAuthenticated
                    ? styles.for_auth_user
                    : styles.for_unauth_user
                }`
              )}
            />
          </Link>
          {!isAuthenticated ? (
            <LoginButton className={styles.login_logout_button} title="Войти" />
          ) : (
            <LogOutButton
              handleLogout={handleLogout}
              className={styles.login_logout_button}
              title="Выйти"
            />
          )}
        </div>
        <div
          className={styles.burger_container}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? (
            // SVG для закрытого состояния меню
            <IconCross />
          ) : (
            // SVG для открытого состояния меню
            <IconBars />
          )}
        </div>
        <nav
          className={clsx(
            styles.mobile_menu,
            isMenuOpen && styles.open_mobile_menu
          )}
        >
          <ul className={styles.nav_list}>
            <li className={styles.nav_item}>
              <Link className={styles.nav_link} to={`/`}>
                Главная
              </Link>
            </li>
            <li className={styles.nav_item}>
              <Link className={styles.nav_link} to={`/analysis`}>
                Перейти к анализу
              </Link>
            </li>
            <li
              className={` ${
                isAuthenticated ? styles.nav_item : styles.for_unauth_user
              }`}
            >
              <Link
                className={` ${
                  isAuthenticated
                    ? styles.to_profile_link
                    : styles.for_unauth_user
                }`}
                to={`/profile`}
              >
                <ProfileIcon
                  className={clsx(
                    styles.profile_icon,
                    ` ${
                      isAuthenticated
                        ? styles.for_auth_user
                        : styles.for_unauth_user
                    }`
                  )}
                />
              </Link>
            </li>
            <li>
              {!isAuthenticated ? (
                <LoginButton
                  className={styles.login_logout_button}
                  title="Войти"
                />
              ) : (
                <LogOutButton
                  handleLogout={handleLogout}
                  className={styles.login_logout_button}
                  title="Выйти"
                />
              )}
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};
