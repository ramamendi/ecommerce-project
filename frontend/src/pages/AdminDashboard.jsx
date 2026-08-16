import { useEffect, useState } from "react";
import api from "../api/axios";
import { Link } from "react-router-dom";

function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchProducts = async () => {
    try {
      const response = await api.get(
        "/products/products/"
      );

      setProducts(response.data);
    } catch (error) {
      console.error("Fetch products error:", error);

      setError(
        error.response?.data?.detail ||
          "Unable to load products."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const deleteProduct = async (
    productId,
    productName
  ) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${productName}"?`
    );

    if (!confirmed) {
      return;
    }

    try {
      await api.delete(
        `/products/products/${productId}/`
      );

      alert("Product deleted successfully!");

      fetchProducts();
    } catch (error) {
      console.error(
        "Delete product error:",
        error
      );

      alert(
        error.response?.data?.detail ||
          "Unable to delete product."
      );
    }
  };

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <h3>Loading admin dashboard...</h3>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <h1 className="mb-4">
        Admin Dashboard
      </h1>

      <div className="card shadow-sm">
        <div className="card-header bg-dark text-white d-flex justify-content-between align-items-center">
          <h4 className="mb-0">
            Products
          </h4>

          <div className="d-flex gap-2">
            <Link
              to="/admin/orders"
              className="btn btn-info"
            >
              📦 Orders
            </Link>

            <Link
              to="/admin/products/add"
              className="btn btn-success"
            >
              + Add Product
            </Link>
          </div>
        </div>

        <div className="card-body">
          {products.length === 0 ? (
            <p>No products found.</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-bordered align-middle">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Product</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {products.map((product) => (
                    <tr key={product.id}>
                      <td>{product.id}</td>

                      <td>
                        <strong>
                          {product.name}
                        </strong>
                      </td>

                      <td>
                        {product.category_name}
                      </td>

                      <td>
                        ₹{product.price}
                      </td>

                      <td>
                        {product.stock}
                      </td>

                      <td>
                        {product.is_active ? (
                          <span className="badge bg-success">
                            Active
                          </span>
                        ) : (
                          <span className="badge bg-danger">
                            Inactive
                          </span>
                        )}
                      </td>

                      <td>
                        <Link
                          to={`/admin/products/edit/${product.id}`}
                          className="btn btn-sm btn-warning me-2"
                        >
                          Edit
                        </Link>

                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() =>
                            deleteProduct(
                              product.id,
                              product.name
                            )
                          }
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;