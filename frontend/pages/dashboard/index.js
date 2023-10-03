import Image from 'next/image';
import React from 'react';
import { BsPencilFill } from 'react-icons/bs';
import { HiMiniArrowsRightLeft } from 'react-icons/hi2';
import { MdCancel } from 'react-icons/md';

const Dashboard = () => {
  return (
    <div className='bg-[#141414] h-[100vh] text-white font-Poppins flex flex-col items-center'>
      <div className='mt-32 '>
        <h2 className='text-center text-2xl  text-gray-100'>
          Connect to StreamX
        </h2>
        <p className='text-gray-500 mt-2'>
          Connect your wallet to access the whole application!
        </p>
      </div>

      <div>
        <div className='flex gap-20 mt-10'>
          <div className='bg-[#1C1D20] w-[330px] p-8 rounded-2xl flex flex-col justify-center items-center cursor-pointer hover:bg-[#2a2c31]'>
            <h3 className=''>Get Super Tokens</h3>
            <p className='text-xs text-gray-400'>
              Wrap any token in your wallet
            </p>

            <div className='flex gap-10 mt-5 items-center'>
              <Image
                src='/dai.svg'
                height={40}
                width={40}
                alt='token'
                className='rounded-full'
              />

              <HiMiniArrowsRightLeft
                size={25}
                color='#9FF3FF'
              />

              <Image
                src='/dai.svg'
                height={40}
                width={40}
                alt='token'
                className='border-green-500 border-[2px] rounded-full'
              />
            </div>
          </div>

          <div className='bg-[#1C1D20] w-[330px] p-8 rounded-2xl flex flex-col justify-center items-center cursor-pointer hover:bg-[#2a2c31]'>
            <h3 className=''>Send a stream</h3>
            <p className='text-xs text-gray-400'>
              Stream token to any address on xdc
            </p>

            <div className='flex  mt-5 items-center'>
              <Image
                src='/jazz.png'
                height={50}
                width={50}
                alt='token'
                className='rounded-md'
              />

              <Image
                src='/stream.gif'
                height={20}
                width={70}
                alt='stream'
              />

              <Image
                src='/jazz2.png'
                height={50}
                width={50}
                alt='token'
                className='rounded-md'
              />
            </div>
          </div>
        </div>

        <div className='bg-[#1C1D20] w-full mt-10 p-10 rounded-2xl flex flex-col justify-center items-center cursor-pointer hover:bg-[#2a2c31]'>
          <h3 className=''>Modify and cancel your stream</h3>
          <p className='text-xs text-gray-400'>
            Wanna configure your stream after creating it?
          </p>

          <div className='flex gap-10  mt-5 items-center'>
            <div className='bg-green-700/20 p-2 rounded-md'>
              <BsPencilFill className='text-green-500 text-3xl' />
            </div>

            <div className='bg-red-700/20 p-2 rounded-md'>
              <MdCancel className='text-red-500 text-3xl' />
            </div>
          </div>
        </div>

        <button className='bg-green-500/30 text-green-200 mt-10 py-4 rounded-md w-full'>
          Connect Wallet
        </button>
      </div>
    </div>
  );
};

export default Dashboard;