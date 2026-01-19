import EyeCloseIcon from "../../assets/icons/ri_eye-close-line.svg?react";
import EyeShowIcon from "../../assets/icons/ri_eye-show-line.svg?react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CheckCircle from "../../assets/icons/checkmark-circle-01.svg?react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

// 1. Validation Schema
const schema = yup.object({
    password: yup
        .string()
        .required("Password is required")
        .min(6, "Min 6 characters")
        .matches(/^(?=.*[a-zA-Z])(?=.*[0-9])/, "Must contain letters and numbers"),
    confirmPassword: yup
        .string()
        .required("Please confirm your password")
        .oneOf([yup.ref("password"), null], "Passwords must match"),
}).required();

const SetNewPasswordform = ({ buttonText = "Reset Password" }) => {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [showOverlay1, setShowOverlay1] = useState(false);
    const navigate = useNavigate();

    // 2. Hook Form setup
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
        mode: "onChange", // Real-time validation
    });

    // 3. Submit handler
    const onSubmit = (data) => {
        console.log("Password Updated:", data);
        setShowOverlay1(true);

        setTimeout(() => {
            navigate("/login");
        }, 1500);
    };

    return (
        <>
            {/* Form Tag with handleSubmit */}
            <form onSubmit={handleSubmit(onSubmit)} className="w-full flex flex-col gap-4">
                {/* Password Field */}
                <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-normal text-primarytext ml-1">
                        Password
                    </label>
                    <div className="relative">
                        <input
                            {...register("password")}
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter Your Password"
                            className={`w-full rounded-xl font-normal text-primarytext placeholder:text-mutedtext border focus:placeholder-transparent outline-none px-4 py-3 pr-12 text-sm transition-all ${errors.password
                                    ? "border-warning focus:border-warning"
                                    : "border-bordercolor focus:border-primary hover:border-primary"
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
                    {errors.password && (
                        <span className="text-warning text-xs ml-1 font-medium italic">
                            {errors.password.message}
                        </span>
                    )}
                </div>

                {/* Confirm Password Field */}
                <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-normal text-primarytext ml-1">
                        Confirm Password
                    </label>
                    <div className="relative">
                        <input
                            {...register("confirmPassword")}
                            type={showConfirm ? "text" : "password"}
                            placeholder="Renter Your Password"
                            className={`w-full rounded-xl font-normal text-primarytext placeholder:text-mutedtext border focus:placeholder-transparent outline-none px-4 py-3 pr-12 text-sm transition-all ${errors.confirmPassword
                                    ? "border-warning focus:border-warning"
                                    : "border-bordercolor focus:border-primary hover:border-primary"
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
                    {errors.confirmPassword && (
                        <span className="text-warning text-xs ml-1 font-medium italic">
                            {errors.confirmPassword.message}
                        </span>
                    )}
                </div>

                <button
                    type="submit"
                    className="w-full text-center bg-primary hover:bg-hoverbtn text-white rounded-full py-3.5 font-semibold shadow-lg shadow-primary/10 cursor-pointer transition mt-2 active:scale-[0.98]"
                >
                    {buttonText || "Submit"}
                </button>
            </form>

            {/* Verification Success Overlay */}
            {showOverlay1 && (
                <div className="fixed inset-0 top-0 left-0 z-50 flex items-center justify-center bg-black/5 w-full rounded-3xl backdrop-blur-sm">
                    <div className="bg-white rounded-xl px-10 py-8 flex flex-col items-center gap-4 shadow-xl">
                        <CheckCircle className="" />
                        <div className="text-[22px] font-medium text-primarytext text-center flex flex-col">
                            Password Updated
                            <span className="text-secondarytext text-lg font-medium">Login again</span>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default SetNewPasswordform;