import { useState } from "react";

import api from "../api/axios";
import {
  Link,
  useNavigate,
} from "react-router-dom";

function Login({ setIsLoggedIn }) {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = async (e) => {
  e.preventDefault();

  try {
    // 1. Login
    const response = await api.post("/users/login/", {
      username,
      password,
    });

    const accessToken = response.data.access;
    const refreshToken = response.data.refresh;

    // 2. Save tokens
    localStorage.setItem("access", accessToken);
    localStorage.setItem("refresh", refreshToken);

    // 3. Get user profile
    const profileResponse = await api.get(
      "/users/profile/"
    );

    // 4. Save admin status
    const isAdmin =
      profileResponse.data.role === "ADMIN";

    localStorage.setItem(
      "isAdmin",
      String(isAdmin)
    );

    // 5. Update login state
    setIsLoggedIn(true);

    setMessage("Login successful!");

    // 6. Go to home
    if (isAdmin) {
  navigate("/admin");
} else {
  navigate("/");
}
  } catch (error) {
    console.error("Login error:", error);

    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    localStorage.removeItem("isAdmin");

    setMessage(
      error.response?.data?.detail ||
        "Invalid username or password."
    );
  }
};

  return (
    <div className="container mt-5" style={{ maxWidth: "450px" }}>
      <h2 className="mb-4">Login</h2>

      <form onSubmit={handleLogin}>
        <div className="mb-3">
          <label className="form-label">Username</label>

          <input
            type="text"
            className="form-control"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Password</label>

          <input
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button className="btn btn-primary w-100">
          Login
        </button>
        <div className="text-center mt-3">
  Don't have an account?{" "}
  <Link to="/register">
    Create an account
  </Link>
</div>
      </form>

      {message && (
        <div className="alert alert-info mt-3">
          {message}
        </div>
      )}
    </div>
  );
}

export default Login;