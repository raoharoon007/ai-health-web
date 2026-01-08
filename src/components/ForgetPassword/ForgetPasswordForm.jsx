import { Link, useNavigate } from "react-router-dom";

const ForgetPasswordForm = () => {
  const navigate = useNavigate();

  return (
    // Max-width [460px] aur same padding/gap jo login form mein thi
    <div className="bg-white flex flex-col w-full max-w-115.5 rounded-3xl justify-center items-center border border-bordercolor p-6 gap-6 shadow-[0_4px_40px_0_rgba(235,235,235,0.8)] mx-4">
      
      {/* Header Section */}
      <div className="flex flex-col justify-center items-center gap-3">
        <h1 className="text-center font-semibold text-2xl sm:text-[28px] text-primarytext [text-box-trim:trim-both] [text-box-edge:cap_alphabetic]">
          Forgot Password?
        </h1>
        <p className="text-center text-base text-secondarytext font-normal self-stretch max-w-115.5">
          Enter your email to reset your account access.
        </p>
      </div>

      {/* Form Section */}
      <form className="w-full flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="block text-sm font-normal text-primarytext ml-1">
            Email
          </label>
          <input
            type="email"
            placeholder="Enter Your Email"
            className="w-full rounded-xl border text-primarytext placeholder:text-mutedtext font-normal border-bordercolor px-4 py-3 text-sm focus:placeholder-transparent outline-none focus:outline-none hover:border-primary focus:border-primary transition-all"
          />
        </div>

        <button
          type="button"
          onClick={() =>
            navigate("/verifyotp", {
              state: { from: "forgotpassword" },
            })
          }
          className="w-full text-center bg-primary hover:bg-hoverbtn text-white rounded-full py-3.5 font-semibold shadow-lg shadow-primary/10 cursor-pointer transition mt-2 active:scale-[0.98]"
        >
          Send OTP
        </button>
      </form>

      {/* Footer Link */}
      <p className="text-center font-normal text-sm text-secondarytext">
        Back to
        <Link
          to="/login"
          className="text-primary font-normal text-sm ml-1 hover:underline"
        >
          Login
        </Link>
      </p>
    </div>
  );
}

export default ForgetPasswordForm;
