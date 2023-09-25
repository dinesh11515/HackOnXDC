import { useState } from "react";
import Image from "next/image";
import { BsArrowDownCircleFill } from "react-icons/bs";
export default function Wrapper({ connected, connect, account }) {
  const [wrap, setWrap] = useState(true);
  const [amount, setAmount] = useState();

  return (
    <>
      <div className="flex flex-col items-center ">
        <div className="border-[3px] border-gray-300 rounded-xl mt-16 w-[50%] py-7 px-8">
          <div className="flex gap-4 items-center ">
            <button
              className={`${
                wrap && "bg-[#b4fab9] text-[#1f5f23]"
              } px-4 py-2 rounded-lg text-xl`}
              onClick={() => setWrap(true)}
            >
              Wrap
            </button>
            <button
              className={`${
                !wrap && "bg-[#b4fab9] text-[#1f5f23]"
              } px-4 py-2 rounded-lg text-xl`}
              onClick={() => setWrap(false)}
            >
              Unwrap
            </button>
          </div>
          <div>
            <div className="flex items-center justify-between border-[2px] border-gray-300 hover:ring-1 hover:ring-green-500 rounded-lg mt-5 px-4 py-2">
              <input
                type="text"
                placeholder="0.0"
                className="rounded-lg text-2xl w-[80%] focus:outline-none "
                onChange={(e) => setAmount(e.target.value)}
              />
              {wrap ? (
                <div className="flex item-center gap-2 border-[2px] border-gray-300 text-xl px-4 py-2 rounded-xl">
                  <Image
                    src="/tether.png"
                    width={28}
                    height={14}
                    alt="logo"
                    className="rounded-full"
                  ></Image>
                  <p>USDT</p>
                </div>
              ) : (
                <div className="flex item-center gap-2 border-[2px] border-gray-300 text-xl px-4 py-2 rounded-xl">
                  <p>xUSDT</p>
                </div>
              )}
            </div>
            <div className="mt-1 flex flex-col items-center text-3xl text-[#1db227]">
              <button onClick={() => setWrap(!wrap)}>
                <BsArrowDownCircleFill />
              </button>
            </div>
            <div className="flex items-center justify-between border-[2px] border-gray-300 rounded-lg mt-1 px-4 py-2">
              <input
                type="text"
                placeholder="0.0"
                value={amount}
                className="rounded-lg bg-white text-2xl w-[80%] focus:outline-none "
                disabled
              />
              {!wrap ? (
                <div className="flex item-center gap-2 border-[2px] border-gray-300 text-xl px-4 py-2 rounded-xl">
                  <Image
                    src="/tether.png"
                    width={28}
                    height={14}
                    alt="logo"
                    className="rounded-full"
                  ></Image>
                  <p>USDT</p>
                </div>
              ) : (
                <div className="flex item-center gap-2 border-[2px] border-gray-300 text-xl px-4 py-2 rounded-xl">
                  <p>xUSDT</p>
                </div>
              )}
            </div>
          </div>
          <div>
            {connected ? (
              <button className="bg-[#1db227] hover:bg-green-500 tracking-wide text-[22px] px-10 py-3 rounded-lg w-full text-white mt-7">
                {wrap ? "Wrap" : "Unwrap"}
              </button>
            ) : (
              <button
                className="bg-[#1db227] hover:bg-green-500 tracking-wide text-[22px] px-10 py-3 rounded-lg w-full text-white mt-7"
                onClick={connect}
              >
                Connect Wallet
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
