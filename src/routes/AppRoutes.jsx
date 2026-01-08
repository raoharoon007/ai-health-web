import { Routes, Route, BrowserRouter } from "react-router-dom";
import MainLayout from "../components/layouts/MainLayout";
import AuthLayout from "../components/layouts/AuthLayout";
import LandingPage from "../pages/LandingPage";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import VerifyOtp from "../pages/VerifyOtp";
import ForgetPassword from "../pages/ForgetPassword";
import SetNewPassword from "../pages/SetNewPassword";
import ProfileSetup from "../pages/ProfileSetup";
import Chat from "../pages/Chat";
import ChatConversation from "../pages/ChatConversation";
import SettingLayout from "../components/layouts/SettingLayout";
import Setting from "../pages/Setting";

const AppRoutes = () => {
  return (
    <BrowserRouter>
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/chat" element={<Chat/>}/>
        <Route path="/chat/:chatId" element={<ChatConversation />} />
      </Route>
      <Route element={<AuthLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/verifyotp" element={<VerifyOtp/>}/>
        <Route path="/forgotpassword" element={<ForgetPassword/>}/>
        <Route path="/setnewpassword" element={<SetNewPassword/>}/>
        <Route path="/profilesetup" element={<ProfileSetup/>}/>
       
      </Route>
       <Route element={<SettingLayout />}>
        <Route path="/setting" element={<Setting/>}/>
      </Route>
    </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
