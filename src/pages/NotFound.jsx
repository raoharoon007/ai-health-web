import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4">
      <div className="text-center flex flex-col items-center gap-6 max-w-md">
        <h1 className="text-9xl font-bold text-primary opacity-20">404</h1>
        
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl sm:text-3xl font-semibold text-primarytext">
            Oops! Page Not Found
          </h2>
          <p className="text-secondarytext text-base">
            The page you are looking for doesn't exist or has been moved.
          </p>
        </div>
        <button
          onClick={() => navigate("/")}
          className="w-full sm:w-auto px-8 bg-primary hover:bg-hoverbtn text-white rounded-full py-3.5 font-semibold shadow-lg shadow-primary/10 transition cursor-pointer active:scale-95"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default NotFound;