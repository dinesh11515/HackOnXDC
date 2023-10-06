import Link from 'next/link';
import React, { useState } from 'react';
import { HiMenuAlt3 } from 'react-icons/hi';
import { MdDashboard } from 'react-icons/md';
import { FaWallet } from 'react-icons/fa';
import { FaMoneyBillTrendUp } from 'react-icons/fa6';
import { RiTokenSwapFill } from 'react-icons/ri';
import { AiFillHome } from 'react-icons/ai';
import { IoMdSettings } from 'react-icons/io';

import Image from 'next/image';
import { useRouter } from 'next/router';
import { useAccount } from 'wagmi';
import { useWeb3Modal } from '@web3modal/react';

const links = [
  {
    name: 'Home',
    icon: <AiFillHome size={20} />,
    link: '/',
  },
  {
    name: 'Dashboard',
    icon: <MdDashboard size={20} />,
    link: '/dashboard',
  },
  {
    name: 'Stream',
    icon: <FaMoneyBillTrendUp size={20} />,
    link: '/stream',
  },
  {
    name: 'Wrap / Unwrap',
    icon: <RiTokenSwapFill size={20} />,
    link: '/wrap',
  },

  {
    name: 'Settings',
    icon: <IoMdSettings size={20} />,
    link: '/settings',
    line: true,
  },
];

const Sidebar = () => {
  const [openMenu, setOpenMenu] = useState(false);
  // const { currentAccount } = useContext(WalletContext);

  const router = useRouter();
  const { isConnected, address } = useAccount();
  const { open } = useWeb3Modal();

  return (
    <div
      className={`bg-[#1e1e1e] min-h-screen  ${
        openMenu ? 'w-72' : 'w-16'
      }  text-gray-100 p-3 duration-300`}>
      <div className='flex justify-end'>
        <HiMenuAlt3
          size={25}
          className={`cursor-pointer mb-4 ${!openMenu && 'w-12'}`}
          onClick={() => {
            setOpenMenu(!openMenu);
          }}
        />
      </div>

      {isConnected ? (
        <div
          className={`absolute top-20 flex items-center  p-1 rounded-md bg-black/30  cursor-pointer ${
            openMenu && 'w-fit py-2 pr-2'
          }`}>
          <Image
            src='/gif3.webp'
            alt='img'
            height={35}
            width={35}
            className={`p-1 ${openMenu && 'mr-2'}`}
          />
          <p className={`${!openMenu && 'hidden'}  `}>
            {address.slice(0, 6)}....{address.slice(-6)}
          </p>
        </div>
      ) : (
        <button
          onClick={open}
          className={`absolute top-20 flex items-center  p-1 rounded-md  bg-green-500/30 text-green-200   cursor-pointer ${
            openMenu && 'w-fit py-2 px-2'
          }`}>
          <FaWallet size={20} />
          <p className={`${!openMenu && 'hidden'} w-full ml-4 `}>
            Connect Wallet
          </p>
        </button>
      )}

      <div className='flex flex-col gap-4 realtive mt-40 h-[70vh]'>
        {links.map((link, i) => (
          <Link
            key={link.name}
            href={link.link}
            className={`flex gap-2 items-center font-medium ${
              router.pathname === link.link &&
              'bg-green-700/40 hover:bg-green-700/50'
            }  hover:bg-gray-700/30 rounded-md px-2 py-2 group ${
              link?.line && 'mt-auto'
            }`}>
            <div className=''>{link.icon}</div>
            <p
              style={{
                transitionDelay: `${i + 3}00ms`,
              }}
              className={`whitespace-pre duration-500 ${
                !openMenu && 'opacity-0 translate-x-28 overflow-hidden'
              }`}>
              {link.name}
            </p>
            <p
              className={`${
                openMenu && 'hidden'
              } absolute left-48 z-10 bg-white font-semibold whitespace-pre w-0 text-gray-900 rounded-md drop-shadow-lg shadow-xl p-0  overflow-hidden group-hover:scale-110 group-hover:left-20 group-hover:duration-300 group-hover:w-fit group-hover:px-2 group-hover:py-1`}>
              {link.name}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
