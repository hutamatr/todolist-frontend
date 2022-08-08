import React from "react";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <>
      <main className="px-6 py-[25vh]">
        <Outlet />
      </main>
    </>
  );
};

export default Layout;
