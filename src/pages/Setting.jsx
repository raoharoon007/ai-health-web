import { Link } from 'react-router-dom';
import Leftarrow from '../assets/icons/Arrow-left.svg?react';
import SettingForm from '../components/Setting/SettingForm';

const Setting = () => {
    return (

        <div className=" h-full w-full bg-bodybg ">
            <div className='px-7.5 xs:px-9.5 sm:px-12.5 py-6'>
                <div className='flex'>
                    <Link to="/chat" className='flex gap-3' >
                        <Leftarrow />
                        <h1 className='text-base text-primarytext font-normal '>Back to Assistant</h1>
                    </Link>
                </div>
                <div className='pt-8.25'>
                    <h1 className=' text-primarytext text-[22px] font-medium'>Account Settings</h1>
                    <span className='text-base text-secondarytext font-normal'>Manage your personal health profile and view past consultations.</span>
                </div>
                <SettingForm />
            </div>
        </div>
    );
}

export default Setting;
