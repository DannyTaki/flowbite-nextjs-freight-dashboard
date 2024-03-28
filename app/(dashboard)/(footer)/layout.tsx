import type { FC, PropsWithChildren } from "react";
import DashboardFooter from "./footer";

const DashboardLayout: FC<PropsWithChildren> = function ({ children }) {
  return (
    <>
      <main>{children}</main>
      <DashboardFooter />
    </>
  );
};

export default DashboardLayout;
