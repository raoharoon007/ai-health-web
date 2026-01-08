import { Outlet } from 'react-router-dom';
import ChatHeader from '../Chat/ChatHeader';

const SettingLayout = () => {
  return (
   <div className="h-screen flex flex-col bg-bodybg overflow-hidden z-0">
      <ChatHeader />

      <div className="flex flex-1 z-30 overflow-hidden">

        <main className="flex-1 flex justify-center overflow-y-auto">
          <Outlet />
        </main>

      </div>
    </div>
  );
}

export default SettingLayout;
