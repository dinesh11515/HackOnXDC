import WalletConnectComp from '@/components/WalletConnectComp';
import { useRouter } from 'next/router';
import React from 'react';

const index = () => {
  const router = useRouter();
  return (
    <div className='bg-[#141414] h-[100vh] text-white font-Poppins px-20 py-20'>
      <div className='bg-[#1C1D20] py-16 flex justify-center flex-col items-center rounded-2xl'>
        <h2 className='text-xl mb-1'>Coming Soon!</h2>
        <p className='text-gray-300 text-sm mb-5 font-light'>
          This page is under construction, please check back later
        </p>

        <button
          onClick={() => {
            router.push('/stream');
          }}
          className={` w-[400px] justify-center gap-3 py-3 flex items-center  p-1 rounded-md  bg-green-500/30 text-green-200 hover:bg-green-500/50   cursor-pointer
        `}>
          <p>Stream Tokens</p>
        </button>
      </div>
    </div>
  );
};

export default index;
