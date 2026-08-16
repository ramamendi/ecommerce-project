import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

function Layout({ isLoggedIn, setIsLoggedIn }) {
  return (
    <>
      <Navbar
        isLoggedIn={isLoggedIn}
        setIsLoggedIn={setIsLoggedIn}
      />

      <Outlet />
    </>
  );
}

export default Layout;