import Image from "next/image";
import { useRouter } from "next/router";
import React from "react";
import { useAccount } from "wagmi";

const ActiveStream = ({ data, index }) => {
  const { address } = useAccount();
  const router = useRouter();

  return (
    <div
      onClick={() => {
        router.push(`/dashboard/${index}`);
      }}
      className="bg-[#1C1D20] pb-8 px-8 rounded-2xl w-fit font-Poppins hover:bg-[#2a2b2f] cursor-pointer"
    >
      <div className="bg-green-700/30 text-green-300 py-1 px-3 text-sm rounded-b-md w-fit mb-6">
        Active
      </div>

      <div className="flex items-center">
        <div className="flex gap-3 items-center bg-[#161719] p-2 rounded-md px-4">
          <Image
            src="/gif3.webp"
            height={40}
            width={40}
            className="rounded-md"
          />
          <div>
            <p className="text-xs font-thin text-gray-200">
              {address.slice(0, 6)}...{address.slice(-4)}
            </p>
            <div className="w-[40px] h-2 bg-gray-500 rounded-md mt-1"></div>
          </div>
        </div>
        <Image src="/stream.gif" height={20} width={70} alt="stream" />
        <div className="flex gap-3 items-center bg-[#161719] p-2 rounded-md px-4">
          <Image
            src="/gif2.gif"
            height={40}
            width={40}
            className="rounded-md"
          />
          <div>
            <p className="text-xs font-thin text-gray-200">
              {data.participant.slice(0, 6)}...{data.participant.slice(-4)}
            </p>
            <div className="w-[40px] h-2 bg-gray-500 rounded-md mt-1"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActiveStream;
