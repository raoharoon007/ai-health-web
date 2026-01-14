import { useState, useRef, useEffect } from "react";
import SettingProfileIcon from '../../assets/icons/Setting-Profile.svg?react';
import Select from "react-select";
import ChevronDown from "../../assets/icons/arrow-down.svg?react";
import PlusIcon from "../../assets/icons/Plus-Icon.svg?react";
import CrossOutlineIcon from "../../assets/icons/Cross-outline.svg?react";
import SetNewPasswordform from '../SetNewPassword/SetNewPasswordform';
import CrossIcon from '../../assets/icons/Cross-icon.svg?react';
import CheckCircle from "../../assets/icons/checkmark-circle-01.svg?react";
import EditIcon from "../../assets/icons/Editimage.svg?react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

// 1. Validation Schema
const schema = yup.object({
    fullName: yup.string().required("Name is required"),
    email: yup.string().email("Invalid email").required("Email is required"),
    age: yup.number().typeError("Age must be a number").positive().integer().min(1).required(),
    weight: yup.number().typeError("Must be a number").positive().min(1).required(),
    height: yup.number().typeError("Must be a number").positive().min(1).required(),
    gender: yup.object().required("Required"),
}).required();

const genderOptions = [
    { value: "Male", label: "Male" },
    { value: "Female", label: "Female" },
];

