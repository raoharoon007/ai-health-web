import EyeCloseIcon from "../../assets/icons/ri_eye-close-line.svg?react";
import EyeShowIcon from "../../assets/icons/ri_eye-show-line.svg?react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CheckCircle from "../../assets/icons/checkmark-circle-01.svg?react";

const SetNewPasswordform = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [showOverlay1, setShowOverlay1] = useState(false);
    const navigate = useNavigate();

    const handleConfirmPassword = () => {
        setShowOverlay1(true);

        setTimeout(() => {
            navigate("/login");
        }, 1500);
    };

    return (
        <>
            <form className="w-full flex flex-col gap-4">
                    {/* Password Field */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-normal text-primarytext ml-1">
                            Password
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter your password"
                                className="w-full rounded-xl font-normal text-primarytext placeholder:text-mutedtext border border-bordercolor focus:placeholder-transparent outline-none px-4 py-3 pr-12 text-sm focus:outline-none hover:border-primary focus:border-primary transition-all"
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

                    {/* Confirm Password Field */}
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

                    <button
                        type="button"
                        onClick={handleConfirmPassword}
                        className="w-full text-center bg-primary hover:bg-hoverbtn text-white rounded-full py-3.5 font-semibold shadow-lg shadow-primary/10 cursor-pointer transition mt-2 active:scale-[0.98]"
                    >
                        Reset Password
                    </button>
                </form>

            {showOverlay1 && (
                <div className="fixed inset-0 top-0 left-0 z-50 flex items-center justify-center bg-black/5 w-full rounded-3xl backdrop-blur-sm">
                    <div className="bg-white rounded-xl px-10 py-8 flex flex-col items-center gap-4 shadow-xl">
                        <CheckCircle className="" />
                        <p className="text-[22px] font-medium text-primarytext text-center flex flex-col">
                            Password  Updated
                            <span className="text-secondarytext text-lg font-medium">Login again</span>
                        </p>
                    </div>
                </div>
            )}
        </>
    );
}

export default SetNewPasswordform;
