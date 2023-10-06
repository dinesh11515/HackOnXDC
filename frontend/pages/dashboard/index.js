import ActiveStream from '@/components/ActiveStream';
import WalletConnectComp from '@/components/WalletConnectComp';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { MdDashboard } from 'react-icons/md';
import { useAccount } from 'wagmi';
import { readContract } from '@wagmi/core';
import { ABI, superToken } from '@/constants';
import NoStreams from '@/components/NoStreams';

const Dashboard = () => {
  const { address, isConnected } = useAccount();
  const [hydrate, setHydrate] = useState(false);
  const [activeStreams, setActiveStreams] = useState([]);
  const [data, setData] = useState([]);

  const getData = async () => {
    try {
      const dataStr = await readContract({
        address: superToken,
        abi: ABI,
        functionName: 'getOutgoingStreams',
        args: [address],
      });

      setData(dataStr);
      console.log(dataStr);
    } catch (e) {
      console.log('dashboard data', e);
    }
  };

  useEffect(() => {
    if (address) {
      getData();
    }
  }, [address]);

  useEffect(() => {
    setHydrate(true);
  });
  if (!hydrate) {
    return null;
  }

  console.log('dd', data);

  return (
    <div className='bg-[#141414] h-[100vh] text-white font-Poppins px-20 py-20'>
      {isConnected ? (
        <>
          <div className='font-medium  mb-4 text-gray-200 flex items-center gap-3 '>
            <MdDashboard size={20} />
            <p>Dashboard</p>
          </div>

          {data.length ? (
            <div className='flex flex-wrap gap-10'>
              {data.map((i, index) => (
                <ActiveStream
                  data={i}
                  index={index}
                  isActive={i.isOnGoing}
                />
              ))}
            </div>
          ) : (
            <NoStreams />
          )}
        </>
      ) : (
        <WalletConnectComp />
      )}
    </div>
  );
};

export default Dashboard;
