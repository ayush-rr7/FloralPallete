import { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [errors, setErrors] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);
    setIsSubmitting(true);

    try {
      await login(formData);
      navigate("/");
    } catch (err) {
      if (err.response && err.response.data.errors) {
        setErrors(err.response.data.errors);
      } else {
        setErrors([
          {
            msg:
              err.response?.data?.message ||
              "Login failed. Please try again.",
          },
        ]);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-emerald-50 flex items-center justify-center px-4 py-10">
      
      {/* Auth Card */}
      <div className="w-full max-w-md bg-white/95 backdrop-blur-sm rounded-3xl shadow-xl border border-pink-100 p-8">

        {/* Logo / Brand */}
        <div className="text-center mb-8">
          <div className="mx-auto mb-4 w-14 h-14 rounded-full bg-pink-100 flex items-center justify-center text-3xl">
            🌸
          </div>

          <h1 className="text-3xl font-bold text-gray-800">
            Anil <span className="text-pink-600">Shop</span>
          </h1>

          <p className="text-sm text-gray-500 mt-2">
            Fresh flowers, beautiful moments.
          </p>
        </div>

        {/* Heading */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800">
            Welcome back
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            Login to continue shopping and managing your orders.
          </p>
        </div>

        {/* Error Messages */}
        {errors.length > 0 && (
          <div className="mb-5 rounded-xl bg-red-50 border border-red-100 px-4 py-3">
            {errors.map((err, index) => (
              <p key={index} className="text-red-600 text-sm">
                {err.msg}
              </p>
            ))}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>

            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full border border-gray-200 rounded-xl px-4 py-3.5 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-pink-400 transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>

            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full border border-gray-200 rounded-xl px-4 py-3.5 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-pink-400 transition"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-pink-500 hover:bg-pink-600 disabled:bg-pink-300 disabled:cursor-not-allowed text-white font-semibold py-3.5 rounded-xl transition shadow-sm hover:shadow-md flex items-center justify-center gap-2"
          >
            {isSubmitting && (
              <span className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
            )}

            {isSubmitting ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-xs text-gray-400">OR</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        {/* Signup */}
        <p className="text-center text-sm text-gray-500">
          New to FloralPallete?{" "}
          <Link
            to="/signup"
            className="text-pink-600 font-semibold hover:text-pink-700 hover:underline"
          >
            Create an account
          </Link>
        </p>

        {/* Small Footer */}
        <p className="text-center text-xs text-gray-400 mt-6">
          Shop flowers & services for every special occasion 🌷
        </p>

      </div>
    </div>
  );
}

export default Login;
