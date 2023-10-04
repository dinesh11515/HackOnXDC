import WalletConnectComp from '@/components/WalletConnectComp';
import Image from 'next/image';
import React from 'react';
import { MdDashboard } from 'react-icons/md';
import { useAccount } from 'wagmi';

const Dashboard = () => {
  const { isConnected } = useAccount();

  const DUMMY_DATA = [
    {
      asset: 'USDT',
      from: '0x123...456',
      to: '0x123...456',
      netFlow: '0.0001',
      streamed: '0.01',
      endDate: '12 Jun 2021',
    },
    {
      asset: 'USDT',
      from: '0x123...456',
      to: '0x123...456',
      netFlow: '0.0001',
      streamed: '0.01',
      endDate: '12 Jun 2021',
    },
    {
      asset: 'USDT',
      from: '0x123...456',
      to: '0x123...456',
      netFlow: '0.0001',
      streamed: '0.01',
      endDate: '12 Jun 2021',
    },
  ];

  return (
    <div className='bg-[#141414] h-[100vh] text-white font-Poppins px-20 py-20'>
      {isConnected ? (
        <>
          <div className='font-medium  mb-4 text-gray-200 flex items-center gap-3 '>
            <MdDashboard size={20} />
            <p>Dashboard</p>
          </div>

          <div className='bg-[#1C1D20] pt-10  rounded-3xl overflow-hidden'>
            <p className='font-medium text-xl text-green-400 px-10  border-b-[0.2px] pb-4 border-gray-400'>
              Active Streams
            </p>
            <table className='w-full text-center '>
              <tr>
                <th className='py-6 font-medium'>Asset</th>
                <th className='py-6 font-medium'>From / To</th>
                <th className='py-6 font-medium'>Net Flow</th>
                <th className='py-6 font-medium'>Streamed</th>
                <th className='py-6 font-medium'>End date</th>
              </tr>

              {DUMMY_DATA.map((data) => (
                <tr className='bg-[#292a2c] hover:bg-[#2d2f31]'>
                  <td className='py-5 '>
                    <div className='flex justify-center items-center gap-2'>
                      <Image
                        src='/usdt.png'
                        height={25}
                        width={25}
                        alt='usdt'
                        className='rounded-full '
                      />
                      <p>{data.asset}</p>
                    </div>
                  </td>
                  <td>{data.to}</td>
                  <td>{data.netFlow}</td>
                  <td>{data.streamed}</td>
                  <td>{data.endDate}</td>
                </tr>
              ))}
            </table>
          </div>
        </>
      ) : (
        <WalletConnectComp />
      )}
    </div>
  );
};

export default Dashboard;
