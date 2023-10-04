import React, { useState } from 'react';

const StreamComp = ({ connected, connect }) => {
  const [streamDetails, setStreamDetails] = useState({
    reciever: '',
    flowRate: '',
    selectedType: '',
  });

  const streamHandler = () => {
    console.log('stream logic here');
  };

  // const sendStream = () => {
  //   try {
  //     let formattedFlowRate = document.getElementById('flowrate').value;
  //     if (timePeriod === 'minute') {
  //       formattedFlowRate /= 60;
  //     } else if (timePeriod === 'hour') {
  //       formattedFlowRate /= 60 * 60;
  //     } else if (timePeriod === 'day') {
  //       formattedFlowRate /= 24 * 60 * 60;
  //     } else if (timePeriod === 'month') {
  //       formattedFlowRate /= 30 * 24 * 60 * 60;
  //     }
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };

  return (
    <>
      <main className=' min-h-screen  py-40'>
        <div className='w-fit mx-auto'>
          <form
            onSubmit={streamHandler}
            className='flex flex-col font-Poppins w-[650px] bg-[#1C1D20] text-gray-400 shadow-2xl rounded-2xl p-10 mx-auto '>
            <div className='bg-green-700/30 text-green-300 py-2 px-3 text-sm rounded-md w-fit mb-8'>
              Send stream
            </div>
            <label
              htmlFor='reciever_address'
              className='mb-1 text-sm text-gray-200'>
              Reciever Address
            </label>
            <input
              required
              className=' py-3 px-2 rounded-md bg-[#2A2B2E] mb-7 outline-none placeholder:text-gray-600'
              id='reciever'
              placeholder='0x00..'
              onChange={(e) => {
                setStreamDetails({
                  ...streamDetails,
                  reciever: e.target.value,
                });
              }}
              value={streamDetails.reciever}
            />

            <div className='flex gap-10'>
              <div className='flex flex-col'>
                <label
                  htmlFor='flow'
                  className='mb-1 text-sm text-gray-200'>
                  Flow Rate
                </label>
                <input
                  required
                  className=' w-[330px] py-3 px-2 rounded-md bg-[#2A2B2E] outline-none mb-7 placeholder:text-gray-600'
                  id='flow'
                  placeholder='0.001'
                  onChange={(e) => {
                    setStreamDetails({
                      ...streamDetails,
                      flowRate: e.target.value,
                    });
                  }}
                  value={streamDetails.flowRate}
                />
              </div>

              <div className='flex flex-col'>
                <label className='mb-1 text-sm text-gray-200'>Time Frame</label>
                <select
                  onChange={(e) => {
                    setStreamDetails({
                      ...streamDetails,
                      selectedType: e.target.value,
                    });
                  }}
                  value={streamDetails.selectedType}
                  id='DataType'
                  name='Type'
                  required
                  className=' p-3 rounded-lg w-[200px]  focus:outline-none bg-[#2A2B2E] outline-none mb-7 placeholder:text-gray-600 '>
                  <option value='Time'>Time</option>
                  <option value='Monthly'>/Month</option>
                  <option value='Daily'>/Day</option>
                  <option value='Hourly'>/Hour</option>
                  <option value='Minute'>/Minute</option>
                  <option value='Second'>/Second</option>
                </select>
              </div>
            </div>

            <label
              htmlFor='company'
              className='mb-1 text-sm text-gray-200'>
              Token
            </label>
            <input
              className='py-3 px-2 rounded-md bg-[#2A2B2E] outline-none cursor-not-allowed mb-7'
              id='company'
              disabled
              placeholder='xUSDT'
            />

            {connected ? (
              <button
                type='submit'
                className='bg-green-700/20 text-green-500 py-3 hover:bg-green-700/40  tracking-wider   rounded-lg '>
                Stream Token
              </button>
            ) : (
              <button
                type='button'
                onClick={connect}
                className='bg-green-700/20 text-green-500 py-3 hover:bg-green-700/40  tracking-wider   rounded-lg '>
                Connect Wallet
              </button>
            )}
          </form>
        </div>
      </main>
    </>
  );
};

export default StreamComp;
