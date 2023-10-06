import { useRouter } from 'next/router';
import React from 'react';

const NoStreams = () => {
  const router = useRouter();
  return (
    <div className='bg-[#1C1D20] py-16 flex justify-center flex-col items-center rounded-2xl'>
      <h2 className='text-xl mb-1'>No streams yet!</h2>
      <p className='text-gray-300 text-sm mb-5 font-light'>
        You don't have any active streams yet. Start streaming now!
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
  );
};

export default NoStreams;
