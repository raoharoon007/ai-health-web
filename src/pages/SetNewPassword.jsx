import SetNewPasswordform from '../components/SetNewPassword/SetNewPasswordform';

const SetNewPassword = () => {
  return (
    <div className='bg-bodybg bg-[url("/login-img.png")] bg-no-repeat bg-center bg-cover min-h-screen w-full flex justify-center items-center p-4 sm:p-8'>

      <div className="w-full max-w-360 mx-auto flex justify-center items-center rounded-3xl bg-white/5 backdrop-blur-xl py-6 md:min-h-[80vh]">
        <div className="bg-white flex flex-col w-full max-w-115.5 rounded-3xl justify-center items-center border border-bordercolor p-6 gap-6 shadow-[0_4px_40px_0_rgba(235,235,235,0.8)] mx-4">

          {/* Header Section */}
          <div className="flex flex-col justify-center items-center gap-2 md:gap-3">
            <h1 className="text-center font-semibold text-2xl sm:text-[28px] text-primarytext">
              Set New Password
            </h1>
            <p className="text-center text-base text-secondarytext font-normal self-stretch max-w-115.5">
              Choose a strong password to secure your account.
            </p>
            <SetNewPasswordform />
          </div>
        </div>
      </div>


    </div>
  );
}

export default SetNewPassword;
