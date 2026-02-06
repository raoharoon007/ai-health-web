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
import api from "../../api/axiosInstance";
import { useUser } from "../../context/UserContext";

// Validation Schema
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
    // Get profile image and update function from context
    const { profileImage, updateProfileImage } = useUser();

    const [showInput, setShowInput] = useState(false);
    const [conditions, setConditions] = useState([]);
    const [allDiseases, setAllDiseases] = useState([]);

    const [inputValue, setInputValue] = useState("");
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [showOverlay1, setShowOverlay1] = useState(false);

    // Image Handling States
    const [localProfileImage, setLocalProfileImage] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);

    const fileInputRef = useRef(null);
    const [loading, setLoading] = useState(true);
    const [apiError, setApiError] = useState("");

    const { register, handleSubmit, control, setValue, watch, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
        mode: "onChange"
    });

    const currentName = watch("fullName");
    const currentEmail = watch("email");

    // 1. Fetch User Data AND All Diseases
    const loadData = async () => {
        try {
            const [userRes, diseasesRes] = await Promise.all([
                api.get("/user/specific-user"),
                api.get("/health-diseases/get-all-diseases")
            ]);

            // Handle User Data
            const user = userRes.data?.data;
            if (user) {
                setValue("fullName", user.full_name || "");
                setValue("email", user.email || "");
                setValue("age", user.age || "");
                setValue("weight", user.weight || "");
                setValue("height", user.height || "");
                if (user.gender) setValue("gender", { value: user.gender, label: user.gender });

                // Set existing profile image if available
                if (user.profileimage_uri) {
                    setLocalProfileImage(user.profileimage_uri);
                }

                if (user.diseases && Array.isArray(user.diseases)) {
                    setConditions(user.diseases);
                }
            }

            const list = Array.isArray(diseasesRes.data) ? diseasesRes.data : diseasesRes.data.data || [];
            setAllDiseases(list);

        } catch (error) {
            console.error("Error loading data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, [setValue]);

    // 2. Logic to Add Condition
    const handleAddCondition = async () => {
        const text = inputValue.trim();
        if (!text) return;

        if (conditions.some(c => c.disease.toLowerCase() === text.toLowerCase())) {
            setInputValue("");
            setShowInput(false);
            return;
        }

        try {
            const existing = allDiseases.find(d => d.disease.toLowerCase() === text.toLowerCase());

            if (existing) {
                setConditions([...conditions, existing]);
            } else {
                const addRes = await api.post("/health-diseases/add-disease", { disease: text });
                const newId = addRes.data.id || addRes.data._id;

                const newDiseaseObj = { _id: newId, disease: text };
                setConditions([...conditions, newDiseaseObj]);
                setAllDiseases([...allDiseases, newDiseaseObj]);
            }
            setInputValue("");
            setShowInput(false);
        } catch (err) {
            console.error("Error adding disease", err);
            setApiError("Failed to add disease. Try again.");
        }
    };

    // --- 3. Logic to DELETE Condition ---
    const removeCondition = async (idToRemove) => {
        if (!idToRemove) return;

        try {
            await api.delete(`/health-diseases/delete-disease/${idToRemove}`);
            setConditions((prev) => prev.filter((item) => item._id !== idToRemove));
            setAllDiseases((prev) => prev.filter((item) => item._id !== idToRemove));
        } catch (error) {
            console.error("Failed to delete disease", error);
            setApiError("Failed to delete disease. It might already be removed.");
        }
    };

    // 4. Save Profile & Associate Diseases (Updated Logic)
    const onSaveProfile = async (data) => {
        setApiError("");
        try {
            let finalImageUri = profileImage || localProfileImage; 

            // --- STEP A: Upload Image if selected ---
            if (selectedFile) {
                const formData = new FormData();
                formData.append("file", selectedFile);

                // Upload API Call
                const uploadRes = await api.post("/chat/upload-medical-image", formData, {
                    headers: { "Content-Type": "multipart/form-data" }
                });

                // Get URL from response
                finalImageUri = uploadRes.data.url;
            }

            // --- STEP B: Update Personal Info with Image URL ---
            const profilePayload = {
                full_name: data.fullName,
                age: Number(data.age),
                weight: Number(data.weight),
                height: Number(data.height),
                gender: data.gender.value,
                profileimage_uri: finalImageUri
            };

            await api.post("/user/personal-information", profilePayload);

            // --- STEP C: Associate Diseases ---
            const diseaseIds = conditions.map(c => c._id);
            await api.post("/user/associate-disease", {
                disease: diseaseIds
            });

            // --- STEP D: Update Context with new profile image ---
            updateProfileImage(finalImageUri);

            // Success
            setShowOverlay1(true);
            setTimeout(() => setShowOverlay1(false), 2000);

        } catch (error) {
            console.error("Save Error:", error);
            const message = error.response?.data?.detail || "Update failed! Please try again.";
            setApiError(message);
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (!file.type.startsWith("image/")) return alert("Please upload an image file.");

            setLocalProfileImage(URL.createObjectURL(file));
            setSelectedFile(file);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-10 w-10 border-4 border-primary border-t-transparent"></div>
                <span className="ml-3 text-primarytext">Loading...</span>
            </div>
        );
    }

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
                    {/* Left Column */}
                    <div className='flex flex-col gap-6'>
                        <span className='text-lg font-medium text-primarytext'>Personal Information</span>
                        <div className='border border-bordercolor rounded-xl bg-white p-3 flex items-center'>
                            <div className="relative h-16 w-16">
                                {(localProfileImage || profileImage) ? (
                                    <img src={localProfileImage || profileImage} alt="Profile" className="h-full w-full object-cover rounded-lg" />
                                ) : <SettingProfileIcon className="h-full w-full" />}
                                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageChange} />
                                <button onClick={() => fileInputRef.current.click()} className="absolute bottom-13 -right-1 cursor-pointer ">
                                    <EditIcon />
                                </button>
                            </div>
                            <div className='flex flex-col ml-4'>
                                <span className='text-sm xs:text-lg font-normal text-primarytext truncate max-w-50'>
                                    {currentName || "User"}
                                </span>
                                <span className=' text-xs xs:text-sm font-normal text-secondarytext truncate max-w-50'>
                                    {currentEmail || "email@example.com"}
                                </span>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit(onSaveProfile)} className='border border-bordercolor rounded-xl bg-white p-6 flex flex-col w-full gap-3'>
                            <div>
                                <label className="block text-sm font-normal text-primarytext mb-1 ml-1">Full Name</label>
                                <input {...register("fullName")} type="text" className={`w-full rounded-xl border px-4 py-3 text-sm outline-none ${errors.fullName ? "border-red-500" : "border-bordercolor focus:border-primary"}`} />
                            </div>
                            <div>
                                <label className="block text-sm font-normal text-primarytext mb-1 ml-1">Email</label>
                                <input {...register("email")} disabled type="email" className={`w-full rounded-xl border px-4 py-3 cursor-not-allowed text-sm outline-none ${errors.email ? "border-red-500" : "border-bordercolor focus:border-primary"}`} />
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
                                            <Select {...field} options={genderOptions} classNamePrefix="tw-select" components={{
                                                DropdownIndicator: () => <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-primarytext pointer-events-none" />,
                                                IndicatorSeparator: () => null,
                                            }} />
                                        )}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-normal text-primarytext mb-1 ml-1">Password</label>
                                <input type="password" value="********" disabled className="w-full rounded-xl border border-bordercolor px-4 py-3 text-sm bg-gray-50 opacity-60 cursor-not-allowed" />
                            </div>

                            {apiError && (
                                <div className="w-full bg-warning/10 border border-warning/20 text-warning text-[12px] py-2 px-3 rounded-lg text-center font-medium italic">
                                    {apiError}
                                </div>
                            )}

                            <div className='flex justify-center md:justify-end'>
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
                                <input
                                    type="text"
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    placeholder="Add Health Condition"
                                    className="w-full bg-white rounded-xl border border-bordercolor px-4 py-3 text-sm focus:border-primary outline-none"
                                    onKeyDown={(e) => e.key === "Enter" && handleAddCondition()}
                                />
                                <button onClick={handleAddCondition} className='bg-primary w-24 hover:bg-hoverbtn rounded-full text-white text-sm font-semibold cursor-pointer'>Add</button>
                            </div>
                        )}

                        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 border border-bordercolor rounded-xl bg-white p-6'>
                            {conditions.length > 0 ? (
                                conditions.map((item, index) => (
                                    <div key={item._id || index} className='flex bg-[rgba(47,128,237,0.10)] border-primary border items-center rounded-xl px-4.5 py-3.5 justify-between'>
                                        <span className='text-primary text-xs font-medium truncate'>{item.disease}</span>
                                        <CrossOutlineIcon className="cursor-pointer w-4 h-4 ml-1" onClick={() => removeCondition(item._id)} />
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm text-secondarytext col-span-3 text-center">No conditions added.</p>
                            )}
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
                <div className="fixed inset-0 z-2000 flex  items-center justify-center bg-black/5 backdrop-blur-sm">
                    <div className="bg-white rounded-xl px-10 py-8 flex flex-col items-center gap-4 shadow-xl">
                        <CheckCircle />
                        <p className="text-[22px] font-medium text-primarytext">Changes Saved</p>
                    </div>
                </div>
            )}
        </>
    );
};

export default SettingForm;