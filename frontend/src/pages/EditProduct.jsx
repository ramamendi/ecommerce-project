import { useEffect, useState } from "react";
import api from "../api/axios";
import { Link, useNavigate, useParams } from "react-router-dom";


function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [image, setImage] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Load product
  useEffect(() => {
    const fetchProduct = async () => {
      const token = localStorage.getItem("access");

      try {
        const response = await api.get(`/products/products/${id}/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const product = response.data;

setName(product.name);
setDescription(product.description);
setCategory(String(product.category));
setPrice(product.price);
setStock(product.stock);
setIsActive(product.is_active);
      } catch (error) {
        console.error(error);

        setError(
          error.response?.data?.detail ||
            "Unable to load product."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // Load categories
  useEffect(() => {
    const fetchCategories = async () => {
      const token = localStorage.getItem("access");

      try {
        const response = await api.get("/products/categories/",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setCategories(response.data);
      } catch (error) {
        console.error(error);
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

    setSaving(true);
    setError("");

    try {
      const formData = new FormData();

      formData.append("name", name);
      formData.append("description", description);
      formData.append("category", category);
      formData.append("price", price);
      formData.append("stock", stock);
      formData.append(
        "is_active",
        isActive ? "true" : "false"
      );

      if (image) {
        formData.append("image", image);
      }

     await api.put(
  `/products/products/${id}/`,
  formData,
  {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  }
);
      alert("Product updated successfully!");

      navigate("/admin");
    } catch (error) {
      console.error("Update product error:", error);

      if (error.response?.status === 403) {
        setError(
          "Only administrators can update products."
        );
      } else {
        setError(
          error.response?.data?.detail ||
            "Unable to update product."
        );
      }
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <h3>Loading product...</h3>
      </div>
    );
  }

  if (error && !name) {
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
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">

          <div className="card shadow-sm">
            <div className="card-header bg-dark text-white">
              <h3 className="mb-0">
                Edit Product #{id}
              </h3>
            </div>

            <div className="card-body">

              {error && (
                <div className="alert alert-danger">
                  {error}
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

                <div className="form-check mb-3">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="isActive"
                    checked={isActive}
                    onChange={(e) =>
                      setIsActive(e.target.checked)
                    }
                  />

                  <label
                    className="form-check-label"
                    htmlFor="isActive"
                  >
                    Product Active
                  </label>
                </div>

                <div className="mb-4">
                  <label className="form-label">
                    New Product Image
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
                    disabled={saving}
                  >
                    {saving
                      ? "Updating..."
                      : "Update Product"}
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

export default EditProduct;