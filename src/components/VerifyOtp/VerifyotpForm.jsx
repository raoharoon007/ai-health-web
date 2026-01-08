import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import OtpInput from "react-otp-input";
import CheckCircle from "../../assets/icons/checkmark-circle-01.svg?react";

const VerifyotpForm = () => {
  const [otp, setOtp] = useState("");
  const [showOverlay, setShowOverlay] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from;

  const handleVerify = () => {
    setShowOverlay(true);
    setTimeout(() => {
      if (from === "forgotpassword") {
        navigate("/setnewpassword");
      } else if (from === "signup") {
        navigate("/profilesetup");
      } else {
        navigate("/verifyotpform");
      }
    }, 1500);
  };

  return (
    <>
      {/* Container: max-w-[460px] and same padding/gap as Login */}
      <div className="bg-white flex flex-col w-full max-w-115.5 rounded-3xl justify-center items-center border border-bordercolor p-6 gap-6 shadow-[0_4px_40px_0_rgba(235,235,235,0.8)] mx-4">
        
        {/* Header Section */}
        <div className="flex flex-col justify-center items-center gap-3">
          <h1 className="text-center font-semibold text-2xl sm:text-[28px] text-primarytext">
            Verify OTP
          </h1>
          <p className="text-center text-base text-secondarytext font-normal max-w-115.5">
            Enter OTP sent to your email
          </p>
        </div>

        <form className="w-full flex flex-col gap-6">
          <OtpInput
            value={otp}
            onChange={setOtp}
            numInputs={4}
            renderSeparator={<span className="w-2 md:w-4"></span>}
            shouldAutoFocus={true}
            containerStyle="flex justify-center items-center"
            renderInput={(inputProps) => (
              <input
                {...inputProps}
                type="text"
                inputMode="numeric"
                className="w-12! h-12 md:w-14! md:h-14 text-center text-primarytext text-xl font-semibold rounded-xl border border-bordercolor focus:outline-none hover:border-primary focus:border-primary transition-all"
              />
            )}
          />

          <button
            type="button"
            onClick={handleVerify}
            className="w-full text-center bg-primary hover:bg-hoverbtn text-white rounded-full py-3.5 font-semibold shadow-lg shadow-primary/10 cursor-pointer transition active:scale-[0.98]"
          >
            Verify OTP
          </button>
        </form>

        <p className="text-center font-normal text-sm text-secondarytext">
          00:52
          <span className="text-primary ml-2 cursor-pointer font-medium hover:underline">Resend</span>
        </p>
      </div>

      {/* Verification Success Overlay */}
      {showOverlay && (
        <div className="fixed inset-0 z-50 flex items-center rounded-3xl justify-center bg-black/5 backdrop-blur-sm transition-all">
          <div className="bg-white rounded-xl px-8 md:px-12 py-10 flex flex-col items-center gap-4  mx-4 ">
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
