import React, { useState } from "react";
import axios from "axios";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

const Register = () => {
  const [showpassword, setshowpassword] = useState(false);
  const [loading, setloading] = useState(false);

  const [username, setusername] = useState("");
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");

  const navigate = useNavigate();

  const handlesubmit = async (e) => {
    e.preventDefault();

    if (!username || !email || !password) {
      toast.error("All fields are required");
      return;
    }

    setloading(true);

    try {
      const { data } = await axios.post(
        "http://localhost:3455/api/user/register",
        { username, email, password },
        {
          withCredentials: true,
        }
      );
      console.log(data)

      toast.success("User Created Successfully");

      navigate("/verify");
    } catch (error) {
      console.log(error.response || error);

      toast.error(
        error?.response?.data?.message || "Something went wrong"
      );
    } finally {
      setloading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-500">
      <div className="w-full max-w-md p-8 rounded-2xl backdrop-blur-lg bg-white/10 border border-white/20 shadow-2xl text-white">
        
        <h1 className="text-3xl font-bold text-center mb-6 tracking-wide">
          Create Account
        </h1>

        <form className="space-y-5" onSubmit={handlesubmit}>
          
          <div>
            <label className="text-sm opacity-80">Username</label>
            <input
              type="text"
              placeholder="Enter your name"
              className="w-full mt-1 px-4 py-2 rounded-lg bg-white/20 border border-white/30 placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white"
              value={username}
              onChange={(e) => setusername(e.target.value)}
              disabled={loading}
            />
          </div>

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
            <label className="text-sm opacity-80">Password</label>
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
            {loading ? "Creating..." : "Create Account"}
          </button>
        </form>

      </div>
    </div>
  );
};

export default Register;