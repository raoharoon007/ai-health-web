import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import OtpInput from "react-otp-input";
import CheckCircle from "../../assets/icons/checkmark-circle-01.svg?react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import api from "../../api/axiosInstance";
import { setAuthToken } from "../../utils/auth";

const schema = yup.object({
  otp: yup
    .string()
    .required("OTP is required")
    .length(4, "Please enter all 4 digits")
    .matches(/^[0-9]+$/, "Only numbers are allowed"),
}).required();

const VerifyotpForm = () => {
  const [showOverlay, setShowOverlay] = useState(false);
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [apiError, setApiError] = useState("");
  const [resendMessage, setResendMessage] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from;
  const email = location.state?.email;

  const { control, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { otp: "" },
    mode: "onChange"
  });

  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    } else {
      setCanResend(true);
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timer]);

  // ---RESEND LOGIC---
  const handleResend = async () => {
    if (!canResend) return;
    setApiError("");
    setResendMessage("");

    try {
      let response;
      if (from === "signup") {
        const endpoint = `/auth/resend-otp-for-signup/${email}`;
        response = await api.post(endpoint);
      }
      else {
        const endpoint = "/auth/forgot-password";
        response = await api.post(endpoint, { email: email });
      }

      setResendMessage(response.data.message || "OTP resent successfully!");
      setTimer(60);
      setCanResend(false);

      setTimeout(() => setResendMessage(""), 3000);
    } catch (error) {
      console.error("Resend API Error:", error);
      const errorMsg = error.response?.data?.detail || "Failed to resend OTP";
      setApiError(errorMsg);
    }
  };

  const formatTime = (time) => {
    const seconds = time % 60;
    return `00:${seconds < 10 ? `0${seconds}` : seconds}`;
  };

  const onVerify = async (data) => {
    setApiError("");
    try {
      let endpoint = from === "forgotpassword"
        ? "/auth/verify-otp-for-forget-password"
        : "/auth/verify-otp-for-email-for-signup";

      const response = await api.post(endpoint, {
        email: email,
        otp: data.otp,
      });

      if (from !== "forgotpassword" && response.data.token) {
        setAuthToken(response.data.token);
        console.log("Token saved successfully!");
      }

      setShowOverlay(true);

      setTimeout(() => {
        if (from === "forgotpassword") {
          navigate("/setnewpassword", {
            state: { email: email, otp: data.otp }
          });
        } else {
          navigate("/profilesetup");
        }
      }, 1500);
    } catch (error) {
      setApiError(error.response?.data?.detail || error.response?.data?.message || "Invalid OTP. Please try again.");
    }
  };

  return (
    <>
      <div className="bg-white flex flex-col w-full max-w-115.5 rounded-3xl justify-center items-center border border-bordercolor p-6 gap-6 shadow-[0_4px_40px_0_rgba(235,235,235,0.8)] mx-4">

        <div className="flex flex-col justify-center items-center gap-3">
          <h1 className="text-center font-semibold text-2xl sm:text-[28px] text-primarytext">
            Verify OTP
          </h1>
          <p className="text-center text-base text-secondarytext font-normal max-w-115.5">
            Enter OTP sent to your email
          </p>
        </div>

        <form onSubmit={handleSubmit(onVerify)} className="w-full flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <Controller
              name="otp"
              control={control}
              render={({ field: { onChange, value } }) => (
                <OtpInput
                  value={value}
                  onChange={onChange}
                  numInputs={4}
                  renderSeparator={<span className="w-2 md:w-4"></span>}
                  shouldAutoFocus={true}
                  containerStyle="flex justify-center items-center"
                  renderInput={(inputProps) => (
                    <input
                      {...inputProps}
                      className={`w-12! h-12 md:w-14! md:h-14 text-center text-primarytext text-xl font-semibold rounded-xl border transition-all focus:outline-none ${errors.otp || apiError ? "border-warning" : "border-bordercolor focus:border-primary hover:border-primary"
                        }`}
                    />
                  )}
                />
              )}
            />
            {errors.otp && (
              <span className="text-warning text-xs text-center font-medium italic">
                {errors.otp.message}
              </span>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full text-center bg-primary hover:bg-hoverbtn text-white rounded-full py-3.5 font-semibold shadow-lg shadow-primary/10 cursor-pointer transition active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Verifying..." : "Verify OTP"}
          </button>
        </form>

        {(apiError || resendMessage) && (
          <div className={`w-full text-xs py-2.5 px-4 rounded-xl text-center font-medium italic ${apiError ? "bg-warning/10 text-warning border border-warning/20" : "bg-primary/10 text-primary border border-primary/20"
            }`}>
            {apiError || resendMessage}
          </div>
        )}

        <p className="text-center font-normal text-sm text-secondarytext mt-4">
          {formatTime(timer)}
          <span
            onClick={handleResend}
            className={`ml-2 font-medium transition ${canResend ? "text-primary cursor-pointer " : "text-mutedtext cursor-not-allowed opacity-50"
              }`}
          >
            Resend
          </span>
        </p>
      </div>

      {showOverlay && (
        <div className="fixed inset-0 z-50 flex items-center rounded-3xl justify-center bg-black/5 backdrop-blur-sm transition-all">
          <div className="bg-white rounded-xl px-8 md:px-12 py-10 flex flex-col items-center gap-4 mx-4 shadow-2xl animate-in zoom-in-95 duration-300">
            <CheckCircle className="w-16 h-16" />
            <p className="text-xl md:text-[22px] font-semibold text-primarytext text-center">
              Verification Completed
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default VerifyotpForm;