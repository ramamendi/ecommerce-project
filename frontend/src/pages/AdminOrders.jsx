import { useEffect, useState } from "react";
import api from "../api/axios";
import { Link } from "react-router-dom";

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Load all orders
  const fetchOrders = async () => {
    try {
      const response = await api.get("/orders/admin/");

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

  // Update order status
  const updateOrderStatus = async (
    orderId,
    newStatus
  ) => {
    try {
      const response = await api.patch(
        `/orders/admin/${orderId}/status/`,
        {
          status: newStatus,
        }
      );

      setOrders((currentOrders) =>
        currentOrders.map((order) =>
          order.id === orderId
            ? response.data
            : order
        )
      );

      alert(
        "Order status updated successfully!"
      );
    } catch (error) {
      console.error(
        "Order status update error:",
        error
      );

      alert(
        error.response?.data?.detail ||
          "Unable to update order status."
      );
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Loading
  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <h3>Loading orders...</h3>
      </div>
    );
  }

  // Error
  if (error) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger">
          {error}
        </div>

        <Link
          to="/admin"
          className="btn btn-secondary"
        >
          Back to Admin
        </Link>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>📦 All Orders</h1>

        <Link
          to="/admin"
          className="btn btn-secondary"
        >
          Back to Products
        </Link>
      </div>

      {orders.length === 0 ? (
        <div className="alert alert-info">
          No orders found.
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

                  <select
                    className="form-select form-select-sm"
                    style={{ width: "150px" }}
                    value={order.status}
                    onChange={(e) =>
                      updateOrderStatus(
                        order.id,
                        e.target.value
                      )
                    }
                  >
                    <option value="PENDING">
                      Pending
                    </option>

                    <option value="CONFIRMED">
                      Confirmed
                    </option>

                    <option value="SHIPPED">
                      Shipped
                    </option>

                    <option value="DELIVERED">
                      Delivered
                    </option>

                    <option value="CANCELLED">
                      Cancelled
                    </option>
                  </select>
                </div>

                <div className="card-body">

                  <p>
                    <strong>Customer:</strong>{" "}
                    {order.user}
                  </p>

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
                      Total: ₹
                      {order.total_amount}
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

export default AdminOrders;