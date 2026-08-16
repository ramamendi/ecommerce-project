import { useEffect, useState } from "react";
import api from "../api/axios";
import { Link, useNavigate } from "react-router-dom";

function AddProduct() {
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [image, setImage] = useState(null);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Load categories
  useEffect(() => {
   const fetchCategories = async () => {
  try {
    const response = await api.get(
      "/products/categories/"
    );

    setCategories(response.data);
  } catch (error) {
    console.error("Category error:", error);
  }
};

    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("access");

    if (!token) {
      setError("Please login as an administrator.");
      return;
    }

    setLoading(true);
    setMessage("");
    setError("");

    try {
      const formData = new FormData();

      formData.append("name", name);
      formData.append("description", description);
      formData.append("category", category);
      formData.append("price", price);
      formData.append("stock", stock);
      formData.append("is_active", "true");

      if (image) {
        formData.append("image", image);
      }

      await api.post(
  "/products/products/",
  formData
);

      setMessage("Product added successfully!");

      setName("");
      setDescription("");
      setCategory("");
      setPrice("");
      setStock("");
      setImage(null);

      // Go back to admin dashboard
      setTimeout(() => {
        navigate("/admin");
      }, 1000);
    } catch (error) {
      console.error("Add product error:", error);

      if (error.response?.status === 401) {
        setError("Your session has expired. Please login again.");
      } else if (error.response?.status === 403) {
        setError("Only administrators can add products.");
      } else {
        setError(
          error.response?.data ||
            "Unable to add product."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">

          <div className="card shadow-sm">
            <div className="card-header bg-dark text-white">
              <h3 className="mb-0">
                Add Product
              </h3>
            </div>

            <div className="card-body">

              {message && (
                <div className="alert alert-success">
                  {message}
                </div>
              )}

              {error && (
                <div className="alert alert-danger">
                  {typeof error === "string"
                    ? error
                    : JSON.stringify(error)}
                </div>
              )}

              <form onSubmit={handleSubmit}>

                <div className="mb-3">
                  <label className="form-label">
                    Product Name
                  </label>

                  <input
                    type="text"
                    className="form-control"
                    value={name}
                    onChange={(e) =>
                      setName(e.target.value)
                    }
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">
                    Description
                  </label>

                  <textarea
                    className="form-control"
                    rows="3"
                    value={description}
                    onChange={(e) =>
                      setDescription(e.target.value)
                    }
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">
                    Category
                  </label>

                  <select
                    className="form-select"
                    value={category}
                    onChange={(e) =>
                      setCategory(e.target.value)
                    }
                    required
                  >
                    <option value="">
                      Select category
                    </option>

                    {categories.map((cat) => (
                      <option
                        key={cat.id}
                        value={cat.id}
                      >
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">
                      Price
                    </label>

                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      className="form-control"
                      value={price}
                      onChange={(e) =>
                        setPrice(e.target.value)
                      }
                      required
                    />
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="form-label">
                      Stock
                    </label>

                    <input
                      type="number"
                      min="0"
                      className="form-control"
                      value={stock}
                      onChange={(e) =>
                        setStock(e.target.value)
                      }
                      required
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="form-label">
                    Product Image
                  </label>

                  <input
                    type="file"
                    className="form-control"
                    accept="image/*"
                    onChange={(e) =>
                      setImage(e.target.files[0])
                    }
                  />
                </div>

                <div className="d-flex gap-2">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    {loading
                      ? "Adding..."
                      : "Add Product"}
                  </button>

                  <Link
                    to="/admin"
                    className="btn btn-secondary"
                  >
                    Cancel
                  </Link>
                </div>

              </form>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default AddProduct;