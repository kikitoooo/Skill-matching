import { useEffect, useState } from "react";
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
import { ResumePage } from "../pages/ResumePage";
import { TestResumePage } from "../pages/TestResumePage";
import { ProfilePage } from "../pages/ProfilePage";
import { Dashboard } from "../pages/ProfilePage/ui/Dashboard";
import { EditProfilePage } from "../pages/ProfilePage/ui/EditProfilePage";
import { ScrollToTop } from "../features/hooks/scrollToTop";
import styles from "./App.module.scss";
import "../index.css";

export const App = () => {
  ScrollToTop();
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
            <Route path="/resumes" element={<TestResumePage />} />
            <Route path="/resumes/:id" element={<ResumePage />} />
            <Route
              path="/profile"
              element={
                // <ProtectedRoute>
                  <ProfilePage />
                // </ProtectedRoute>
              }
            >
              <Route index element={<Dashboard />} />
              <Route path="new-analysis" element={<AnalysisPage />} />
              <Route path="edit" element={<EditProfilePage />} />
            </Route>
          </Routes>
        </Layout>
      </div>
    </>
  );
};
