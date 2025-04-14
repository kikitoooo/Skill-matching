import styles from "./ProfileSidebar.module.scss";
import { NavLink } from "react-router-dom";
import { useSelector } from "../../../../features/store";
import { selectUser } from "../../../../features/slices/userSlice";

export const ProfileSidebar = () => {
  const user = useSelector(selectUser);
  
  const getInitials = () => {
    if (!user?.name) return "ГС";
    
    const names = user.name.split(' ');
    const initials = names.map(n => n[0]).join('').toUpperCase();
    return initials || "ГС";
  };

  const getFullName = () => {
    if (!user?.name) return "Гость Системы";
    return `${user.name} ${user.lastName || ''}`.trim();
  };

  return (
    <div className={styles.sidebar}>
      <div className={styles.userInfo}>
        <div className={styles.avatar}>{getInitials()}</div>
        <div className={styles.name}>{getFullName()}</div>
        <div className={styles.company}>Газпром</div>
      </div>
      
      <nav className={styles.nav}>
        <NavLink 
          to="/profile" 
          className={({ isActive }) => 
            isActive ? `${styles.link} ${styles.active}` : styles.link
          }
          end
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 4C3 3.44772 3.44772 3 4 3H16C16.5523 3 17 3.44772 17 4V6C17 6.55228 16.5523 7 16 7H4C3.44772 7 3 6.55228 3 6V4Z" />
            <path d="M3 10C3 9.44772 3.44772 9 4 9H10C10.5523 9 11 9.44772 11 10V16C11 16.5523 10.5523 17 10 17H4C3.44772 17 3 16.5523 3 16V10Z" />
            <path d="M14 9C13.4477 9 13 9.44772 13 10V16C13 16.5523 13.4477 17 14 17H16C16.5523 17 17 16.5523 17 16V10C17 9.44772 16.5523 9 16 9H14Z" />
          </svg>
          <span>Dashboard</span>
        </NavLink>
        <NavLink 
          to="/profile/new-analysis" 
          className={({ isActive }) => 
            isActive ? `${styles.link} ${styles.active}` : styles.link
          }
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 2.5C10.4142 2.5 10.75 2.83579 10.75 3.25V9.25H16.75C17.1642 9.25 17.5 9.58579 17.5 10C17.5 10.4142 17.1642 10.75 16.75 10.75H10.75V16.75C10.75 17.1642 10.4142 17.5 10 17.5C9.58579 17.5 9.25 17.1642 9.25 16.75V10.75H3.25C2.83579 10.75 2.5 10.4142 2.5 10C2.5 9.58579 2.83579 9.25 3.25 9.25H9.25V3.25C9.25 2.83579 9.58579 2.5 10 2.5Z" />
          </svg>
          <span>Новый анализ</span>
        </NavLink>
        <NavLink 
          to="/profile/edit" 
          className={({ isActive }) => 
            isActive ? `${styles.link} ${styles.active}` : styles.link
          }
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M13.5858 3.58579C14.3668 2.80474 15.6332 2.80474 16.4142 3.58579C17.1953 4.36683 17.1953 5.63316 16.4142 6.41421L15.6213 7.20711L12.7929 4.37868L13.5858 3.58579Z" />
            <path d="M11.3787 5.79289L3 14.1716V17H5.82842L14.2071 8.62132L11.3787 5.79289Z" />
          </svg>
          <span>Изменить данные профиля</span>
        </NavLink>
      </nav>
    </div>
  );
};