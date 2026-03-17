import React, { useState } from "react";
import axios from "axios";
import { Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

const Login = () => {
  const [showpassword, setshowpassword] = useState(false);
  const [loading, setloading] = useState(false);

  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");

  const navigate = useNavigate();

  const handlesubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("All fields are required");
      return;
    }

    setloading(true);

    try {
      const { data } = await axios.post(
        "http://localhost:3455/api/user/login",
        { email, password },
        {
          withCredentials: true,
        }
      );

      console.log(data);

      if (data?.token) {
        localStorage.setItem("token", data.token);
      }

      toast.success("Login Successful");
      navigate("/");
    } catch (error) {
      console.log(error.response || error);
      toast.error(
        error?.response?.data?.message || "Invalid credentials"
      );
    } finally {
      setloading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-500">
      <div className="w-full max-w-md p-8 rounded-2xl backdrop-blur-lg bg-white/10 border border-white/20 shadow-2xl text-white">
        
        <h1 className="text-3xl font-bold text-center mb-6 tracking-wide">
          Login
        </h1>

        <form className="space-y-5" onSubmit={handlesubmit}>
          
          <div>
            <label className="text-sm opacity-80">Email</label>
            <input
              type="email"
              placeholder="m@gmail.com"
              className="w-full mt-1 px-4 py-2 rounded-lg bg-white/20 border border-white/30 placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white"
              value={email}
              onChange={(e) => setemail(e.target.value)}
              disabled={loading}
            />
          </div>

<div className="relative">
  <div className="flex justify-between items-center">
    <label className="text-sm opacity-80">Password</label>
    <Link
      to="/forget-pass"
      className="text-xs text-white/80 hover:text-white hover:underline transition duration-200"
    >
      Forgot Password?
    </Link>
  </div>

  <input
    type={showpassword ? "text" : "password"}
    placeholder="••••••••"
    className="w-full mt-1 px-4 py-2 rounded-lg bg-white/20 border border-white/30 placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white pr-10"
    value={password}
    onChange={(e) => setpassword(e.target.value)}
    disabled={loading}
    />

            <button
              type="button"
              onClick={() => setshowpassword(!showpassword)}
              disabled={loading}
              className="absolute right-3 top-9 text-white/80 hover:text-white"
            >
              {showpassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 rounded-lg bg-white text-black font-semibold hover:scale-105 transition-transform duration-200 disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

      </div>
    </div>
  );
};

export default Login;