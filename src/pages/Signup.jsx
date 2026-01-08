import SignupForm from "../components/Signup/SignupForm";

const Signup = () => {
  return (
    // h-screen aur overflow-hidden taaki scroll na aaye
<div className="bg-bodybg bg-[url('./login-img.png')] bg-no-repeat bg-center bg-cover min-h-screen w-full flex justify-center items-center p-4 sm:p-8 ">
      
      {/* Glassmorphism Container */}
      <div className="w-full max-w-360 mx-auto flex justify-center items-center rounded-3xl bg-white/5 backdrop-blur-xl py-6 md:min-h-[80vh]">
          <SignupForm />
      </div>
      
    </div>
  );
}

export default Signup;;
