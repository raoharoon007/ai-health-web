import { Link } from "react-router-dom";
import Select from "react-select";
import ChevronDown from "../../assets/icons/arrow-down.svg?react";

const genderOptions = [
    { value: "Male", label: "Male" },
    { value: "Female", label: "Female" },
];

const ProfileSetupForm = () => {
    return (
        <div className="bg-white flex flex-col w-full max-w-191.75 rounded-3xl justify-center items-center border border-bordercolor p-6 gap-3 2xl:gap-6 shadow-[0_4px_40px_0_rgba(235,235,235,0.8)] mx-auto">
            
            {/* Header Section */}
            <div className="flex flex-col justify-center items-center gap-2 2xl:gap-3">
                <h1 className="text-center font-semibold text-2xl sm:text-[28px] text-primarytext">
                    Set Up Your Profile
                </h1>
                <p className="text-center text-sm md:text-base text-secondarytext font-normal max-w-115.75">
                    This information helps tailor general health guidance. You can skip or update it anytime.
                </p>
            </div>

            <form className="w-full flex flex-col gap-2 2xl:gap-4">
                {/* Basic Info Section */}
                <div className="flex flex-col gap-4">
                    <h2 className="text-lg font-medium text-primarytext">Basic Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {["Age", "Weight (kg)", "Height (cm)"].map((label) => (
                            <div key={label} className="flex flex-col gap-1.5">
                                <label className="text-sm font-normal text-primarytext ml-1">{label}</label>
                                <input
                                    type="number"
                                    placeholder={`Enter Your ${label.split(' ')[0]}`}
                                    className="w-full rounded-xl border border-bordercolor focus:placeholder-transparent outline-none px-4 py-3 text-sm focus:outline-none hover:border-primary focus:border-primary transition-all"
                                />
                            </div>
                        ))}
                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-normal text-primarytext ml-1">Gender</label>
                            <div className="relative w-full">
                                <Select
                                    options={genderOptions}
                                    placeholder="Select Gender"
                                    className="w-full"
                                    classNamePrefix="tw-select"
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
                </div>

                {/* Health Conditions Section */}
                <div className="flex flex-col gap-4">
                    <h2 className="text-lg font-medium text-primarytext">Health Conditions</h2>
                    <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 gap-3">
                        {["Asthma", "Diabetes", "High Blood Pressure", "Seasonal Allergies", "Arthritis", "Lupus"].map((item) => (
                            <div key={item} className="w-full rounded-xl border border-bordercolor px-4 py-3 flex items-center ">
                                <label className="flex items-center gap-2 text-secondarytext cursor-pointer w-full text-sm">
                                    <input type="checkbox" className="accent-primary  h-4 w-4 cursor-pointer" />
                                    {item}
                                </label>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Other Conditions */}
                <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-normal text-primarytext ml-1">Other Conditions</label>
                    <input
                        type="text"
                        placeholder="e.g. Migraines"
                        className="w-full rounded-xl border border-bordercolor px-4 py-3 text-sm focus:outline-none focus:placeholder-transparent outline-none hover:border-primary focus:border-primary transition-all"
                    />
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                    <Link to="/chat" className="p-3.5 font-semibold text-center text-primarytext rounded-full hover:bg-secondarybtn transition-all">
                        Skip for Now
                    </Link>
                    <Link to="/chat" className="bg-primary p-3.5 font-semibold text-center text-white rounded-full shadow-lg hover:bg-hoverbtn transition-all active:scale-[0.98]">
                        Save & Continue
                    </Link>
                </div>
            </form>
        </div>
    );
}

export default ProfileSetupForm;
