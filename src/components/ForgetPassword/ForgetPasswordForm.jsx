import { Link, useNavigate } from "react-router-dom";
import { useState } from "react"; // useState add kiya
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import api from "../../api/axiosInstance";

const schema = yup.object({
  email: yup
    .string()
    .required("Email is required")
    .matches(
      /^(?!.*\.\.)(?!\.)(?!.*\.$)([a-zA-Z0-9._%+-]*[a-zA-Z0-9%+-])@(?!(?:-))[A-Za-z0-9-]+(?<!-)(\.[A-Za-z]{2,})+$/,
      'Enter a valid email address'
    ),
}).required();

const ForgetPasswordForm = () => {
  const navigate = useNavigate();
  const [apiError, setApiError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }, // isSubmitting for loading state
  } = useForm({resolver: yupResolver(schema),mode: "onChange"});

  const onSubmit = async (data) => {
    setApiError(""); 
    try {
      await api.post("/auth/forgot-password", {
        email: data.email,
      });

      navigate("/verifyotp", {
        state: {
          from: "forgotpassword",
          email: data.email
        },
      });
    } catch (error) {
      const msg = error.response?.data?.detail || "Connection error. Please try again.";
      setApiError(typeof msg === 'string' ? msg : "Email not found or server error.");
    }
  };

  return (
    <div className="bg-white flex flex-col w-full max-w-115.5 rounded-3xl justify-center items-center border border-bordercolor p-6 gap-6 shadow-[0_4px_40px_0_rgba(235,235,235,0.8)] mx-4">

      <div className="flex flex-col justify-center items-center gap-3">
        <h1 className="text-center font-semibold text-2xl sm:text-[28px] text-primarytext">
          Forgot Password?
        </h1>
        <p className="text-center text-base text-secondarytext font-normal self-stretch max-w-115.5">
          Enter your email to reset your account access.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="w-full flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="block text-sm font-normal text-primarytext ml-1">
            Email
          </label>
          <input
            {...register("email")}
            type="email"
            placeholder="Enter Your Email"
            className={`w-full rounded-xl border text-primarytext placeholder:text-mutedtext font-normal px-4 py-3 text-sm transition-all outline-none ${errors.email || apiError
                ? "border-warning focus:border-warning"
                : "border-bordercolor hover:border-primary focus:border-primary"
              }`}
          />
          {errors.email && (
            <span className="text-warning text-xs ml-1 font-medium italic">
              {errors.email.message}
            </span>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting} 
          className="w-full text-center bg-primary hover:bg-hoverbtn text-white rounded-full py-3.5 font-semibold shadow-lg shadow-primary/10 cursor-pointer transition mt-2 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Sending..." : "Send OTP"}
        </button>
      </form>

      {apiError && (
        <div className="w-full bg-warning/10 border border-warning/20 text-warning text-xs py-3 px-4 rounded-xl text-center font-medium italic">
          {apiError}
        </div>
      )}

      <p className="text-center font-normal text-sm text-secondarytext">
        Back to
        <Link to="/login" className="text-primary font-normal text-sm ml-1 ">
          Login
        </Link>
      </p>
    </div>
  );
}

export default ForgetPasswordForm;