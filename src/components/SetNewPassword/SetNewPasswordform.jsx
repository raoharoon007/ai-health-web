import EyeCloseIcon from "../../assets/icons/ri_eye-close-line.svg?react";
import EyeShowIcon from "../../assets/icons/ri_eye-show-line.svg?react";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import CheckCircle from "../../assets/icons/checkmark-circle-01.svg?react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import api from "../../api/axiosInstance";

const schema = yup.object({
    current_password: yup.string().when("$isSettings", {
        is: true,
        then: (schema) => schema.required("Current password is required"),
        otherwise: (schema) => schema.notRequired(),
    }),
    password: yup
        .string()
        .required("Password is required")
        .min(8, "Password must be at least 8 characters")
        .matches(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/,
            "Password must contain at least 1 uppercase, 1 lowercase, 1 number, and 1 special character"
        )
        .notOneOf([yup.ref('current_password')], "New password cannot be the same as current password"),
    confirmPassword: yup
        .string()
        .required("Please confirm your password")
        .oneOf([yup.ref("password"), null], "Passwords must match"),
}).required();

const SetNewPasswordform = ({ buttonText = "Reset Password" }) => {
    const [showCurrent, setShowCurrent] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [showOverlay1, setShowOverlay1] = useState(false);
    const [apiError, setApiError] = useState("");

    const navigate = useNavigate();
    const location = useLocation();
    const isSettings = buttonText === "Save New Password";

    const {
        register,
        handleSubmit,
        setError,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: yupResolver(schema),
        context: { isSettings },
        mode: "onChange"
    });

    const onSubmit = async (data) => {
        setApiError("");
        try {
            const userEmail = location.state?.email;
            const userOtp = location.state?.otp;

            if (isSettings) {
                const payload = {
                    current_password: data.current_password,
                    new_password: data.password,
                    confirm_password: data.confirmPassword
                };

                await api.patch("/user/set-new-password", payload);
            } else {
                if (!userOtp) {
                    setApiError("Session expired. Please restart.");
                    return;
                }
                await api.post("/auth/set-new-password", {
                    email: userEmail,
                    otp: userOtp,
                    new_password: data.password,
                    confirm_password: data.confirmPassword
                });
            }

            setShowOverlay1(true);
            if (isSettings) {
                setTimeout(() => setShowOverlay1(false), 2000);
            } else {
                setTimeout(() => navigate("/login"), 2000);
            }
        } catch (error) {
            const errorMsg = error.response?.data?.detail || "Update failed";
            if (isSettings && (errorMsg.toLowerCase().includes("incorrect") || errorMsg.toLowerCase().includes("current password"))) {
                setError("current_password", {
                    type: "server",
                    message: "Current password is incorrect"
                });
            } else {
                setApiError(errorMsg);
            }
        }
    };

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)} className="w-full flex flex-col gap-4">
                {isSettings && (
                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-normal text-primarytext ml-1">Current Password</label>
                        <div className="relative">
                            <input
                                {...register("current_password")}
                                type={showCurrent ? "text" : "password"}
                                placeholder="Enter Current Password"
                                className={`w-full rounded-xl font-normal text-primarytext placeholder:text-mutedtext border outline-none px-4 py-3 pr-12 text-sm transition-all ${errors.current_password ? "border-warning" : "border-bordercolor focus:border-primary"
                                    }`}
                            />
                            <button
                                type="button"
                                onClick={() => setShowCurrent(!showCurrent)}
                                className="absolute right-4 inset-y-0 flex items-center opacity-70 cursor-pointer"
                            >
                                {showCurrent ? <EyeShowIcon /> : <EyeCloseIcon />}
                            </button>
                        </div>
                        {errors.current_password && <span className="text-warning text-xs italic">{errors.current_password.message}</span>}
                    </div>
                )}

                <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-normal text-primarytext ml-1">
                        {isSettings ? "New Password" : "Password"}
                    </label>
                    <div className="relative">
                        <input
                            {...register("password")}
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter New Password"
                            className={`w-full rounded-xl font-normal text-primarytext placeholder:text-mutedtext border outline-none px-4 py-3 pr-12 text-sm transition-all ${errors.password ? "border-warning" : "border-bordercolor focus:border-primary"
                                }`}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 inset-y-0 flex items-center opacity-70 cursor-pointer"
                        >
                            {showPassword ? <EyeShowIcon /> : <EyeCloseIcon />}
                        </button>
                    </div>
                    {errors.password && <span className="text-warning text-xs italic">{errors.password.message}</span>}
                </div>

                <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-normal text-primarytext ml-1">Confirm Password</label>
                    <div className="relative">
                        <input
                            {...register("confirmPassword")}
                            type={showConfirm ? "text" : "password"}
                            placeholder="Renter Your Password"
                            className={`w-full rounded-xl font-normal text-primarytext placeholder:text-mutedtext border outline-none px-4 py-3 pr-12 text-sm transition-all ${errors.confirmPassword ? "border-warning" : "border-bordercolor focus:border-primary"
                                }`}
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirm(!showConfirm)}
                            className="absolute right-4 inset-y-0 flex items-center opacity-70 cursor-pointer"
                        >
                            {showConfirm ? <EyeShowIcon /> : <EyeCloseIcon />}
                        </button>
                    </div>
                    {errors.confirmPassword && <span className="text-warning text-xs italic">{errors.confirmPassword.message}</span>}
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full text-center bg-primary hover:bg-hoverbtn text-white rounded-full py-3.5 font-semibold transition mt-2 disabled:opacity-70 cursor-pointer"
                >
                    {isSubmitting ? "Updating..." : buttonText}
                </button>
            </form>

            {apiError && (
                <div className="w-full bg-warning/10 border border-warning/20 text-warning text-xs py-2.5 px-4 rounded-xl text-center font-medium italic mt-4">
                    {apiError}
                </div>
            )}

            {showOverlay1 && (
                <div className="fixed inset-0 z-50 flex items-center rounded-3xl justify-center bg-black/5 backdrop-blur-sm">
                    <div className="bg-white rounded-xl px-10 py-8 flex flex-col items-center gap-4 shadow-xl">
                        <CheckCircle className="w-16 h-16" />
                        <div className="text-[22px] font-medium text-primarytext text-center">
                            {isSettings ? "Password Changed" : "Password Updated"}
                            {!isSettings && <span className="block text-secondarytext text-lg font-medium">Login again</span>}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default SetNewPasswordform;