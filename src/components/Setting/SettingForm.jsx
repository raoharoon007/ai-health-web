import { useState, useRef } from "react";
import SettingProfileIcon from '../../assets/icons/Setting-Profile.svg?react';
import Select from "react-select";
import ChevronDown from "../../assets/icons/arrow-down.svg?react";
import PlusIcon from "../../assets/icons/Plus-Icon.svg?react";
import CrossOutlineIcon from "../../assets/icons/Cross-outline.svg?react";
import SetNewPasswordform from '../SetNewPassword/SetNewPasswordform';
import CrossIcon from '../../assets/icons/Cross-icon.svg?react';
import CheckCircle from "../../assets/icons/checkmark-circle-01.svg?react";
import EditIcon from "../../assets/icons/Editimage.svg?react";

const genderOptions = [
    { value: "Male", label: "Male" },
    { value: "Female", label: "Female" },
];

const SettingForm = () => {
    const [showInput, setShowInput] = useState(false);
    const [conditions, setConditions] = useState(["Asthma", "Asthma", "Asthma", "Asthma", "Asthma", "Asthma", "Asthma", "Asthma", "Asthma"]);
    const [inputValue, setInputValue] = useState("");
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [showOverlay1, setShowOverlay1] = useState(false);
    const [profileImage, setProfileImage] = useState(null);
    const fileInputRef = useRef(null);

    const [formData, setFormData] = useState({
        fullName: "Alex Costa",
        email: "abc123@gmail.com",
        age: "44",
        weight: "64",
        height: "156",
        gender: "Male",
        password: "password123"
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSaveChanges = () => {
        setShowOverlay1(true);
        setTimeout(() => {
            setShowOverlay1(false);
        }, 2000);
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
                alert("Please upload only image files (PNG, JPG, WebP,Svg,Jpeg).");
                e.target.value = null; 
                return;
            }

            if (file.size > 5 * 1024 * 1024) {
                alert("File is too large. Please upload an image under 5MB.");
                e.target.value = null;
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
                    <div className="fixed inset-0 z-1000 flex items-center justify-center bg-black/5 w-full rounded-3xl backdrop-blur-sm">
                        <div className="w-full max-w-lg shadow-2xl bg-white rounded-xl overflow-hidden">
                            <div className='flex justify-between items-center p-6 border-b border-bordercolor'>
                                <span className='text-primarytext font-medium text-2xl'>Change Password</span>
                                <button
                                    onClick={() => setIsChangingPassword(false)}
                                    className="cursor-pointer hover:opacity-70 transition"
                                >
                                    <CrossIcon />
                                </button>
                            </div>
                            <div className="p-6">
                                <SetNewPasswordform onBack={() => setIsChangingPassword(false)} />
                            </div>
                        </div>
                    </div>
                )}
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6 py-8'>
                    <div className='flex flex-col gap-6'>
                        <span className='text-lg font-medium text-primarytext'>Personal Information</span>
                        <div className='border border-bordercolor rounded-xl bg-white p-3 flex items-center'>
                            <div className="relative h-16 w-16">
                                {profileImage ? (
                                    <img src={profileImage} alt="Profile" className="h-full w-full object-cover" />
                                ) : (
                                    <SettingProfileIcon className="h-full w-full" />
                                )}
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    className="hidden"
                                    accept="image/png, image/jpeg, image/jpg, image/webp, image/svg"
                                    onChange={handleImageChange}
                                />
                                <button
                                    onClick={() => fileInputRef.current.click()}
                                    className="absolute bottom-10 -right-1 bg-transparent p-1.5 cursor-pointer hover:scale-110 "
                                >
                                    <EditIcon />
                                </button>
                            </div>
                            <div className='flex flex-col ml-4'>
                                <span className='text-lg font-normal text-primarytext'>{formData.fullName}</span>
                                <span className='text-sm font-normal text-secondarytext'>{formData.email}</span>
                            </div>
                        </div>
                        <form className='border border-bordercolor rounded-xl bg-white p-6 flex flex-col w-full'>
                            <div className='pb-3'>
                                <label className="block text-sm font-normal text-primarytext mb-1">Full Name</label>
                                <input name="fullName" value={formData.fullName} onChange={handleInputChange} type="text" placeholder="Enter your Full Name" className="w-full rounded-xl border border-bordercolor px-4 py-3 text-sm focus:outline-none focus:border-primary" />
                            </div>
                            <div className='pb-3'>
                                <label className="block text-sm font-normal text-primarytext mb-1">Email</label>
                                <input name="email" value={formData.email} onChange={handleInputChange} type="email" placeholder="Enter Your Email" className="w-full rounded-xl border border-bordercolor px-4 py-3 text-sm focus:outline-none focus:border-primary" />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3 pb-3">
                                <div>
                                    <label className="block text-sm font-normal text-primarytext mb-1">Age</label>
                                    <input name="age" value={formData.age} onChange={handleInputChange} type="number" placeholder="Age" className="w-full rounded-xl border border-bordercolor px-4 py-3 text-sm focus:outline-none focus:border-primary" />
                                </div>
                                <div>
                                    <label className="block text-sm font-normal text-primarytext mb-1">Weight (kg)</label>
                                    <input name="weight" value={formData.weight} onChange={handleInputChange} type="number" placeholder="Weight" className="w-full rounded-xl border border-bordercolor px-4 py-3 text-sm focus:outline-none focus:border-primary" />
                                </div>
                                <div>
                                    <label className="block text-sm font-normal text-primarytext mb-1">Height (cm)</label>
                                    <input name="height" value={formData.height} onChange={handleInputChange} type="number" placeholder="Height" className="w-full rounded-xl border border-bordercolor px-4 py-3 text-sm focus:outline-none focus:border-primary" />
                                </div>
                                <div >
                                    <label className="block text-sm font-normal text-primarytext mb-1">Gender</label>
                                    <div className="relative w-full">
                                        <Select
                                            options={genderOptions}
                                            className="w-full text-primarytext! placeholder:text-primarytext! "
                                            classNamePrefix="tw-select"
                                            value={genderOptions.find(opt => opt.value === formData.gender)}
                                            onChange={(opt) => setFormData(prev => ({ ...prev, gender: opt }))}
                                            components={{
                                                DropdownIndicator: () => (
                                                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-primarytext pointer-events-none " />
                                                ),
                                                IndicatorSeparator: () => null,
                                            }}
                                        />
                                    </div>

                                </div>
                            </div>
                            <div className='pb-3'>
                                <label className="block text-sm font-normal text-primarytext mb-1">
                                    Password
                                </label>

                                <div className="relative">
                                    <input
                                        type="password"
                                        placeholder="Enter your password"
                                        value={formData.password} disabled onChange={handleInputChange}
                                        className="w-full rounded-xl font-normal text-primarytext placeholder:text-mutedtext border border-bordercolor px-4 py-3 pr-12 text-sm
                                     focus:outline-none  focus:border-primary "
                                    />

                                </div>
                            </div>
                            <div className='flex justify-end'>
                                <button
                                    type="button"
                                    onClick={() => setIsChangingPassword(true)}
                                    className="text-center [text-underline-position:from-font] underline hover:underline text-primary p-2.5 font-normal cursor-pointer text-sm"
                                >
                                    Change Password
                                </button>
                            </div>
                        </form>
                    </div>
                    <div className='flex flex-col gap-6'>
                        <div className='flex justify-between'>
                            <span className='text-lg font-medium text-primarytext'>Health Conditions</span>
                            <PlusIcon
                                className="cursor-pointer"
                                onClick={() => setShowInput(!showInput)}
                            />
                        </div>

                        {showInput && (
                            <div className='flex gap-6 animate-in fade-in duration-300'>
                                <input
                                    type="text"
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    placeholder="Add Health Condition"
                                    className="w-full rounded-xl border font-normal bg-white text-primarytext placeholder:text-mutedtext border-bordercolor px-4 py-3 text-sm focus:outline-none focus:border-primary"
                                />
                                <button
                                    onClick={handleAddCondition}
                                    className='bg-primary w-34.25 hover:bg-hoverbtn rounded-full text-center text-base font-semibold text-white p-2.5 cursor-pointer'
                                >
                                    Add
                                </button>
                            </div>
                        )}

                        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 border border-bordercolor rounded-xl bg-white p-6'>
                            {conditions.map((item, index) => (
                                <div key={index} className='flex border-primary border items-center rounded-xl px-3 py-3 xl:px-5 xl:py-3 justify-between'>
                                    <span className='text-primary text-sm font-medium'>{item}</span>
                                    <CrossOutlineIcon
                                        className="cursor-pointer"
                                        onClick={() => removeCondition(index)}
                                    />
                                </div>
                            ))}
                        </div>

                        <div className='flex justify-center md:justify-end '>
                            <button onClick={handleSaveChanges} className='cursor-pointer w-61 text-center text-base font-semibold bg-primary rounded-full hover:bg-hoverbtn p-2.5 text-white'>
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            {showOverlay1 && (
                <div className="fixed inset-0 top-0 left-0 z-50 flex items-center justify-center bg-black/5 w-full rounded-3xl backdrop-blur-sm">
                    <div className="bg-white rounded-xl px-10 py-8 flex flex-col items-center gap-4 shadow-xl">
                        <CheckCircle className="" />
                        <p className="text-[22px] font-medium text-primarytext text-center ">
                            Changes Saved
                        </p>
                    </div>
                </div>
            )}
        </>
    );
}

export default SettingForm;
