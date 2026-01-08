import { Link } from "react-router-dom";
import { useState } from "react";
import EyeCloseIcon from "../../assets/icons/ri_eye-close-line.svg?react";
import EyeShowIcon from "../../assets/icons/ri_eye-show-line.svg?react";

const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="bg-white flex flex-col w-full max-w-115 rounded-3xl justify-center items-center border border-bordercolor p-6 gap-3 2xl:gap-6 shadow-[0_4px_40px_0_rgba(235,235,235,0.8)] mx-4">
      
      {/* Header Section */}
      <div className="flex flex-col justify-center items-center 2xl:gap-5 gap-3">
        <h1 className="text-center font-semibold text-2xl md:text-[28px] text-primarytext">
          Welcome Back
        </h1>
        <p className="text-center text-sm md:text-base text-secondarytext font-normal">
          Continue securely to receive general health guidance and view your past interactions.
        </p>
      </div>

      {/* Form Section */}
      <form className="w-full flex flex-col 2xl:gap-4 gap-2">
        {/* Email Field */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-normal text-primarytext ml-1">
            Email
          </label>
          <input
            type="email"
            placeholder="Enter Your Email"
            className="w-full rounded-xl border border-bordercolor px-4 py-3 text-sm focus:outline-none hover:border-primary focus:placeholder-transparent outline-none focus:border-primary placeholder:text-mutedtext "
          />
        </div>

        {/* Password Field */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-normal text-primarytext ml-1">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              className="w-full rounded-xl border border-bordercolor px-4 py-3 pr-12 text-sm focus:outline-none hover:border-primary focus:placeholder-transparent outline-none focus:border-primary placeholder:text-mutedtext"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 inset-y-0 flex items-center cursor-pointer "
            >
              {showPassword ? <EyeShowIcon />  : <EyeCloseIcon />}
            </button>
          </div>
        </div>

        {/* Remember & Forgot */}
        <div className="flex items-center justify-between text-xs md:text-sm mt-1">
          <label className="flex items-center gap-2 text-secondarytext cursor-pointer group">
            <input
              type="checkbox"
              className="accent-primary size-4 cursor-pointer appearance-none border-[1.5px] border-primary rounded-xs checked:appearance-auto"
            /> 
            <span className="text-sm font-normal text-secondarytext ">Remember me</span>
          </label>
          <Link
            to="/forgotpassword"
            className="text-primary font-normal text-sm "
          >
            Forgot Password?
          </Link>
        </div>

        {/* Login Button */}
        <Link to="/chat" className="w-full mt-2">
          <button
            type="button"
            className="w-full bg-primary hover:bg-hoverbtn text-white rounded-full py-2.5 text-base font-semibold  cursor-pointer "
          >
            Login
          </button>
        </Link>
      </form>

      {/* Footer Link */}
      <p className="text-center font-normal text-sm text-secondarytext">
        Don’t have an account?
        <Link
          to="/signup"
          className="text-primary font-normal ml-1 "
        >
          Create One
        </Link>
      </p>
    </div>
  );
};

export default LoginForm;