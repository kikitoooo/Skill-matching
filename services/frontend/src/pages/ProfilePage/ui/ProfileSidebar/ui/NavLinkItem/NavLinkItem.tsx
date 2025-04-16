import React from 'react';
import { NavLink } from 'react-router-dom';
import styles from './NavLinkItem.module.scss';

interface NavLinkItemProps {
  to: string;
  icon: React.ReactNode;
  text: string;
  end?: boolean;
}

export const NavLinkItem: React.FC<NavLinkItemProps> = ({ 
  to, 
  icon, 
  text, 
  end = false 
}) => {
  return (
    <NavLink 
      to={to} 
      className={({ isActive }) => 
        isActive ? `${styles.link} ${styles.active}` : styles.link
      }
      end={end}
    >
      {icon}
      <span>{text}</span>
    </NavLink>
  );
};