const SettingForm = () => {
    const [showInput, setShowInput] = useState(false);
    const [conditions, setConditions] = useState(["Asthma", "Asthma", "Asthma","Asthma","Asthma","Asthma","Asthma","Asthma","Asthma",]);
    const [inputValue, setInputValue] = useState("");
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [showOverlay1, setShowOverlay1] = useState(false);
    const [profileImage, setProfileImage] = useState(null);
    const fileInputRef = useRef(null);

    // 2. React Hook Form Setup
    const { register, handleSubmit, control, setValue, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
        mode: "onChange",
        defaultValues: {
            fullName: "Alex Costa",
            email: "abc123@gmail.com",
            age: 44,
            weight: 64,
            height: 156,
            gender: { value: "Male", label: "Male" }
        }
    });

    const onSaveProfile = (data) => {
        console.log("Updated Data:", data);
        setShowOverlay1(true);
        setTimeout(() => setShowOverlay1(false), 2000);
    };

    const handleAddCondition = () => {
        if (inputValue.trim() !== "") {
            setConditions([...conditions, inputValue]);
            setInputValue("");
            setShowInput(false);
        }
    };

    const removeCondition = (indexToRemove) => {
        setConditions(conditions.filter((_, index) => index !== indexToRemove));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (!file.type.startsWith("image/")) {
                alert("Please upload an image file.");
                return;
            }
            const imageUrl = URL.createObjectURL(file);
            setProfileImage(imageUrl);
        }
    };

    return (
        <>
            <div className="relative">
                {isChangingPassword && (
                    <div className="fixed inset-0 z-1000 flex items-center justify-center bg-black/5 backdrop-blur-sm">
                        <div className="w-full max-w-lg shadow-2xl bg-white rounded-xl overflow-hidden mx-4">
                            <div className='flex justify-between items-center p-6 border-b border-bordercolor'>
                                <span className='text-primarytext font-medium text-2xl'>Change Password</span>
                                <button onClick={() => setIsChangingPassword(false)} className="cursor-pointer hover:opacity-70 transition">
                                    <CrossIcon />
                                </button>
                            </div>
                            <div className="p-6">
                                <SetNewPasswordform buttonText="Save New Password" />
                            </div>
                        </div>
                    </div>
                )}

                <div className='grid grid-cols-1 md:grid-cols-2 gap-6 py-8'>
                    {/* Left Column: Personal Info */}
                    <div className='flex flex-col gap-6'>
                        <span className='text-lg font-medium text-primarytext'>Personal Information</span>
                        
                        <div className='border border-bordercolor rounded-xl bg-white p-3 flex items-center'>
                            <div className="relative h-16 w-16">
                                {profileImage ? (
                                    <img src={profileImage} alt="Profile" className="h-full w-full object-cover rounded-lg" />
                                ) : (
                                    <SettingProfileIcon className="h-full w-full" />
                                )}
                                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageChange} />
                                <button onClick={() => fileInputRef.current.click()} className="absolute bottom-13 -right-1 cursor-pointer">
                                    <EditIcon />
                                </button>
                            </div>
                            <div className='flex flex-col ml-4'>
                                <span className='text-lg font-normal text-primarytext'>Alex Costa</span>
                                <span className='text-sm font-normal text-secondarytext'>abc123@gmail.com</span>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit(onSaveProfile)} className='border border-bordercolor rounded-xl bg-white p-6 flex flex-col w-full gap-3'>
                            <div>
                                <label className="block text-sm font-normal text-primarytext mb-1 ml-1">Full Name</label>
                                <input {...register("fullName")} type="text" className={`w-full rounded-xl border px-4 py-3 text-sm outline-none ${errors.fullName ? "border-red-500" : "border-bordercolor focus:border-primary"}`} />
                            </div>

                            <div>
                                <label className="block text-sm font-normal text-primarytext mb-1 ml-1">Email</label>
                                <input {...register("email")} type="email" className={`w-full rounded-xl border px-4 py-3 text-sm outline-none ${errors.email ? "border-red-500" : "border-bordercolor focus:border-primary"}`} />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-sm font-normal text-primarytext mb-1 ml-1">Age</label>
                                    <input {...register("age")} type="number" className="w-full rounded-xl border border-bordercolor px-4 py-3 text-sm focus:border-primary outline-none" />
                                </div>
                                <div>
                                    <label className="block text-sm font-normal text-primarytext mb-1 ml-1">Weight (kg)</label>
                                    <input {...register("weight")} type="number" className="w-full rounded-xl border border-bordercolor px-4 py-3 text-sm focus:border-primary outline-none" />
                                </div>
                                <div>
                                    <label className="block text-sm font-normal text-primarytext mb-1 ml-1">Height (cm)</label>
                                    <input {...register("height")} type="number" className="w-full rounded-xl border border-bordercolor px-4 py-3 text-sm focus:border-primary outline-none" />
                                </div>
                                <div>
                                    <label className="block text-sm font-normal text-primarytext mb-1 ml-1">Gender</label>
                                    <Controller
                                        name="gender"
                                        control={control}
                                        render={({ field }) => (
                                            <Select
                                                {...field}
                                                options={genderOptions}
                                                classNamePrefix="tw-select"
                                                components={{
                                                    DropdownIndicator: () => <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-primarytext pointer-events-none" />,
                                                    IndicatorSeparator: () => null,
                                                }}
                                            />
                                        )}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-normal text-primarytext mb-1 ml-1">Password</label>
                                <input type="password" value="********" disabled className="w-full rounded-xl border border-bordercolor px-4 py-3 text-sm bg-gray-50 opacity-60 cursor-not-allowed" />
                            </div>

                            <div className='flex justify-end'>
                                <button type="button" onClick={() => setIsChangingPassword(true)} className="underline text-primary p-2 text-sm cursor-pointer">
                                    Change Password
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Right Column: Health Conditions */}
                    <div className='flex flex-col gap-6'>
                        <div className='flex justify-between items-center'>
                            <span className='text-lg font-medium text-primarytext'>Health Conditions</span>
                            <PlusIcon className="cursor-pointer" onClick={() => setShowInput(!showInput)} />
                        </div>

                        {showInput && (
                            <div className='flex gap-3 animate-in fade-in slide-in-from-top-2 duration-300'>
                                <input type="text" value={inputValue} onChange={(e) => setInputValue(e.target.value)} placeholder="Add Health Condition" className="w-full bg-white rounded-xl border border-bordercolor px-4 py-3 text-sm focus:border-primary outline-none" />
                                <button onClick={handleAddCondition} className='bg-primary w-24 hover:bg-hoverbtn rounded-full text-white text-sm font-semibold cursor-pointer'>Add</button>
                            </div>
                        )}

                        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 border border-bordercolor rounded-xl bg-white p-6'>
                            {conditions.map((item, index) => (
                                <div key={index} className='flex bg-[rgba(47,128,237,0.10)] border-primary border items-center rounded-xl px-4.5 py-3.5 justify-between'>
                                    <span className='text-primary text-xs font-medium truncate'>{item}</span>
                                    <CrossOutlineIcon className="cursor-pointer w-4 h-4 ml-1" onClick={() => removeCondition(index)} />
                                </div>
                            ))}
                        </div>

                        <div className='flex justify-center md:justify-end mt-auto'>
                            <button onClick={handleSubmit(onSaveProfile)} className='w-full sm:w-61 bg-primary hover:bg-hoverbtn rounded-full py-3 text-white font-semibold shadow-lg transition active:scale-95 cursor-pointer'>
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {showOverlay1 && (
                <div className="fixed inset-0 z-2000 flex items-center justify-center bg-black/5 backdrop-blur-sm">
                    <div className="bg-white rounded-xl px-10 py-8 flex flex-col items-center gap-4 shadow-xl">
                        <CheckCircle />
                        <p className="text-[22px] font-medium text-primarytext">Changes Saved</p>
                    </div>
                </div>
            )}
        </>
    );
}

export default SettingForm;