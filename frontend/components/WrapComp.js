import Image from 'next/image';
import React, { useState } from 'react';
import { HiMiniArrowsUpDown } from 'react-icons/hi2';

const WrapComp = ({ connected = false, connect }) => {
  const [wrap, setWrap] = useState(true);
  const [unwrap, setUnwrap] = useState(false);

  return (
    <div className='bg-[#1C1D20] rounded-xl w-[600px] py-10 px-6 text-white font-Poppins'>
      <div className='flex mb-5 gap-2'>
        <p
          onClick={() => {
            setWrap(true);
            setUnwrap(false);
          }}
          className={`${
            wrap
              ? 'bg-green-700/20 text-green-500 hover:bg-green-700/40'
              : 'text-gray-400'
          }  hover:bg-[#2A2B2E] py-2 px-6 rounded-md cursor-pointer`}>
          Wrap
        </p>
        <p
          onClick={() => {
            setWrap(false);
            setUnwrap(true);
          }}
          className={`${
            unwrap
              ? 'bg-green-700/20 text-green-500 hover:bg-green-700/40'
              : 'text-gray-400'
          }  hover:bg-[#2A2B2E] py-2 px-6 rounded-md cursor-pointer`}>
          Unwrap
        </p>
      </div>

      <div className={`flex flex-col  gap-3 relative`}>
        <div className='flex justify-between bg-[#2A2B2E] rounded-2xl px-4 py-4 items-center relative'>
          <div>
            <input
              type='number'
              placeholder='0.0'
              className={`py-3 outline-none bg-inherit text-3xl `}
              onWheel={(event) => event.target.blur()}
            />
            <p className='text-sm text-gray-400 '>$ 0.0</p>
          </div>

          {unwrap ? (
            <div>
              <div className='flex gap-2 items-center bg-[#1C1D20] py-3 p-3 rounded-md mb-2 w-[120px]'>
                <Image
                  src='/usdt.png'
                  height={30}
                  width={30}
                  alt='usdt'
                  className='rounded-full border-2 border-yellow-400'
                />
                <p className='font-medium'>xUSDT</p>
              </div>
              <p className='text-sm text-gray-400 text-right'>Balance: 0.124</p>
            </div>
          ) : (
            <div>
              <div className='flex gap-2 items-center bg-[#1C1D20] py-3 pl-3 rounded-md mb-2 w-[120px]'>
                <Image
                  src='/usdt.png'
                  height={30}
                  width={30}
                  alt='usdt'
                  className='rounded-full'
                />
                <p className='font-medium'>USDT</p>
              </div>
              <p className='text-sm text-gray-400 text-right'>Balance: 0.124</p>
            </div>
          )}
        </div>

        <div className='flex justify-between bg-[#2A2B2E] rounded-2xl px-4 py-4 items-center'>
          <div>
            <input
              type='number'
              disabled={wrap}
              placeholder='0.0'
              className={`py-3 outline-none bg-inherit text-3xl cursor-not-allowed`}
              onWheel={(event) => event.target.blur()}
            />
            <p className='text-sm text-gray-400 '>$ 0.0</p>
          </div>

          {wrap ? (
            <div>
              <div className='flex gap-2 items-center bg-[#1C1D20] py-3 p-3 rounded-md mb-2 w-[120px]'>
                <Image
                  src='/usdt.png'
                  height={30}
                  width={30}
                  alt='usdt'
                  className='rounded-full border-2 border-yellow-400'
                />
                <p className='font-medium'>xUSDT</p>
              </div>
              <p className='text-sm text-gray-400 text-right'>Balance: 0.124</p>
            </div>
          ) : (
            <div>
              <div className='flex gap-2 items-center bg-[#1C1D20] py-3 pl-3 rounded-md mb-2 w-[120px]'>
                <Image
                  src='/usdt.png'
                  height={30}
                  width={30}
                  alt='usdt'
                  className='rounded-full'
                />
                <p className='font-medium'>USDT</p>
              </div>
              <p className='text-sm text-gray-400 text-right'>Balance: 0.124</p>
            </div>
          )}
        </div>

        <div
          onClick={() => {
            setUnwrap(!unwrap);
            setWrap(!wrap);
          }}
          className='bg-green-900 p-2 cursor-pointer rounded-full w-fit text-green-300 absolute left-[46%] top-[42%]'>
          <HiMiniArrowsUpDown size={20} />
        </div>
      </div>

      <p className='text-center mt-4 text-gray-300'>1 xUSDT = 1 USDT</p>

      {connected ? (
        <button
          type='submit'
          className='bg-green-700/20 w-full mt-8 text-green-500 py-3 hover:bg-green-700/40  tracking-wider   rounded-lg '>
          {wrap ? 'Wrap' : 'Unwrap'} Token
        </button>
      ) : (
        <button
          type='button'
          onClick={connect}
          className='bg-green-700/20 w-full mt-8 text-green-500 py-3 hover:bg-green-700/40  tracking-wider   rounded-lg '>
          Connect Wallet
        </button>
      )}
    </div>
  );
};

export default WrapComp;
