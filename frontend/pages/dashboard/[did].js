import Image from "next/image";
import React from "react";

const CurrentStream = ({}) => {
  return (
    <div className="bg-[#141414] h-[100vh] flex flex-col text-white font-Poppins px-20 py-20  items-center">
      <div className="mt-28 w-[700px]">
        <p className="text-center text-gray-400 mb-3">Total Amount Streamed</p>
        <div className="flex gap-4 items-center justify-center">
          <Image
            src="/xdc.png"
            height={50}
            width={50}
            alt="usdt"
            className="rounded-full border-2 border-yellow-400"
          />
          <p className="text-6xl">0.89989</p>
          <p className="mt-4 text-green-400 text-lg">sXDC</p>
        </div>

        <div className="w-fit mt-14">
          <div className="flex gap-[335px] ml-4 mb-2 text-gray-300">
            <p>Sender</p>
            <p>Reciever</p>
          </div>

          <div className="flex items-center">
            <div className="flex gap-3 bg-[#1C1D20] py-4 px-6 rounded-lg w-[300px] items-center border-[0.5px] border-gray-600">
              <Image
                src="/gif3.webp"
                height={40}
                width={40}
                className="rounded-md"
              />

              <p>0x51EE....793d</p>
            </div>

            <Image src="/stream.gif" height={40} width={90} alt="stream" />

            <div className="flex gap-3 bg-[#1C1D20] py-4 px-6 rounded-lg w-[300px] items-center border-[0.5px] border-gray-600">
              <Image
                src="/gif2.gif"
                height={40}
                width={40}
                className="rounded-md"
              />

              <p>0x51EE....793d</p>
            </div>
          </div>
        </div>

        <div className="mt-28 flex w-full gap-10">
          <div className="flex-[0.5] flex flex-col gap-2">
            <p className="flex justify-between items-center text-gray-300">
              Start Date : <span>12/10/2022</span>
            </p>
            <p className="flex justify-between items-center text-gray-300">
              Project Liquidation : <span>-</span>
            </p>
          </div>
          <div className="flex-[0.5]  flex flex-col gap-2">
            <p className="flex justify-between items-center text-gray-300">
              Buffer : <span>-</span>
            </p>
            <p className="flex justify-between items-center text-gray-300">
              Network Name : <span>XDC Mainnet</span>
            </p>
            <p className="flex justify-between items-center text-gray-300">
              Transaction Hash : <span>0x8989.....9834</span>
            </p>
          </div>{" "}
        </div>
      </div>
    </div>
  );
};

export default CurrentStream;
