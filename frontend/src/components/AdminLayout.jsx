import { Link, Outlet, useNavigate } from "react-router-dom";

function AdminLayout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    localStorage.removeItem("isAdmin");

    navigate("/login");
    window.location.reload();
  };

  return (
    <>
      <nav className="navbar navbar-dark bg-dark px-4">
        <div className="container-fluid">
          <Link
            to="/admin"
            className="navbar-brand"
          >
            🛍️ Admin Panel
          </Link>

          <div className="d-flex gap-2">
            <Link
              to="/admin"
              className="btn btn-outline-light"
            >
              Dashboard
            </Link>

            <Link
              to="/admin/products/add"
              className="btn btn-outline-light"
            >
              + Add Product
            </Link>

            <Link
              to="/admin/orders"
              className="btn btn-outline-light"
            >
              📦 Orders
            </Link>

            <button
              className="btn btn-outline-danger"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <Outlet />
    </>
  );
}

export default AdminLayout;