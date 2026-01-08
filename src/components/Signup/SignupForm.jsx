import { Link, useNavigate } from "react-router-dom";
import EyeCloseIcon from "../../assets/icons/ri_eye-close-line.svg?react";
import EyeShowIcon from "../../assets/icons/ri_eye-show-line.svg?react";
import { useState } from "react";

const SignupForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const navigate = useNavigate();

  return (
    // Using max-w-[460px] and same padding/gap as LoginForm
    <div className="bg-white flex flex-col w-full max-w-115 rounded-3xl justify-center items-center border border-bordercolor p-6 gap-3 2xl:gap-6 shadow-[0_4px_40px_0_rgba(235,235,235,0.8)] mx-4">
      
      {/* Header Section */}
      <div className="flex flex-col justify-center items-center gap-2 2xl:gap-3">
        <h1 className="text-center font-semibold text-2xl sm:text-[28px] text-primarytext [text-box-trim:trim-both] [text-box-edge:cap_alphabetic]">
          Create Your Account
        </h1>
        <p className="text-center text-base text-secondarytext font-normal self-stretch max-w-115">
          Set up your account to access safe, informational health support anytime.
        </p>
      </div>

      {/* Form Section - Same spacing as Login */}
      <form className="w-full flex flex-col gap-2 2xl:gap-4">
        {/* Full Name */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-normal text-primarytext ml-1">
            Full Name
          </label>
          <input
            type="text"
            placeholder="Enter your Full Name"
            className="w-full rounded-xl border font-normal text-primarytext placeholder:text-mutedtext focus:placeholder-transparent outline-none border-bordercolor px-4 py-3 text-sm focus:outline-none hover:border-primary focus:border-primary transition-all"
          />
        </div>

        {/* Email */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-normal text-primarytext ml-1">
            Email
          </label>
          <input
            type="email"
            placeholder="Enter Your Email"
            className="w-full rounded-xl border font-normal text-primarytext placeholder:text-mutedtext focus:placeholder-transparent outline-none border-bordercolor px-4 py-3 text-sm focus:outline-none hover:border-primary focus:border-primary transition-all"
          />
        </div>

        {/* Password */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-normal text-primarytext ml-1">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              className="w-full rounded-xl font-normal text-primarytext placeholder:text-mutedtext border focus:placeholder-transparent outline-none border-bordercolor px-4 py-3 pr-12 text-sm focus:outline-none hover:border-primary focus:border-primary transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 inset-y-0 flex items-center cursor-pointer opacity-70 hover:opacity-100 transition"
            >
              {showPassword ? <EyeShowIcon />  : <EyeCloseIcon />}
            </button>
          </div>
        </div>

        {/* Confirm Password */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-normal text-primarytext ml-1">
            Confirm Password
          </label>
          <div className="relative">
            <input
              type={showConfirm ? "text" : "password"}
              placeholder="Renter Your Password"
              className="w-full rounded-xl font-normal text-primarytext placeholder:text-mutedtext border focus:placeholder-transparent outline-none border-bordercolor px-4 py-3 pr-12 text-sm focus:outline-none hover:border-primary focus:border-primary transition-all"
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-4 inset-y-0 flex items-center cursor-pointer opacity-70 hover:opacity-100 transition"
            >
              {showConfirm ? <EyeShowIcon />  : <EyeCloseIcon />}
            </button>
          </div>
        </div>

        {/* Signup Button - Adjusted margin to match Login layout */}
        <button
          type="button"
          onClick={() =>
            navigate("/verifyotp", {
              state: { from: "signup" },
            })
          }
          className="w-full text-center bg-primary hover:bg-hoverbtn text-white rounded-full py-3.5 font-semibold shadow-lg shadow-primary/10 cursor-pointer transition mt-2 active:scale-[0.98]"
        >
          Sign Up
        </button>
      </form>

      {/* Footer Link */}
      <p className="text-center font-normal text-sm text-secondarytext">
        Already have an account?
        <Link
          to="/login"
          className="text-primary font-normal text-sm ml-1 "
        >
          Login
        </Link>
      </p>
    </div>
  );
};

export default SignupForm;