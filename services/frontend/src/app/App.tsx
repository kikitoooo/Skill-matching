import { useEffect, useState } from "react";
import styles from "./App.module.scss";
import "../index.css";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "../features/store";
import { checkUserAuth, getUser } from "../features/slices/userSlice";
import { fetchResumes } from "../features/slices/resumeSlice";
import { Layout } from "../widgets/Layout/Layout";
import { HomePage } from "../pages/HomePage";
import { AnalysisPage } from "../pages/AnalysisPage";
import { LoginPage } from "../pages/LoginPage";
import { RegistrationPage } from "../pages/RegistrationPage";
import { ProtectedRoute } from "./ProtectedRoute";
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
            <Route
              path="/analysis"
              element={
                <ProtectedRoute>
                  <AnalysisPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/login"
              element={
                <ProtectedRoute onlyUnAuth>
                  <LoginPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/register"
              element={
                <ProtectedRoute onlyUnAuth>
                  <RegistrationPage />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Layout>
      </div>
    </>
  );
};
