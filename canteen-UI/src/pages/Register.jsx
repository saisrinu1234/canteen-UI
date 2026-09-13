import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import "../styles/auth.css";
import BurgerImage from "../assets/burger.png";

function Register() {
  const navigate = useNavigate();

  const [step, setStep] = useState("REGISTER");

  const [loading, setLoading] = useState(false);

  const [otpLoading, setOtpLoading] = useState(false);

  const [otp, setOtp] = useState("");

  const [form, setForm] = useState({
    name: "",

    email: "",

    phone: "",

    password: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setForm({
      ...form,

      [e.target.name]: e.target.value,
    });
  };

  const validate = () => {
    let newErrors = {};

    if (!form.name.trim()) newErrors.name = "Name is required";

    const emailRegex = /\S+@\S+\.\S+/;

    if (!form.email) newErrors.email = "Email is required";
    else if (!emailRegex.test(form.email)) newErrors.email = "Invalid Email";

    const phoneRegex = /^[0-9]{10}$/;

    if (!form.phone) newErrors.phone = "Phone is required";
    else if (!phoneRegex.test(form.phone))
      newErrors.phone = "Phone must contain 10 digits";

    if (!form.password) newErrors.password = "Password is required";
    else if (form.password.length < 6)
      newErrors.password = "Minimum 6 characters";

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const sendOtp = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      setLoading(true);
      const exist = await api.get(`/auth/user/existence?email=${form.email}`);

      if (exist.data) {
        alert("Email already registered");
        return;
      }

      const res = await api.post(
        "/auth/public/send-otp",

        {
          email: form.email,
        },
      );

      alert(res.data.message);

      setStep("OTP");
    } catch (err) {
      alert(err.response?.data?.message || "Unable to send OTP");
    } finally {
      setLoading(false);
    }
  }; // ================= VERIFY OTP =================

  const verifyOtp = async () => {
    if (!otp) {
      alert("Enter OTP");

      return;
    }

    try {
      const verify = await api.post("/auth/public/verify-otp", {
        email: form.email,
        otp,
      });

      if (!verify.data.success) {
        alert(verify.data.message);
        return;
      }

      await api.post("/auth/register", form);

      alert("Registration Successful");

      navigate("/login");
    } catch (err) {
      if (err.response?.status === 403) {
        alert("Email already registered");

        navigate("/login");
      } else {
        alert(err.response?.data?.message || "Registration Failed");
      }
    } finally {
      setOtpLoading(false);
    }
  };

  // ================= RESEND OTP =================

  const resendOtp = async () => {
    try {
      await api.post(
        "/auth/public/send-otp",

        {
          email: form.email,
        },
      );

      alert("OTP Sent Again");
    } catch {
      alert("Unable to resend OTP");
    }
  };

  return (
    <div className="auth-container">
      <div className="login-container">
        <img src={BurgerImage} alt="Burger" />

        <div className="auth-card">
          {step === "REGISTER" ? (
            <>
              <h2>Create Account</h2>

              <form onSubmit={sendOtp}>
                <input
                  name="name"
                  placeholder="Full Name"
                  value={form.name}
                  onChange={handleChange}
                />

                {errors.name && <p className="error">{errors.name}</p>}

                <input
                  name="email"
                  placeholder="Email"
                  value={form.email}
                  onChange={handleChange}
                />

                {errors.email && <p className="error">{errors.email}</p>}

                <input
                  name="phone"
                  placeholder="Phone"
                  value={form.phone}
                  onChange={handleChange}
                />

                {errors.phone && <p className="error">{errors.phone}</p>}

                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={form.password}
                  onChange={handleChange}
                />

                {errors.password && <p className="error">{errors.password}</p>}

                <button type="submit" disabled={loading}>
                  {loading ? "Sending OTP..." : "Register"}
                </button>
              </form>

              <div className="auth-link">
                <span onClick={() => navigate("/login")}>
                  Already have an account? Login
                </span>
              </div>
            </>
          ) : (
            <>
              <h2>Email Verification</h2>

              <p>We've sent an OTP to</p>

              <h4>{form.email}</h4>

              <input
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />

              <button onClick={verifyOtp} disabled={otpLoading}>
                {otpLoading ? "Verifying..." : "Verify OTP"}
              </button>

              <div
                className="auth-link"
                style={{
                  marginTop: "20px",
                }}
              >
                <span onClick={resendOtp}>Resend OTP</span>

                <br />
                <br />

                <span onClick={() => setStep("REGISTER")}>← Back</span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Register;
