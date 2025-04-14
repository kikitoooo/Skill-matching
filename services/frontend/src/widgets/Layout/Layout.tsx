import { FC, ReactNode } from "react";
import { Header } from "./ui/Header";
import { Footer } from "./ui/Footer";

export const Layout: FC<{
  children: ReactNode;
}> = ({ children }) => {
  return (
    <>
      <Header />

      {children}

      <Footer />
    </>
  );
};
