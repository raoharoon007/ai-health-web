import { Link } from "react-router-dom";

const AuthOverlay = ({ isOpen }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-999 flex items-center justify-center bg-black/30 backdrop-blur-sm px-5">
      <div className="bg-white rounded-3xl p-8 max-w-135.25 w-full shadow-2xl text-center animate-appear-up">
        <h2 className="text-[22px] font-medium text-primarytext mb-3">
          Sign in to Continue
        </h2>
        <p className="text-secondarytext font-normal text-center text-base mb-8 ">
          Please log in to start a conversation and receive general health guidance.
        </p>
        
        <div className="flex xs:flex-row flex-col gap-2.5 items-center justify-center">
          <Link
            to="/signup"
            className="flex-1 p-2.5 w-full bg-secondarybtn text-primary text-sm font-semibold rounded-full hover:bg-secondarybtn  text-center"
          >
            Create Account
          </Link>
          <Link
            to="/login"
            className="flex-1 p-2.5 w-full bg-primary text-white text-base font-semibold rounded-full hover:bg-hoverbtn  text-center"
          >
            Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AuthOverlay;