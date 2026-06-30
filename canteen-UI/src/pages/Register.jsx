import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import "../styles/auth.css";

function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ✅ Validation function
  const validate = () => {
    let newErrors = {};

    // Name
    if (!form.name.trim()) {
      newErrors.name = "Name is required";
    }

    // Email
    const emailRegex = /\S+@\S+\.\S+/;
    if (!form.email) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(form.email)) {
      newErrors.email = "Invalid email format";
    }

    // Phone (10 digits)
    const phoneRegex = /^[0-9]{10}$/;
    if (!form.phone) {
      newErrors.phone = "Phone is required";
    } else if (!phoneRegex.test(form.phone)) {
      newErrors.phone = "Phone must be 10 digits";
    }

    // Password
    if (!form.password) {
      newErrors.password = "Password is required";
    } else if (form.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ stop if validation fails
    if (!validate()) return;

    try {
      const res = await api.post("/auth/register", form);
      console.log("Success:", res);
      alert("Register Successfully");
      navigate("/login");
    } catch (error) {
      console.log("Full error:", error);
      alert(error.response?.data || "Registration failed");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Create Account</h2>

        <form onSubmit={handleSubmit}>
          <input
            name="name"
            placeholder="Full Name"
            onChange={handleChange}
          />
          {errors.name && <p className="error" style={{ textAlign: "left" }}>{errors.name}</p>}

          <input name="email" placeholder="Email" onChange={handleChange} />
          {errors.email && <p className="error" style={{ textAlign: "left" }}>{errors.email}</p>}

          <input name="phone" placeholder="Phone" onChange={handleChange} />
          {errors.phone && <p className="error" style={{ textAlign: "left" }}>{errors.phone}</p>}

          <input
            name="password"
            type="password"
            placeholder="Password"
            onChange={handleChange}
          />
          {errors.password && <p className="error" style={{ textAlign: "left" }}>{errors.password}</p>}

          <button type="submit">Register</button>
        </form>

        <div className="auth-link">
          <span onClick={() => navigate("/login")}>
            Already have an account? Login
          </span>
        </div>
      </div>
    </div>
  );
}

export default Register;