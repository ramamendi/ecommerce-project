import { Link } from "react-router-dom";

function Navbar({ isLoggedIn, setIsLoggedIn }) {
  const logout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");

    setIsLoggedIn(false);
  };

  return (
    <nav className="navbar navbar-dark bg-dark">
      <div className="container">
        <Link to="/" className="navbar-brand">
          My E-Commerce Store
        </Link>

        <div>
          {isLoggedIn ? (
            <>
              <Link
                to="/orders"
                className="btn btn-outline-light me-2"
              >
                📦 My Orders
              </Link>

              <Link
                to="/cart"
                className="btn btn-outline-light me-2"
              >
                🛒 Cart
              </Link>

              <button
                className="btn btn-outline-danger"
                onClick={logout}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="btn btn-outline-light me-2"
              >
                Login
              </Link>

              <Link
                to="/cart"
                className="btn btn-outline-light"
              >
                🛒 Cart
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;