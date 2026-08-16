import { useEffect, useState } from "react";
import api from "../api/axios";
import { Link } from "react-router-dom";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchOrders = async () => {
    const token = localStorage.getItem("access");

    if (!token) {
      setError("Please login to view your orders.");
      setLoading(false);
      return;
    }

    try {
      const response = await api.get(
        "/orders/my-orders/"
      );

      setOrders(response.data);
    } catch (error) {
      console.error("Fetch orders error:", error);

      setError(
        error.response?.data?.detail ||
          "Unable to load orders."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <h3>Loading orders...</h3>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger">
          {error}
        </div>

        <Link
          to="/login"
          className="btn btn-primary"
        >
          Login
        </Link>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <h1 className="mb-4 text-center">
        📦 My Orders
      </h1>

      {orders.length === 0 ? (
        <div className="text-center py-5">
          <h3>No orders found</h3>

          <Link
            to="/"
            className="btn btn-primary mt-3"
          >
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="row g-4">
          {orders.map((order) => (
            <div
              className="col-12"
              key={order.id}
            >
              <div className="card shadow-sm">
                <div className="card-header d-flex justify-content-between align-items-center">
                  <strong>
                    Order #{order.id}
                  </strong>

                  <span className="badge bg-primary">
                    {order.status}
                  </span>
                </div>

                <div className="card-body">
                  <div className="table-responsive">
                    <table className="table table-bordered">
                      <thead>
                        <tr>
                          <th>Product</th>
                          <th>Price</th>
                          <th>Quantity</th>
                          <th>Subtotal</th>
                        </tr>
                      </thead>

                      <tbody>
                        {order.items.map((item) => (
                          <tr key={item.id}>
                            <td>
                              {item.product_name}
                            </td>

                            <td>
                              ₹{item.price}
                            </td>

                            <td>
                              {item.quantity}
                            </td>

                            <td>
                              ₹{item.subtotal}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="text-end">
                    <h4>
                      Total: ₹{order.total_amount}
                    </h4>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Orders;