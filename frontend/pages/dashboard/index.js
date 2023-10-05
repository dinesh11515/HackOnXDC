import ActiveStream from "@/components/ActiveStream";
import WalletConnectComp from "@/components/WalletConnectComp";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { MdDashboard } from "react-icons/md";
import { useAccount } from "wagmi";
import { readContract } from "@wagmi/core";
import { ABI, superToken } from "@/constants";

const Dashboard = () => {
  const { address, isConnected } = useAccount();
  const [hydrate, setHydrate] = useState(false);
  const [data, setData] = useState([]);

  const getData = async () => {
    try {
      const dataStr = await readContract({
        address: superToken,
        abi: ABI,
        functionName: "getOutgoingStreams",
        args: [address],
      });
      setData(dataStr);
      console.log(data);
    } catch (e) {
      console.log("dashboard data", e);
    }
  };

  useEffect(() => {
    if (address) {
      getData();
    }
  }, [address]);

  const DUMMY_DATA = [
    {
      id: "0qo0e-0101",
      asset: "USDT",
      from: "0x123...456",
      to: "0x123899...87878456",
      netFlow: "0.0001",
      streamed: "0.01",
      endDate: "12 Jun 2021",
    },
    {
      id: "0qo0e-0101",
      asset: "USDT",
      from: "0x123...456",
      to: "0x123899...87878456",
      netFlow: "0.0001",
      streamed: "0.01",
      endDate: "12 Jun 2021",
    },
    {
      id: "0qo0e-0101",
      asset: "USDT",
      from: "0x123899...87878456",
      to: "0x123899...87878456",
      netFlow: "0.0001",
      streamed: "0.01",
      endDate: "12 Jun 2021",
    },
  ];

  useEffect(() => {
    setHydrate(true);
  });
  if (!hydrate) {
    return null;
  }

  return (
    <div className="bg-[#141414] h-[100vh] text-white font-Poppins px-20 py-20">
      {isConnected ? (
        <>
          <div className="font-medium  mb-4 text-gray-200 flex items-center gap-3 ">
            <MdDashboard size={20} />
            <p>Dashboard</p>
          </div>

          {/* <div className='bg-[#1C1D20] pt-10  rounded-3xl overflow-hidden'>
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
          </div> */}

          <div className="flex flex-wrap gap-10">
            {data.map((i, index) => (
              <ActiveStream data={i} index={index} />
            ))}
          </div>
        </>
      ) : (
        <WalletConnectComp />
      )}
    </div>
  );
};

export default Dashboard;
