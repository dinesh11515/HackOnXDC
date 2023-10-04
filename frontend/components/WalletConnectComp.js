import { useWeb3Modal } from '@web3modal/react';
import React from 'react';
import { FaWallet } from 'react-icons/fa';

const WalletConnectComp = () => {
  const { open } = useWeb3Modal();

  return (
    <div className='bg-[#1C1D20] py-16 flex justify-center flex-col items-center rounded-2xl'>
      <h2 className='text-xl mb-1'>Wallet not connected</h2>
      <p className='text-gray-300 text-sm mb-5 font-light'>
        Wallet is not connected, please connect your wallet to view the
        information
      </p>

      <button
        onClick={open}
        className={` w-[400px] justify-center gap-3 py-3 flex items-center  p-1 rounded-md  bg-green-500/30 text-green-200 hover:bg-green-500/50   cursor-pointer 
        `}>
        <FaWallet size={20} />
        <p>Connect Wallet</p>
      </button>
    </div>
  );
};

export default WalletConnectComp;
