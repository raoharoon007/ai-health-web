import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import EyeCloseIcon from "../../assets/icons/ri_eye-close-line.svg?react";
import EyeShowIcon from "../../assets/icons/ri_eye-show-line.svg?react";
import api from "../../api/axiosInstance";

// Validation Schema 
const schema = yup.object({
  fullName: yup
    .string()
    .trim()
    .required('Full name is required')
    .matches(/^[A-Za-z]+( [A-Za-z]+)*$/, 'Only alphabets allowed and spaces must be between words'),
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
  confirmPassword: yup
    .string()
    .required("Please confirm your password")
    .oneOf([yup.ref("password"), null], "Passwords must match"),
}).required();

const SignupForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [apiError, setApiError] = useState("");
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: yupResolver(schema), mode: "onChange" });

  const onSubmit = async (data) => {
    setApiError("");

    try {
      const response = await api.post("/auth/sign-up", {
        full_name: data.fullName,
        email: data.email,
        password: data.password,
        confirm_password: data.confirmPassword
      });

      navigate("/verifyotp", {
        state: { email: data.email, from: "signup" },
      });
    } catch (error) {
      const message = error.response?.data?.detail || "Signup failed. Please try again.";
      setApiError(message);
    }
  };
  return (
    <div className="bg-white flex flex-col w-full max-w-115 rounded-3xl justify-center items-center border border-bordercolor p-6 gap-3 2xl:gap-6 shadow-[0_4px_40px_0_rgba(235,235,235,0.8)] mx-4">

      <div className="flex flex-col justify-center items-center gap-2 2xl:gap-3">
        <h1 className="text-center font-semibold text-2xl sm:text-[28px] text-primarytext [text-box-trim:trim-both] [text-box-edge:cap_alphabetic]">
          Create Your Account
        </h1>
        <p className="text-center text-base text-secondarytext font-normal self-stretch max-w-115">
          Set up your account to access safe, informational health support anytime.
        </p>
      </div>



      <form onSubmit={handleSubmit(onSubmit)} className="w-full flex flex-col gap-2 2xl:gap-4">
        {/* Full Name */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-normal text-primarytext ml-1">Full Name</label>
          <input
            {...register("fullName")}
            type="text"
            placeholder="Enter Your Full Name"
            className={`w-full rounded-xl border font-normal text-primarytext placeholder:text-mutedtext focus:placeholder-transparent outline-none px-4 py-3 text-sm transition-all ${errors.fullName ? "border-warning" : "border-bordercolor focus:border-primary hover:border-primary"
              }`}
          />
          {errors.fullName && <span className="text-warning text-xs ml-1">{errors.fullName.message}</span>}
        </div>

        {/* Email */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-normal text-primarytext ml-1">Email</label>
          <input
            {...register("email")}
            type="email"
            placeholder="Enter Your Email"
            className={`w-full rounded-xl border font-normal text-primarytext placeholder:text-mutedtext focus:placeholder-transparent outline-none px-4 py-3 text-sm transition-all ${errors.email ? "border-warning" : "border-bordercolor focus:border-primary hover:border-primary"
              }`}
          />
          {errors.email && <span className="text-warning text-xs ml-1">{errors.email.message}</span>}
        </div>

        {/* Password */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-normal text-primarytext ml-1">Password</label>
          <div className="relative">
            <input
              {...register("password")}
              type={showPassword ? "text" : "password"}
              placeholder="Enter Your Password"
              className={`w-full rounded-xl font-normal text-primarytext placeholder:text-mutedtext border focus:placeholder-transparent outline-none px-4 py-3 pr-12 text-sm transition-all ${errors.password ? "border-warning" : "border-bordercolor focus:border-primary hover:border-primary"
                }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 inset-y-0 flex items-center cursor-pointer opacity-70 hover:opacity-100 transition"
            >
              {showPassword ? <EyeShowIcon /> : <EyeCloseIcon />}
            </button>
          </div>
          {errors.password && <span className="text-warning text-xs ml-1">{errors.password.message}</span>}
        </div>

        {/* Confirm Password */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-normal text-primarytext ml-1">Confirm Password</label>
          <div className="relative">
            <input
              {...register("confirmPassword")}
              type={showConfirm ? "text" : "password"}
              placeholder="Renter Your Password"
              className={`w-full rounded-xl font-normal text-primarytext placeholder:text-mutedtext border focus:placeholder-transparent outline-none px-4 py-3 pr-12 text-sm transition-all ${errors.confirmPassword ? "border-warning" : "border-bordercolor focus:border-primary hover:border-primary"
                }`}
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-4 inset-y-0 flex items-center cursor-pointer opacity-70 hover:opacity-100 transition"
            >
              {showConfirm ? <EyeShowIcon /> : <EyeCloseIcon />}
            </button>
          </div>
          {errors.confirmPassword && <span className="text-warning text-xs ml-1">{errors.confirmPassword.message}</span>}
        </div>

        <button
          type="submit"
          disabled={isSubmitting} // Request ke waqt button disable ho jayega
          className="w-full text-center bg-primary hover:bg-hoverbtn text-white rounded-full py-3.5 font-semibold shadow-lg shadow-primary/10 cursor-pointer transition mt-2 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Creating Account..." : "Sign Up"}
        </button>
      </form>
      {apiError && (
        <div className="w-full bg-warning/10 border border-warning/20 text-warning text-xs py-2.5 px-4 rounded-xl text-center font-medium italic">
          {apiError}
        </div>
      )}

      <p className="text-center font-normal text-sm text-secondarytext">
        Already have an account?
        <Link to="/login" className="text-primary font-normal text-sm ml-1">
          Login
        </Link>
      </p>
    </div>
  );
};

export default SignupForm;