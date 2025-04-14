import React from 'react';
import { LogOutIcon } from './LogOutIcon';

export const LogOutButton: React.FC<{
  title: string;
  handleLogout: () => void;
  type?: React.ButtonHTMLAttributes<HTMLButtonElement>['type'];
  className: string;
}> = ({ title, handleLogout, type, className }) => {
  return (
    <button
      onClick={handleLogout}
      className={
        className +
        ` login_button h-14 text-base text-center rounded-[8px] cursor-pointer leading-6 border-none shadow-accent-orange focus:outline-none focus:shadow-green-400  active:shadow-green-400  hover:shadow-green-400 font-bold py-3 px-5 lg:text-lg 2xl:py-4 2xl:px-6 2xl:h-16 2xl:text-2xl 3xl:text-3xl 3xl:h-20 transition-all`
      }
      type={type}
    >
      <div className={`flex gap-3 items-center justify-center mx-auto`}>
        <LogOutIcon />
        <span className=" ">{title}</span>
      </div>
    </button>
  );
};
