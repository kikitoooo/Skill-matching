import { useEffect, useState } from "react";
import styles from "./App.module.scss";
import "../index.css";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "../features/store";
import { checkUserAuth, getUser } from "../features/slices/userSlice";
import { fetchResumes } from "../features/slices/resumeSlice";
import { Layout } from "../widgets/Layout/Layout";
import { HomePage } from "../pages/HomePage";
export const App = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const backgroundLocation = location.state?.background;
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkUserAuth());
    dispatch(getUser());
    dispatch(fetchResumes());
  }, [dispatch]);

  const onClose = () => {
    navigate(-1);
  };
  return (
    <>
      <div className={styles.app}>
        <Layout>
          <Routes location={backgroundLocation || location}>
            <Route path="/" element={<HomePage />} />
          </Routes>
        </Layout>
      </div>
    </>
  );
};
