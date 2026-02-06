import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Select from "react-select";
import ChevronDown from "../../assets/icons/arrow-down.svg?react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import api from "../../api/axiosInstance";

const genderOptions = [
    { value: "Male", label: "Male" },
    { value: "Female", label: "Female" },
];

const schema = yup.object({
    age: yup.number().typeError("Age must be a number").required("Age is required").positive().integer().min(1).max(120),
    weight: yup.number().typeError("Weight must be a number").required("Weight is required").positive().min(1),
    height: yup.number().typeError("Height must be a number").required("Height is required").positive().min(30),
    gender: yup.object().required("Please select gender").nullable(),
    healthConditions: yup.array().of(yup.string()),
    otherConditions: yup.string().nullable(),
}).required();

const ProfileSetupForm = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [apiError, setApiError] = useState("");
    const [availableDiseases, setAvailableDiseases] = useState([]);

    const { register, handleSubmit, control, watch, setValue, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
        mode: "onChange",
        defaultValues: { healthConditions: [] }
    });

    const inputFields = [
        { name: "age", label: "Age", placeholder: "Enter Your Age" },
        { name: "weight", label: "Weight (kg)", placeholder: "Enter Your Weight" },
        { name: "height", label: "Height (cm)", placeholder: "Enter Your Height" }
    ];

    // 1. Fetch All Diseases on Load

    const fetchDiseases = async () => {
        try {
            const response = await api.get("/health-diseases/get-all-diseases");
            const diseases = Array.isArray(response.data) ? response.data : response.data.data || [];
            setAvailableDiseases(diseases);
        } catch (error) {
            console.error("Failed to fetch diseases", error);
        } finally {
            setLoading(false);
        }
    };
    
    useEffect(() => {

        fetchDiseases();
    }, []);

    const onSubmit = async (data) => {
        setApiError("");
        try {
            let finalConditionIds = [...data.healthConditions];

            if (data.otherConditions && data.otherConditions.trim() !== "") {
                try {
                    const existing = availableDiseases.find(d => d.disease.toLowerCase() === data.otherConditions.toLowerCase());

                    if (existing) {
                        finalConditionIds.push(existing._id);
                    } else {
                        // API call to Add Disease
                        const addResponse = await api.post("/health-diseases/add-disease", {
                            disease: data.otherConditions
                        });
                        // Use 'id' or '_id' based on API response
                        const newId = addResponse.data.id || addResponse.data._id;
                        if (newId) finalConditionIds.push(newId);
                    }
                } catch (err) {
                    console.error("Error adding custom disease", err);
                }
            }

            // --- Step 2: Set Up Profile (Basic Info) ---
            const profilePayload = {
                age: Number(data.age),
                weight: Number(data.weight),
                height: Number(data.height),
                gender: data.gender.value,
            };

            await api.post("/user/set-up-profile", profilePayload);

            // --- Step 3: Associate Diseases (Send IDs) ---
            if (finalConditionIds.length > 0) {
                await api.post("/user/associate-disease", {
                    disease: finalConditionIds
                });
            }

            navigate("/chat");

        } catch (error) {
            const message = error.response?.data?.detail || "Something went wrong. Please try again.";
            setApiError(message);
        }
    };

    if (loading) return <div className="flex justify-center items-center h-64">Loading profile...</div>;

    return (
        <div className="bg-white flex flex-col w-full max-w-191.75 rounded-3xl justify-center items-center border border-bordercolor p-6 gap-3 2xl:gap-6 shadow-[0_4px_40px_0_rgba(235,235,235,0.8)] mx-auto">
            <div className="flex flex-col justify-center items-center gap-2 2xl:gap-3">
                <h1 className="text-center font-semibold text-2xl sm:text-[28px] text-primarytext">Set Up Your Profile</h1>
                <p className="text-center text-sm md:text-base text-secondarytext font-normal max-w-115.75">
                    This information helps tailor general health guidance. You can skip or update it anytime.
                </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="w-full flex flex-col gap-2 2xl:gap-4">
                <div className="flex flex-col gap-4">
                    <h2 className="text-lg font-medium text-primarytext">Basic Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {inputFields.map((field) => (
                            <div key={field.name} className="flex flex-col gap-1.5">
                                <label className="text-sm font-normal text-primarytext ml-1">{field.label}</label>
                                <input
                                    {...register(field.name)}
                                    type="number"
                                    placeholder={field.placeholder}
                                    className={`w-full rounded-xl border px-4 py-3 text-sm focus:outline-none ${errors[field.name] ? "border-warning" : "border-bordercolor focus:border-primary hover:border-primary"}`}
                                />
                                {errors[field.name] && <span className="text-warning text-xs ml-1">{errors[field.name]?.message}</span>}
                            </div>
                        ))}

                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-normal text-primarytext ml-1">Gender</label>
                            <Controller
                                name="gender"
                                control={control}
                                render={({ field }) => (
                                    <Select
                                        {...field}
                                        options={genderOptions}
                                        placeholder="Select Gender"
                                        className={`w-full ${errors.gender ? "tw-select-error" : ""}`}
                                        classNamePrefix="tw-select"
                                        components={{
                                            DropdownIndicator: () => <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-primarytext pointer-events-none" />,
                                            IndicatorSeparator: () => null,
                                        }}
                                    />
                                )}
                            />
                            {errors.gender && <span className="text-warning text-xs ml-1 font-medium">{errors.gender.message}</span>}
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-4">
                    <h2 className="text-lg font-medium text-primarytext">Health Conditions</h2>
                    <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 gap-3">
                        {/* Dynamic Mapping from API Data */}
                        {availableDiseases.map((item) => (
                            <div key={item._id} className="w-full rounded-xl border border-bordercolor px-4 py-3 flex items-center ">
                                <label className="flex items-center gap-2 text-secondarytext cursor-pointer w-full text-sm capitalize">
                                    <input type="checkbox" value={item._id} {...register("healthConditions")} className="accent-primary h-4 w-4 cursor-pointer" />
                                    {item.disease}
                                </label>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-normal text-primarytext ml-1">Other Conditions (Optional)</label>
                    <input {...register("otherConditions")} type="text" placeholder="e.g. Migraines" className="w-full rounded-xl border border-bordercolor px-4 py-3 text-sm focus:outline-none outline-none hover:border-primary focus:border-primary transition-all" />
                </div>
                {apiError && (
                    <div className="mt-2 w-full bg-warning/10 border border-warning/20 text-warning text-[12px] py-2 px-3 rounded-lg text-center font-medium italic">
                        {apiError}
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                    <Link to="/chat" className="p-3.5 font-semibold text-center text-primarytext rounded-full hover:bg-secondarybtn transition-all">Skip for Now</Link>
                    <button type="submit" className="bg-primary p-3.5 cursor-pointer font-semibold text-center text-white rounded-full shadow-lg hover:bg-hoverbtn transition-all active:scale-[0.98]">Save & Continue</button>
                </div>
            </form>
        </div>
    );
};

export default ProfileSetupForm;