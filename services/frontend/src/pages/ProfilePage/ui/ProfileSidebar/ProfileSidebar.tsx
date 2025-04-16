import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from '../../../../features/store';
import { selectUser } from '../../../../features/slices/userSlice';
import { DashboardIcon } from './ui/DashboardIcon';
import { PlusIcon } from './ui/PlusIcon';
import { EditIcon } from './ui/EditIcon';
import { NavLinkItem } from './ui/NavLinkItem';
import styles from './ProfileSidebar.module.scss';

export const ProfileSidebar = () => {
  const user = useSelector(selectUser);
  
  const getInitials = () => {
    if (user?.image) return null;
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
        <div className={styles.avatar}>
          {user?.image ? (
            <img 
              src={user.image} 
              alt="User avatar" 
              className={styles.avatarImage}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
              }}
            />
          ) : (
            <span className={styles.avatarInitials}>{getInitials()}</span>
          )}
        </div>
        <div className={styles.name}>{getFullName()}</div>
        <div className={styles.company}>Газпром</div>
      </div>
      
      <nav className={styles.nav}>
        <NavLinkItem 
          to="/profile" 
          icon={<DashboardIcon />}
          text="Dashboard"
          end
        />
        <NavLinkItem 
          to="/profile/new-analysis" 
          icon={<PlusIcon />}
          text="Новый анализ"
        />
        <NavLinkItem 
          to="/profile/edit" 
          icon={<EditIcon />}
          text="Изменить данные профиля"
        />
      </nav>
    </div>
  );
};