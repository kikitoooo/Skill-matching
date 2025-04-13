import { Outlet } from "react-router-dom";
import { ProfileSidebar } from "./ui/ProfileSidebar";
import { useEffect } from "react";
import { useDispatch } from "../../features/store";
import { fetchResumes } from "../../features/slices/resumeSlice";
import { getUser } from "../../features/slices/userSlice";
import styles from "./Profile.module.scss";

export const ProfilePage = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getUser());
    dispatch(fetchResumes());
  }, [dispatch]);

  return (
    <div className={styles.profilePage}>
      <ProfileSidebar />
      <div className={styles.content}>
        <Outlet />
      </div>
    </div>
  );
};