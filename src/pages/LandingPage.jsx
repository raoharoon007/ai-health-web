import ShieldIcon from "../assets/icons/shield-icon.svg?react";
import { Link } from "react-router-dom";

const LandingPage = () => {
  return (
    <div className='bg-bodybg bg-[url("/landing-page-img.png")] bg-no-repeat bg-center bg-cover min-h-screen md:overflow-hidden'>
      <div className="flex flex-col min-h-screen  ">
        <div className="flex-1 flex items-center justify-center">
          <div className="max-w-224.25 mx-auto px-5 flex flex-col items-center sm:pt-4 pt-3 md:pt-0 animate-appear-up">
            <div
              className="flex justify-center items-center gap-3 py-2.5 px-2
                            border border-secondarytext rounded-full
                            mb-4 md:mb-6 xl:mb-8 sm:w-xs"
            >
              <ShieldIcon />
              <p className="text-secondarytext font-medium xs:text-sm text-xs">
                Secure & Private Health Guidance
              </p>
            </div>
            <div
              className="flex flex-col items-center text-center
                            gap-4 md:gap-6 xl:gap-8
                            mb-7 md:mb-12 xl:mb-20"
            >
              <h1 className="font-semibold text-primarytext text-2xl sm:text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl">
                Get general health guidance safely and calmly
              </h1>

              <p
                className="text-base md:text-xl font-normal
                            max-w-xl md:max-w-2xl text-secondarytext"
              >
                An informational AI assistant designed to help you understand
                symptoms and general care. Not a doctor, but here to guide you.
              </p>
            </div>
            <div
              className="grid grid-cols-1 md:grid-cols-2 justify-center items-center
                            gap-4 "
            >
              <Link
                to="/chat"
                className=" bg-primary py-2.5 px-3 font-semibold text-center text-white
                           rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.05)]
                           text-base hover:bg-hoverbtn"
              >
                Talk to Health Assistant
              </Link>

              <Link
                to="/login"
                className=" py-2.5 px-3 font-semibold text-center text-primarytext
                           rounded-full text-base
                           hover:bg-secondarybtn hover:text-primary"
              >
                Login / Signup
              </Link>
            </div>
          </div>
        </div>
        <div className="pb-1.5 xl:pb-2 2xl:pb-3 px-5 max-w-130 xl:max-w-139.75 2xl:max-w-170 mx-auto">
          <p className="text-sm 2xl:text-lg font-semibold text-secondarytext text-center">
            Medical Disclaimer:
            <span className="font-normal text-mutedtext pl-px">
              This AI assistant is for informational purposes only and does not
              provide medical diagnosis or prescription. In case of emergency,
              call your local emergency number immediately.
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
