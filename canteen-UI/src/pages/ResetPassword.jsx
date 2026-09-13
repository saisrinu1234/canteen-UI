
import { useState } from "react";
import {
  useNavigate,
  useSearchParams
} from "react-router-dom";

import api from "../api/axios";
import "../styles/auth.css";
import BurgerImage from "../assets/burger.png";

function ResetPassword() {

  const navigate = useNavigate();

  const [searchParams] = useSearchParams();

  // Get token from email link
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [loading, setLoading] = useState(false);


  const resetPassword = async () => {

    if (!token) {
      alert("Invalid password reset link");
      return;
    }

    if (!password || !confirmPassword) {
      alert("Please fill all fields");
      return;
    }

    if (password.length < 6) {
      alert(
        "Password must be at least 6 characters"
      );
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }


    try {

      setLoading(true);

      const res = await api.post(
        "/auth/reset-password",
        {
          token: token,
          password: password
        }
      );

      alert(
        res.data.message ||
        res.data ||
        "Password reset successfully"
      );

      navigate("/login");

    } catch (err) {

      alert(
        err.response?.data?.message ||
        err.response?.data ||
        "Unable to reset password"
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

          <h2>Reset Password</h2>

          {!token ? (

            <>
              <p className="error">
                Invalid or missing reset link.
              </p>

              <button
                onClick={() =>
                  navigate("/forgot-password")
                }
              >
                Request New Link
              </button>
            </>

          ) : (

            <>

              <input
                type="password"
                placeholder="New Password"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
              />

              <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) =>
                  setConfirmPassword(e.target.value)
                }
              />

              <button
                onClick={resetPassword}
                disabled={loading}
              >
                {loading
                  ? "Resetting..."
                  : "Reset Password"}
              </button>

            </>

          )}

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

export default ResetPassword;

