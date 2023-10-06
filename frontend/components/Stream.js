import React, { useEffect, useState } from 'react';
import { useContractWrite } from 'wagmi';
import { ABI, superToken } from '@/constants';
import { useAccount } from 'wagmi';
import { useWeb3Modal } from '@web3modal/react';
import { waitForTransaction, writeContract, readContract } from '@wagmi/core';
import { parseEther } from 'viem';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loader from './Loader';
const StreamComp = () => {
  const { open, close } = useWeb3Modal();
  const [hydrate, setHydrate] = useState(false);
  const [loading, setLoading] = useState(false);
  const { isConnected } = useAccount();
  const [streamDetails, setStreamDetails] = useState({
    reciever: '',
    flowRate: '',
    selectedType: '',
  });

  const { data, isLoading, isSuccess, write } = useContractWrite({
    address: superToken,
    abi: ABI,
    functionName: 'createStream',
    args: [streamDetails.flowRate, streamDetails.reciever],
  });

  const streamHandler = async (e) => {
    setLoading(true);
    try {
      e.preventDefault();
      let formattedFlowRate = streamDetails.flowRate;
      if (streamDetails.selectedType === 'Minute') {
        formattedFlowRate /= 60;
      } else if (streamDetails.selectedType === 'Day') {
        formattedFlowRate /= 24 * 60 * 60;
      } else if (streamDetails.selectedType === 'Month') {
        formattedFlowRate /= 30 * 24 * 60 * 60;
      }

      const { hash } = await writeContract({
        address: superToken,
        abi: ABI,
        functionName: 'createStream',
        args: [parseEther(formattedFlowRate + ''), streamDetails.reciever],
      });
      await waitForTransaction({ hash });
      toast.success('Created Stream');
      setLoading(false);
    } catch (e) {
      setLoading(false);
    }
  };
  useEffect(() => {
    setHydrate(true);
  });
  if (!hydrate) {
    return null;
  }
  return (
    <>
      <main className=' min-h-screen  py-28'>
        <div className='w-fit mx-auto'>
          <form
            onSubmit={streamHandler}
            className='flex flex-col font-Poppins w-[650px] bg-[#1C1D20] text-gray-400 shadow-2xl rounded-2xl p-10 mx-auto '>
            <div className='bg-green-700/30 text-green-300 py-2 px-3 text-sm rounded-md w-fit mb-8'>
              Send stream
            </div>
            <label
              htmlFor='reciever_address'
              className='mb-1 text-sm text-gray-200'>
              Reciever Address
            </label>
            <input
              required
              className=' py-3 px-2 rounded-md bg-[#2A2B2E] mb-7 outline-none placeholder:text-gray-600'
              id='reciever'
              placeholder='0x00..'
              onChange={(e) => {
                setStreamDetails({
                  ...streamDetails,
                  reciever: e.target.value,
                });
              }}
              value={streamDetails.reciever}
            />

            <div className='flex gap-10'>
              <div className='flex flex-col'>
                <label
                  htmlFor='flow'
                  className='mb-1 text-sm text-gray-200'>
                  Flow Rate
                </label>
                <input
                  required
                  className=' w-[330px] py-3 px-2 rounded-md bg-[#2A2B2E] outline-none mb-7 placeholder:text-gray-600'
                  id='flow'
                  placeholder='0.001'
                  onChange={(e) => {
                    setStreamDetails({
                      ...streamDetails,
                      flowRate: e.target.value,
                    });
                  }}
                  value={streamDetails.flowRate}
                />
              </div>

              <div className='flex flex-col'>
                <label className='mb-1 text-sm text-gray-200'>Time Frame</label>
                <select
                  onChange={(e) => {
                    setStreamDetails({
                      ...streamDetails,
                      selectedType: e.target.value,
                    });
                  }}
                  value={streamDetails.selectedType}
                  id='DataType'
                  name='Type'
                  required
                  className=' p-3 rounded-lg w-[200px]  focus:outline-none bg-[#2A2B2E] outline-none mb-7 placeholder:text-gray-600 '>
                  <option value='Time'>Time</option>
                  <option value='Month'>/Month</option>
                  <option value='Day'>/Day</option>
                  <option value='Minute'>/Minute</option>
                  <option value='Second'>/Second</option>
                </select>
              </div>
            </div>

            <label
              htmlFor='company'
              className='mb-1 text-sm text-gray-200'>
              Token
            </label>
            <input
              className='py-3 px-2 rounded-md bg-[#2A2B2E] outline-none cursor-not-allowed mb-7'
              id='company'
              disabled
              placeholder='sXDC'
            />

            {isConnected ? (
              <button
                type='submit'
                className='bg-green-700/20 text-green-500 py-3 hover:bg-green-700/40  tracking-wider   rounded-lg '>
                {loading ? <Loader inComp={true} /> : 'Stream Token'}
              </button>
            ) : (
              <button
                type='button'
                onClick={() => open()}
                className='bg-green-700/20 text-green-500 py-3 hover:bg-green-700/40  tracking-wider   rounded-lg '>
                Connect Wallet
              </button>
            )}
          </form>
        </div>
        <ToastContainer />
      </main>
    </>
  );
};

export default StreamComp;
