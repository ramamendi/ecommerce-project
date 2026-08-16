import { useEffect, useState } from "react";
import api from "../api/axios";
import { Link } from "react-router-dom";

function Cart() {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const getToken = () => localStorage.getItem("access");

  // Fetch cart
  const fetchCart = async () => {
    const token = getToken();

    if (!token) {
      setError("Please login to view your cart.");
      setLoading(false);
      return;
    }

    try {
      const response = await api.get("/cart/");

      setCart(response.data);
    } catch (error) {
      console.error("Fetch cart error:", error);

      setError(
        error.response?.data?.detail ||
          "Unable to load cart."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  // Update quantity
  const updateQuantity = async (itemId, quantity) => {
    if (quantity < 1) {
      return;
    }

    try {
      await api.patch(
        `/cart/items/${itemId}/`,
        {
          quantity: quantity,
        }
      );

      fetchCart();
    } catch (error) {
      console.error(
        "Update quantity error:",
        error
      );

      alert(
        error.response?.data?.detail ||
          "Unable to update quantity."
      );
    }
  };

  // Remove item
  const removeItem = async (itemId) => {
    try {
      await api.delete(
        `/cart/items/${itemId}/delete/`
      );

      fetchCart();
    } catch (error) {
      console.error(
        "Remove item error:",
        error
      );

      alert(
        error.response?.data?.detail ||
          "Unable to remove item."
      );
    }
  };

  // Checkout
  const checkout = async () => {
    const token = getToken();

    if (!token) {
      alert("Please login first.");
      return;
    }

    try {
      const response = await api.post(
        "/orders/checkout/",
        {}
      );

      alert(
        `Order #${response.data.id} placed successfully!`
      );

      fetchCart();
    } catch (error) {
      console.error(
        "Checkout error:",
        error
      );

      alert(
        error.response?.data?.detail ||
          "Checkout failed."
      );
    }
  };

  // Loading
  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <h3>Loading cart...</h3>
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
        🛒 Your Cart
      </h1>

      {!cart || cart.items.length === 0 ? (
        <div className="text-center py-5">
          <h3>Your cart is empty</h3>

          <Link
            to="/"
            className="btn btn-primary mt-3"
          >
            Continue Shopping
          </Link>
        </div>
      ) : (
        <>
          <div className="table-responsive">
            <table className="table table-bordered align-middle">
              <thead className="table-dark">
                <tr>
                  <th>Product</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Subtotal</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {cart.items.map((item) => (
                  <tr key={item.id}>
                    <td>
                      {item.product_name}
                    </td>

                    <td>
                      ₹{item.product_price}
                    </td>

                    <td>
                      <div className="d-flex align-items-center gap-2">
                        <button
                          className="btn btn-sm btn-outline-secondary"
                          onClick={() =>
                            updateQuantity(
                              item.id,
                              item.quantity - 1
                            )
                          }
                          disabled={
                            item.quantity <= 1
                          }
                        >
                          −
                        </button>

                        <span className="fw-bold">
                          {item.quantity}
                        </span>

                        <button
                          className="btn btn-sm btn-outline-secondary"
                          onClick={() =>
                            updateQuantity(
                              item.id,
                              item.quantity + 1
                            )
                          }
                        >
                          +
                        </button>
                      </div>
                    </td>

                    <td>
                      ₹{item.subtotal}
                    </td>

                    <td>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() =>
                          removeItem(item.id)
                        }
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="text-end mt-4">
            <h3>
              Total: ₹{cart.total}
            </h3>

            <button
              className="btn btn-success btn-lg mt-2"
              onClick={checkout}
            >
              Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default Cart;