import { Routes, Route, BrowserRouter, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
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
import NotFound from "../pages/NotFound";

const AppRoutes = () => {
  const [currentuser, setCurrentuser] = useState(localStorage.getItem("token"));

  useEffect(() => {
    const checkAuth = () => {
      setCurrentuser(localStorage.getItem("token"));
    };
    window.addEventListener("storage", checkAuth);
    window.addEventListener("auth-change", checkAuth);

    return () => {
      window.removeEventListener("storage", checkAuth);
      window.removeEventListener("auth-change", checkAuth);
    };
  }, []);
  return (
    <BrowserRouter>
      <Routes>
        {/* Protected Chat Routes - Require Authentication */}
        <Route element={<MainLayout />}>
          <Route path="/chat" element={<Chat />} />
          <Route path="/chat/:chatId" element={<ChatConversation />} />
        </Route>

        {/* Auth Routes - Redirect to /chat if already logged in */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={currentuser ? <Navigate to="/chat" replace /> : <Login />} />
          <Route path="/signup" element={currentuser ? <Navigate to="/chat" replace /> : <Signup />} />
          <Route path="/verifyotp" element={currentuser ? <Navigate to="/profilesetup" replace /> : <VerifyOtp />} />
          <Route path="/forgotpassword" element={currentuser ? <Navigate to="/chat" replace /> : <ForgetPassword />} />
          <Route path="/setnewpassword" element={currentuser ? <Navigate to="/chat" replace /> : <SetNewPassword />} />
          <Route path="/profilesetup" element={!currentuser ? <Navigate to="/login" replace /> : <ProfileSetup />} />
        </Route>

        {/* Landing Page - Redirect to /chat if logged in */}
        <Route path="/" element={currentuser ? <Navigate to="/chat" replace /> : <LandingPage />} />
        {/* Protected Settings Route */}
        <Route element={<SettingLayout />}>
          <Route path="/setting" element={currentuser ? <Setting /> : <Navigate to="/login" replace />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;

