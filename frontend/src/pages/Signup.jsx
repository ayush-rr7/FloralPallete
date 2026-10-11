import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
// import api from "../api/axios";

function Register() {
  const { signup } = useAuth();
  const navigate = useNavigate();

  const [errors, setErrors] = useState([]);
  const [isCreatingAccount, setIsCreatingAccount] = useState(false);

  // OTP functionality can be enabled later
  // const [step, setStep] = useState(1);
  // const [timer, setTimer] = useState(30);
  // const [canResend, setCanResend] = useState(false);
  // const [isSendingOtp, setIsSendingOtp] = useState(false);
  // const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    city: "",
    email: "",
    contact: "",
    password: "",
    confirmPassword: "",
    // role: "customer",
    // otp: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);

    // Client-side password validation
    if (formData.password !== formData.confirmPassword) {
      setErrors([{ msg: "Passwords do not match." }]);
      return;
    }

    if (formData.password.length < 6) {
      setErrors([
        { msg: "Password must be at least 6 characters long." },
      ]);
      return;
    }

    setIsCreatingAccount(true);

    try {
      await signup({
        name: formData.name,
        city: formData.city,
        email: formData.email,
        contact: formData.contact,
        password: formData.password,
        // role: formData.role,

        // When OTP is implemented later:
        // token: localStorage.getItem("verifyToken"),
      });

      navigate("/login");
    } catch (err) {
      console.log(err.response?.data);

      if (err.response?.data?.errors) {
        setErrors(err.response.data.errors);
      } else {
        setErrors([
          {
            msg:
              err.response?.data?.message ||
              "Unable to create account. Please try again.",
          },
        ]);
      }
    } finally {
      setIsCreatingAccount(false);
    }
  };

  /*
  ============================================================
  OTP FUNCTIONALITY - ENABLE LATER
  ============================================================

  1. Import axios API

  import api from "../api/axios";

  2. Add these states

  const [step, setStep] = useState(1);
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);

  3. Add otp to formData

  otp: "",

  4. Add timer useEffect

  useEffect(() => {
    let interval;

    if (step === 2 && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }

    if (timer === 0) {
      setCanResend(true);
    }

    return () => clearInterval(interval);
  }, [step, timer]);

  5. Send OTP

  const handleStart = async (e) => {
    e.preventDefault();
    setErrors([]);
    setIsSendingOtp(true);

    try {
      await api.post("/auth/sendOtp", {
        email: formData.email,
      });

      setStep(2);
      setTimer(30);
      setCanResend(false);
    } catch (err) {
      setErrors([
        {
          msg:
            err.response?.data?.message ||
            "Unable to send OTP. Please try again.",
        },
      ]);
    } finally {
      setIsSendingOtp(false);
    }
  };

  6. Verify OTP

  const handleVerify = async (e) => {
    e.preventDefault();
    setErrors([]);
    setIsVerifyingOtp(true);

    try {
      const res = await api.post("/auth/verifyOtp", {
        email: formData.email,
        otp: formData.otp,
      });

      localStorage.setItem("verifyToken", res.data.token);

      setStep(3);
    } catch (err) {
      setErrors([
        {
          msg:
            err.response?.data?.message ||
            "Invalid OTP. Please try again.",
        },
      ]);
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  7. Resend OTP

  const handleResendOtp = async () => {
    setErrors([]);
    setIsSendingOtp(true);

    try {
      await api.post("/auth/sendOtp", {
        email: formData.email,
      });

      setTimer(30);
      setCanResend(false);
    } catch (err) {
      setErrors([
        {
          msg:
            err.response?.data?.message ||
            "Unable to resend OTP. Please try again.",
        },
      ]);
    } finally {
      setIsSendingOtp(false);
    }
  };

  ============================================================
  */

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-rose-100 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-md p-6">

        {/* Title */}
        <h1 className="text-2xl font-semibold text-center text-gray-800 mb-2">
          Anil Flower Shop
        </h1>

        <p className="text-center text-sm text-gray-500 mb-6">
          Create your account to explore our flowers and services
        </p>

        {/* Progress Bar */}
        <div className="flex items-center mb-6">
          <div className="flex-1 h-1 bg-pink-500" />
          <div className="flex-1 h-1 bg-gray-200" />
          <div className="flex-1 h-1 bg-gray-200" />
        </div>

        {/* Errors */}
        {errors.length > 0 && (
          <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-3">
            {errors.map((err, index) => (
              <p key={index} className="text-red-600 text-sm">
                {err.msg}
              </p>
            ))}
          </div>
        )}

        {/* =========================
            SIGNUP FORM
        ========================== */}
        <form onSubmit={handleSubmit} className="space-y-4">

          <h2 className="text-lg font-medium text-gray-700">
            Create Account
          </h2>

          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>

            <input
              type="text"
              name="name"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-400"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>

            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              // required
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-400"
            />
          </div>

          {/* Contact */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Contact Number
            </label>

            <input
              type="tel"
              name="contact"
              placeholder="Enter your contact number"
              value={formData.contact}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-400"
            />
          </div>

          {/* City */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              City
            </label>

            <input
              type="text"
              name="city"
              placeholder="Enter your city"
              value={formData.city}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-400"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>

            <input
              type="password"
              name="password"
              placeholder="Create a password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength={6}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-400"
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirm Password
            </label>

            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              minLength={6}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-400"
            />
          </div>

          {/* Account Type
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">
              Account Type
            </p>

            <div className="flex gap-6">

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="role"
                  value="customer"
                  checked={formData.role === "customer"}
                  onChange={handleChange}
                />

                <span>Customer</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="role"
                  value="owner"
                  checked={formData.role === "owner"}
                  onChange={handleChange}
                />

                <span>Shop Owner</span>
              </label>

            </div>
          </div> */}
          {/* Account Type */}
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">
              Account Type
            </p>

            <div className="flex items-center gap-2">
              <span className="w-4 h-4 rounded-full border-4 border-pink-500"></span>
              <span className="text-gray-700">Customer</span>
            </div>
          </div>

          {/* Terms */}
          <div className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              required
              className="accent-pink-500"
            />

            <span className="text-gray-600">
              I agree to the terms and conditions
            </span>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isCreatingAccount}
            className="w-full bg-pink-500 hover:bg-pink-600 disabled:bg-pink-300 disabled:cursor-not-allowed text-white py-3 rounded-lg transition flex items-center justify-center gap-2"
          >
            {isCreatingAccount && (
              <span className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
            )}

            {isCreatingAccount
              ? "Creating Account..."
              : "Create Account"}
          </button>

        </form>

        {/* Login Link */}
        <p className="text-center text-sm text-gray-500 mt-5">
          Already have an account?{" "}
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="text-pink-600 hover:text-pink-700 font-medium"
          >
            Login
          </button>
        </p>

      </div>
    </div>
  );
}

export default Register;

