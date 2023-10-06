import { useWeb3Modal } from '@web3modal/react';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { HiMiniArrowsUpDown } from 'react-icons/hi2';
import { useAccount } from 'wagmi';
import { waitForTransaction, writeContract, readContract } from '@wagmi/core';
import { ABI, superToken } from '@/constants';
import { parseEther } from 'viem';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useBalance } from 'wagmi';
import Loader from './Loader';

const WrapComp = () => {
  const [wrap, setWrap] = useState(true);
  const [unwrap, setUnwrap] = useState(false);
  const [hydrate, setHydrate] = useState(false);
  const [value, setValue] = useState(0);
  const [loading, setLoading] = useState(false);
  const { address } = useAccount();
  const { data: xdcBalance } = useBalance({
    address,
  });
  const { data: sxdcBalance } = useBalance({
    address,
    token: superToken,
  });
  const { isConnected } = useAccount();
  const { open } = useWeb3Modal();

  const getPrice = async () => {
    try {
      const data = await readContract({
        address: superToken,
        abi: ABI,
        functionName: 'show',
      });
    } catch (e) {
      console.log('getPrice', e);
    }
  };

  useEffect(() => {
    // getPrice();
  }, []);

  const wrapFn = async () => {
    try {
      setLoading(true);
      const { hash } = await writeContract({
        address: superToken,
        abi: ABI,
        functionName: 'wrap',
        args: [parseEther(value)],
        value: parseEther(value),
      });
      await waitForTransaction({ hash });
      setLoading(false);
      toast.success('Wrapped XDC to sXDC');
    } catch (e) {
      setLoading(false);
      console.log('wrap', e);
    }
  };
  const unWrapFn = async () => {
    try {
      setLoading(true);
      const { hash } = await writeContract({
        address: superToken,
        abi: ABI,
        functionName: 'unwrap',
        args: [parseEther(value)],
      });
      await waitForTransaction({ hash });
      setLoading(false);
      toast.success('Unwrapped sXDC to XDC');
    } catch (e) {
      setLoading(false);
      console.log('wrap', e);
    }
  };

  useEffect(() => {
    setHydrate(true);
  }, [xdcBalance, sxdcBalance]);
  if (!hydrate) {
    return null;
  }
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
              id='wrapAmount'
              onChange={(e) => {
                setValue(e.target.value);
              }}
              value={value}
            />
            <p className='text-sm text-gray-400 '>$ 0.0</p>
          </div>

          {unwrap ? (
            <div>
              <div className='flex gap-2 items-center bg-[#1C1D20] py-3 p-3 rounded-md mb-2 w-[120px]'>
                <Image
                  src='/xdc.png'
                  height={30}
                  width={30}
                  alt='xdc'
                  className='rounded-full border-2 border-yellow-400'
                />
                <p className='font-medium'>sXDC</p>
              </div>
              <p className='text-sm text-gray-400 text-right'>
                Balance: {parseFloat(sxdcBalance?.formatted).toFixed(2)}
              </p>
            </div>
          ) : (
            <div>
              <div className='flex gap-2 items-center bg-[#1C1D20] py-3 pl-3 rounded-md mb-2 w-[120px]'>
                <Image
                  src='/xdc.png'
                  height={30}
                  width={30}
                  alt='xdc'
                  className='rounded-full'
                />
                <p className='font-medium'>XDC</p>
              </div>
              <p className='text-sm text-gray-400 text-right'>
                Balance: {parseFloat(xdcBalance?.formatted).toFixed(2)}
              </p>
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
              id='unWrapAmount'
              value={value}
            />
            <p className='text-sm text-gray-400 '>$ 0.0</p>
          </div>

          {wrap ? (
            <div>
              <div className='flex gap-2 items-center bg-[#1C1D20] py-3 p-3 rounded-md mb-2 w-[120px]'>
                <Image
                  src='/xdc.png'
                  height={30}
                  width={30}
                  alt='xdc'
                  className='rounded-full border-2 border-yellow-400'
                />
                <p className='font-medium'>sXDC</p>
              </div>
              <p className='text-sm text-gray-400 text-right'>
                Balance: {parseFloat(sxdcBalance?.formatted).toFixed(2)}
              </p>
            </div>
          ) : (
            <div>
              <div className='flex gap-2 items-center bg-[#1C1D20] py-3 pl-3 rounded-md mb-2 w-[120px]'>
                <Image
                  src='/xdc.png'
                  height={30}
                  width={30}
                  alt='xdc'
                  className='rounded-full'
                />
                <p className='font-medium'>XDC</p>
              </div>
              <p className='text-sm text-gray-400 text-right'>
                Balance: {parseFloat(xdcBalance?.formatted).toFixed(2)}
              </p>
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

      <p className='text-center mt-4 text-gray-300'>1 sXDC = 1 XDC</p>

      {isConnected ? (
        <button
          type='submit'
          className='bg-green-700/20 w-full mt-8 text-green-500 py-3 hover:bg-green-700/40  tracking-wider   rounded-lg '
          onClick={wrap ? wrapFn : unWrapFn}>
          {loading ? (
            <Loader inComp={true} />
          ) : (
            <p>{wrap ? 'Wrap' : 'Unwrap'} Token</p>
          )}
        </button>
      ) : (
        <button
          type='button'
          onClick={open}
          className='bg-green-700/20 w-full mt-8 text-green-500 py-3 hover:bg-green-700/40  tracking-wider   rounded-lg '>
          Connect Wallet
        </button>
      )}
      <ToastContainer />
    </div>
  );
};

export default WrapComp;
