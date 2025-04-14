import React from "react";
import styles from "./LoadingOverlay.module.scss";

export const LoadingOverlay = () => (
  <div className={styles.overlay}>
    <div className={styles.spinner}></div>
  </div>
);
