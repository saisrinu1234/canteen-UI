import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import "../styles/auth.css";
import { AuthContext } from "../context/AuthContext";

function Login() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const { setAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ✅ Validation function
  const validate = () => {
    let newErrors = {};

    const emailRegex = /\S+@\S+\.\S+/;

    if (!form.email) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(form.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!form.password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ❌ stop if validation fails
    if (!validate()) return;

    try {
      const res = await api.post("/auth/login", form);

      const token = res.data.token;
      const role = res.data.role;

      localStorage.setItem("accessToken", token);
      localStorage.setItem("role", role);
      localStorage.setItem("usermail", form.email);

      setAuthenticated(true);

      if (role === "ROLE_ADMIN" || role === "ADMIN") {
        navigate("/admindashboard");
      } else {
        navigate("/dashboard");
      }

    } catch (error) {
      alert(error.response?.data || "Login failed");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Login</h2>

        <form onSubmit={handleSubmit}>
          <input
            name="email"
            placeholder="Email"
            onChange={handleChange}
          />
          {errors.email && <p className="error" style={{textAlign:"left"}}>{errors.email}</p>}

          <input
            name="password"
            type="password"
            placeholder="Password"
            onChange={handleChange}
          />
          {errors.password && <p className="error" style={{textAlign:"left"}}>{errors.password}</p>}

          <button type="submit">Login</button>
        </form>

        <div className="auth-link">
          <span onClick={() => navigate("/register")}>
            Don't have an account? Register
          </span>
        </div>
      </div>
    </div>
  );
}

export default Login;