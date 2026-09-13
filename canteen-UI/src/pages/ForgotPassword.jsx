
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../api/axios";
import "../styles/auth.css";
import BurgerImage from "../assets/burger.png";

function ForgotPassword() {

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const sendResetLink = async () => {

    if (!email.trim()) {
      alert("Please enter your email");
      return;
    }

    try {

      setLoading(true);

      const res = await api.post(
        "/auth/forgot-password",
        {
          email: email.trim()
        }
      );

      alert(
        res.data.message ||
        res.data ||
        "Password reset link sent to your email"
      );

    } catch (err) {

      alert(
        err.response?.data?.message ||
        err.response?.data ||
        "Unable to send reset link"
      );

    } finally {

      setLoading(false);
    }
  };


  return (
    <div className="auth-container">

      <div className="login-container">

        <img
          src={BurgerImage}
          alt="Burger"
        />

        <div className="auth-card">

          <h2>Forgot Password</h2>

          <p>
            Enter your registered email address.
            We will send you a password reset link.
          </p>

          <input
            type="email"
            placeholder="Enter Email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
          />

          <button
            onClick={sendResetLink}
            disabled={loading}
          >
            {loading
              ? "Sending..."
              : "Send Reset Link"}
          </button>

          <div className="auth-link">

            <span
              onClick={() => navigate("/login")}
            >
              Back to Login
            </span>

          </div>

        </div>
      </div>

    </div>
  );
}

export default ForgotPassword;

