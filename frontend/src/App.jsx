import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useEffect, useState } from "react";
import api from "./api/axios";

import Login from "./pages/Login";
import Cart from "./pages/Cart";
import Orders from "./pages/Orders";
import Layout from "./components/Layout";
import AdminDashboard from "./pages/AdminDashboard";
import AddProduct from "./pages/AddProduct";
import EditProduct from "./pages/EditProduct";
import AdminOrders from "./pages/AdminOrders";
import AdminRoute from "./components/AdminRoute";
import Register from "./pages/Register";
import AdminLayout from "./components/AdminLayout";

function Home({ isLoggedIn }) {
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const isAdmin = localStorage.getItem("isAdmin") === "true";

  
  useEffect(() => {
    api
      .get("/products/products/")
      .then((response) => {
        setProducts(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  }, []);

  

  const addToCart = async (productId) => {
    if (!isLoggedIn) {
      alert("Please login first.");
      return;
    }

    

    try {
      await api.post(
  "/cart/items/",
  {
    product: productId,
    quantity: 1,
  }
);

      alert("Product added to cart!");
    } catch (error) {
      console.error("Add to cart error:", error);

      if (error.response?.status === 401) {
        alert("Your session has expired. Please login again.");
      } else {
        alert(
          error.response?.data?.detail ||
            "Unable to add product to cart."
        );
      }
    }
  };

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <h3>Loading products...</h3>
      </div>
    );
  }

  return (
    <main className="container py-5">
      <h1 className="mb-4 text-center">
        Our Products
      </h1>

      <div className="row g-4">
        {products.map((product) => (
          <div
            className="col-md-6 col-lg-4"
            key={product.id}
          >
            <div className="card h-100 shadow-sm">
              {product.image ? (
                <img
                  src={product.image}
                  className="card-img-top"
                  alt={product.name}
                  style={{
                    height: "250px",
                    objectFit: "cover",
                  }}
                />
              ) : (
                <div
                  className="bg-light d-flex align-items-center justify-content-center"
                  style={{ height: "250px" }}
                >
                  No image
                </div>
              )}

              <div className="card-body d-flex flex-column">
                <h5 className="card-title">
                  {product.name}
                </h5>

                <p className="text-muted">
                  {product.description}
                </p>

                <h4>
                  ₹{product.price}
                </h4>

                <p className="text-success">
                  Stock: {product.stock}
                </p>

                {!isAdmin && (
  <button
    className="btn btn-primary mt-auto"
    disabled={
      product.stock === 0 ||
      !product.is_active
    }
    onClick={() => addToCart(product.id)}
  >
    {!product.is_active
      ? "Unavailable"
      : "Add to Cart"}
  </button>
)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("access")
  );

  return (
    <BrowserRouter>
      <Routes>
        <Route
          element={
            <Layout
              isLoggedIn={isLoggedIn}
              setIsLoggedIn={setIsLoggedIn}
            />
          }
        >
          <Route
            path="/"
            element={<Home isLoggedIn={isLoggedIn} />}
          />

          <Route
            path="/cart"
            element={<Cart />}
          />

          <Route
            path="/orders"
            element={<Orders />}
          />
        </Route>

        <Route
          path="/login"
          element={
            <Login
              setIsLoggedIn={setIsLoggedIn}
            />
          }
        />
        <Route
  path="/register"
  element={<Register />}
/>
        <Route element={<AdminRoute />}>
  <Route element={<AdminLayout />}>
    <Route
      path="/admin"
      element={<AdminDashboard />}
    />

    <Route
      path="/admin/products/add"
      element={<AddProduct />}
    />

    <Route
      path="/admin/products/edit/:id"
      element={<EditProduct />}
    />

    <Route
      path="/admin/orders"
      element={<AdminOrders />}
    />
  </Route>
</Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;