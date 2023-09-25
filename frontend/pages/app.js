import Image from "next/image";
import { useState, useEffect } from "react";
import { BsFillArrowUpRightCircleFill } from "react-icons/bs";
import { BsPlusCircleDotted } from "react-icons/bs";
import { BiSolidDashboard } from "react-icons/bi";
import Wrapper from "@/components/Wrapper";
import Stream from "@/components/Stream";
import Dashboard from "@/components/Dashboard";
import { useRouter } from "next/router";
import { useWeb3Modal } from "@web3modal/react";
import { useAccount } from "wagmi";

export default function App() {
  const { open, close } = useWeb3Modal();
  const [wait, setWait] = useState(false);
  const [text, setText] = useState("All Streams");
  const [dash, setDash] = useState(true);
  const [wrap, setWrap] = useState(false);
  const [send, setSend] = useState(false);
  const { address: account, isConnected: connected } = useAccount();
  const router = useRouter();
  async function connect() {
    await open();
  }

  useEffect(() => {
    setWait(true);
  });

  if (!wait) return null;
  return (
    <div className="">
      <div className="flex px-20 desktop:px-40 py-4  items-center justify-between gap-1 border-b-[2px] border-black">
        <button
          className="flex  text-4xl items-center gap-1 "
          onClick={() => router.push("/")}
        >
          <p className="font-['Anton'] tracking-widest uppercase">XDC</p>
        </button>
        {!connected ? (
          <button
            className="bg-[#1db227] hover:bg-green-500 tracking-wide text-[22px] px-10 py-3 rounded-full text-white"
            onClick={connect}
          >
            Connect Wallet
          </button>
        ) : (
          <p className="bg-[#1db227] hover:bg-green-500 tracking-wide text-[22px] px-10 py-3 rounded-full text-white">
            {account.slice(0, 6) + "..." + account.slice(-8)}
          </p>
        )}
      </div>
      <div className="px-20  desktop:px-40 py-6">
        <p className="text-[30px]">{text}</p>
        <div className="flex gap-20 border-[2px] border-black  px-6 py-4 mt-6 text-gray-500">
          <button
            className={`flex gap-2 items-center text-2xl tracking-wider  ${
              dash && "text-black"
            }`}
            onClick={() => {
              setDash(true);
              setWrap(false);
              setSend(false);
              setText("All Streams");
            }}
          >
            <BiSolidDashboard /> Dashboard
          </button>

          <button
            className={`flex gap-2 items-center text-2xl tracking-wider  ${
              wrap && "text-black"
            }`}
            onClick={() => {
              setWrap(true);
              setDash(false);
              setSend(false);
              setText("Wrap / UnWrap");
            }}
          >
            <BsPlusCircleDotted /> Wrap / UnWrap
          </button>
          <button
            className={`flex gap-2 items-center text-2xl tracking-wider  ${
              send && "text-black"
            }`}
            onClick={() => {
              setSend(true);
              setWrap(false);
              setDash(false);
              setText("Send Stream");
            }}
          >
            <BsFillArrowUpRightCircleFill /> Send Stream
          </button>
        </div>
        {wrap && (
          <Wrapper connected={connected} connect={connect} account={account} />
        )}
        {send && <Stream connected={connected} connect={connect} />}
        {dash && <Dashboard connected={connected} connect={connect} />}
      </div>
    </div>
  );
}
