import { useState } from "react";
import api from "../api/axios";
import { Link, useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      await api.post("/users/register/", {
        username,
        email,
        password,
      });

      setMessage(
        "Registration successful! Please login."
      );

      setTimeout(() => {
        navigate("/login");
      }, 1000);
    } catch (error) {
      console.error(
        "Registration error:",
        error
      );

      const data = error.response?.data;

      if (data) {
        if (typeof data === "object") {
          const messages = Object.entries(data)
            .map(([field, errors]) => {
              const text = Array.isArray(errors)
                ? errors.join(" ")
                : errors;

              return `${field}: ${text}`;
            })
            .join(" ");

          setError(messages);
        } else {
          setError(String(data));
        }
      } else {
        setError(
          "Unable to register. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="container mt-5"
      style={{ maxWidth: "450px" }}
    >
      <div className="card shadow-sm">
        <div className="card-body">
          <h2 className="mb-4 text-center">
            Create Account
          </h2>

          {message && (
            <div className="alert alert-success">
              {message}
            </div>
          )}

          {error && (
            <div className="alert alert-danger">
              {error}
            </div>
          )}

          <form onSubmit={handleRegister}>
            <div className="mb-3">
              <label className="form-label">
                Username
              </label>

              <input
                type="text"
                className="form-control"
                value={username}
                onChange={(e) =>
                  setUsername(e.target.value)
                }
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">
                Email
              </label>

              <input
                type="email"
                className="form-control"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">
                Password
              </label>

              <input
                type="password"
                className="form-control"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                minLength={8}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">
                Confirm Password
              </label>

              <input
                type="password"
                className="form-control"
                value={confirmPassword}
                onChange={(e) =>
                  setConfirmPassword(
                    e.target.value
                  )
                }
                minLength={8}
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary w-100"
              disabled={loading}
            >
              {loading
                ? "Creating Account..."
                : "Register"}
            </button>
          </form>

          <div className="text-center mt-3">
            Already have an account?{" "}
            <Link to="/login">
              Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;