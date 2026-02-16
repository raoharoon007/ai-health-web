import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import EyeCloseIcon from "../../assets/icons/ri_eye-close-line.svg?react";
import EyeShowIcon from "../../assets/icons/ri_eye-show-line.svg?react";
import api from "../../api/axiosInstance";
import { setAuthToken } from "../../utils/auth";

const schema = yup.object({
  email: yup
    .string()
    .required('Email is required')
    .matches(
      /^(?!.*\.\.)(?!\.)(?!.*\.$)([a-zA-Z0-9._%+-]*[a-zA-Z0-9%+-])@(?!(?:-))[A-Za-z0-9-]+(?<!-)(\.[A-Za-z]{2,})+$/,
      'Enter a valid email address'
    ),
  password: yup
    .string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/,
      "Password must contain at least 1 uppercase, 1 lowercase, 1 number, and 1 special character"
    ),
  rememberMe: yup.boolean(),
}).required();

const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [apiError, setApiError] = useState("");
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    clearErrors 
  } = useForm({ resolver: yupResolver(schema), mode: "onChange" });

  const onSubmit = async (data) => {
    setApiError("");
    try {
      const response = await api.post("/auth/login", {
        email: data.email,
        password: data.password,
        remember_me: data.rememberMe,
      });

      const token = response.data.access_token || response.data.token;

      if (token) {
        setAuthToken(token);
        navigate("/chat");
      }
    } catch (error) {
      const errorMsg = error.response?.data?.detail || "Invalid email or password";
      setApiError(errorMsg);
    }
  };

  const handleInputChange = () => {
    if (apiError) setApiError(""); 
  };

  return (
    <div className="bg-white flex flex-col w-full max-w-115 rounded-3xl justify-center items-center border border-bordercolor p-6 gap-3 2xl:gap-6 shadow-[0_4px_40px_0_rgba(235,235,235,0.8)] mx-4">
      <div className="flex flex-col justify-center items-center 2xl:gap-5 gap-3">
        <h1 className="text-center font-semibold text-2xl md:text-[28px] text-primarytext">
          Welcome Back
        </h1>
        <p className="text-center text-sm md:text-base text-secondarytext font-normal">
          Continue securely to receive general health guidance and view your past interactions.
        </p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="w-full flex flex-col 2xl:gap-4 gap-2">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-normal text-primarytext ml-1">Email</label>
          <input
            {...register("email", { 
                onChange: handleInputChange 
            })}
            type="email"
            id="email"
            autoComplete="username"
            placeholder="Enter Your Email"
            className={`w-full rounded-xl border px-4 py-3 text-sm focus:outline-none outline-none transition-all placeholder:text-mutedtext ${errors.email || apiError ? "border-warning" : "border-bordercolor focus:border-primary hover:border-primary"
              }`}
          />
          {errors.email && <span className="text-warning text-[11px] font-medium ml-1 italic">{errors.email.message}</span>}
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-normal text-primarytext ml-1">Password</label>
          <div className="relative">
            <input
              {...register("password", { 
                  onChange: handleInputChange 
              })}
              type={showPassword ? "text" : "password"}
              id="password"
              autoComplete="current-password"
              placeholder="Enter Your Password"
              className={`w-full rounded-xl border px-4 py-3 pr-12 text-sm focus:outline-none outline-none transition-all placeholder:text-mutedtext ${errors.password || apiError ? "border-warning" : "border-bordercolor focus:border-primary hover:border-primary"
                }`}
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 inset-y-0 flex items-center cursor-pointer opacity-70 hover:opacity-100 transition">
              {showPassword ? <EyeShowIcon /> : <EyeCloseIcon />}
            </button>
          </div>
          {errors.password && <span className="text-warning text-[11px] font-medium ml-1 italic">{errors.password.message}</span>}
        </div>

        <div className="flex items-center justify-between text-xs md:text-sm mt-1">
          <label className="flex items-center gap-1 xs:gap-2 text-secondarytext cursor-pointer group">
            <input
              {...register("rememberMe")}
              type="checkbox"
              className="accent-primary size-3 xs:size-4 cursor-pointer"
            />
            <span className="text-xs xs:text-sm font-normal text-secondarytext">Remember me</span>
          </label>
          <Link to="/forgotpassword" className="text-primary font-normal tex-xs xs:text-sm ">Forgot Password?</Link>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-primary hover:bg-hoverbtn text-white rounded-full py-3 text-base font-semibold cursor-pointer mt-2 transition active:scale-[0.98] disabled:opacity-70"
        >
          {isSubmitting ? "Logging in..." : "Login"}
        </button>
      </form>

      {apiError && (
        <div className="w-full bg-warning/10 border border-warning/20 text-warning text-xs py-2.5 px-4 rounded-xl text-center font-medium italic">
          {apiError}
        </div>
      )}

      <p className="text-center font-normal text-xs xs:text-sm text-secondarytext">
        Don’t have an account? <Link to="/signup" className="text-primary font-normal ml-1 cursor-pointer">Create One</Link>
      </p>
    </div>
  );
};

export default LoginForm;