import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { readContract, writeContract, waitForTransaction } from '@wagmi/core';
import { ABI, superToken } from '@/constants';
import { useRouter } from 'next/router';
import { etherUnits, formatEther, formatUnits } from 'viem';
import { toast } from 'react-toastify';
import CountUp from 'react-countup';
import Loader from '@/components/Loader';
const CurrentStream = ({}) => {
  const router = useRouter();
  const id = router.query.did;
  const { address, isConnected } = useAccount();
  const [hydrate, setHydrate] = useState(false);

  const [balance, setBalance] = useState(0);
  const [data, setData] = useState();
  const [currentEndValue, setCurrentEndValue] = useState(0);
  const [loading, setLoading] = useState(false);

  const getData = async () => {
    try {
      const dataStr = await readContract({
        address: superToken,
        abi: ABI,
        functionName: 'getOutgoingStreams',
        args: [address],
      });

      console.log('dd', dataStr[id]);
      setData(dataStr[id]);
    } catch (e) {
      console.log('dashboard data', e);
    }
  };

  const getBalance = async () => {
    try {
      const balance = await readContract({
        address: superToken,
        abi: ABI,
        functionName: 'tokensSentTillDate',
        args: [address, data?.participant],
      });

      setBalance(parseFloat(formatEther(BigInt(balance))).toFixed(6));
    } catch (error) {
      console.log(error);
    }
  };

  const btwTime = () => {
    return BigInt(Math.floor(Date.now() / 1000)) - BigInt(data?.timestamp || 0);
  };

  const getDate = () => {
    if (data) {
      const timestamp = data.timestamp;
      const timestampInMilliseconds = BigInt(timestamp) * 1000n;
      const date = new Date(Number(timestampInMilliseconds));

      const formattedDate = date.toDateString();
      const formattedTime = date.toLocaleTimeString();
      return [formattedDate, formattedTime];
    }
    return [];
  };

  const cancelStreamHandler = async () => {
    // logic here
    setLoading(true);
    const { hash } = await writeContract({
      address: superToken,
      abi: ABI,
      functionName: 'stopStream',
      args: [data?.participant],
    });

    await waitForTransaction({ hash });
    setLoading(false);
    toast.success('Stream Cancelled');
  };

  useEffect(() => {
    if (address) {
      getData();
    }
  }, [address, id]);

  // useEffect(() => {
  //   getBalance();
  // }, [address, data]);

  useEffect(() => {
    const updateEndValue = () => {
      const newValue = parseFloat(
        formatEther(BigInt(data?.flowRate || 0) * BigInt(btwTime()))
      ).toFixed(6);
      setCurrentEndValue(newValue);
    };

    updateEndValue();
    getBalance();
  }, [data]);

  console.log('balance', balance);

  return (
    <div className='bg-[#141414] h-[100vh] flex flex-col text-white font-Poppins px-20 py-20  items-center'>
      <div className='mt-28 w-[700px]'>
        <p className='text-center text-gray-400 mb-3'>Total Amount Streamed</p>
        <div className='flex gap-4 items-center justify-center'>
          <Image
            src='/xdc.png'
            height={50}
            width={50}
            alt='usdt'
            className='rounded-full border-2 border-yellow-400'
          />
          <p className='text-6xl'>
            {data?.isOnGoing ? (
              <CountUp
                start={balance}
                end={currentEndValue}
                duration={2000}
                separator=' '
                decimals={8}
                delay={0.1}
              />
            ) : (
              balance
            )}
          </p>

          <p className='mt-4 text-green-400 text-lg'>sXDC</p>
        </div>

        <div className='w-fit mt-14'>
          <div className='flex gap-[335px] ml-4 mb-2 text-gray-300'>
            <p>Sender</p>
            <p>Reciever</p>
          </div>

          <div className='flex items-center'>
            <div className='flex gap-3 bg-[#1C1D20] py-4 px-6 rounded-lg w-[300px] items-center border-[0.5px] border-gray-600'>
              <Image
                src='/gif3.webp'
                height={40}
                width={40}
                className='rounded-md'
              />

              <p>
                {address?.slice(0, 6)}...{address?.slice(-4)}
              </p>
            </div>

            <Image
              src='/stream.gif'
              height={40}
              width={90}
              alt='stream'
            />

            <div className='flex gap-3 bg-[#1C1D20] py-4 px-6 rounded-lg w-[300px] items-center border-[0.5px] border-gray-600'>
              <Image
                src='/gif2.gif'
                height={40}
                width={40}
                className='rounded-md'
              />

              <p>
                {data?.participant.slice(0, 6)}...{data?.participant.slice(-4)}
              </p>
            </div>
          </div>
        </div>

        <div className='mt-28 flex w-full gap-10'>
          <div className='flex-[0.5] flex flex-col gap-2'>
            <p className='flex justify-between items-center text-gray-300'>
              Start Date : <span>{getDate()[0]}</span>
            </p>
            <p className='flex justify-between items-center text-gray-300'>
              Time :<span>{getDate()[1]}</span>
            </p>
          </div>
          <div className='flex-[0.5]  flex flex-col gap-2'>
            <p className='flex justify-between items-center text-gray-300'>
              flow Rate : <span>{formatEther(data?.flowRate || 0)}</span>
            </p>
            <p className='flex justify-between items-center text-gray-300'>
              Network Name : <span>XDC Mainnet</span>
            </p>
          </div>{' '}
        </div>

        {data?.isOnGoing && (
          <button
            onClick={cancelStreamHandler}
            className='bg-red-400/30 mt-10 w-full text-red-300 py-3 hover:bg-red-500/20  tracking-wider   rounded-lg '>
            {loading ? <Loader inComp /> : 'Cancel Stream'}
          </button>
        )}
      </div>
    </div>
  );
};

export default CurrentStream;
