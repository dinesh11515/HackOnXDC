import { BsArrowDownRight, BsArrowUpRight } from "react-icons/bs";

export default function Dashboard({ connected, connect }) {
  const fakeData = [
    {
      from: "0xE643CF465eDE9ad11E152BAb8d3cdC6CBC3712E1",
      incoming: true,
      flowRate: 1000000,
      startTime: 1695627096,
    },
    {
      from: "0xE643CF465eDE9ad11E152BAb8d3cdC6CBC3712E1",
      incoming: false,
      flowRate: 1000000,
      startTime: 1695627096,
    },
    {
      from: "0xE643CF465eDE9ad11E152BAb8d3cdC6CBC3712E1",
      incoming: true,
      flowRate: 1000000,
      startTime: 1695627096,
    },
    {
      from: "0xE643CF465eDE9ad11E152BAb8d3cdC6CBC3712E1",
      incoming: true,
      flowRate: 1000000,
      startTime: 1695627096,
    },
  ];
  return (
    <div>
      {connected ? (
        <div className="flex flex-col items-center border-[2px] border-gray-900 mt-4">
          <div className="flex w-full items-center px-6 py-3">
            <p className="w-[5%]"></p>
            <p className="w-[45%] text-xl text-center">From / To</p>
            <p className="w-[20%] text-xl text-center">Flow Rate Per Sec</p>
            <p className="w-[20%] text-xl text-center">Streamed</p>
            <p className="w-[10%] text-xl text-center">Actions</p>
          </div>
          <div className="w-full">
            {fakeData.map((data, index) => {
              return (
                <div
                  className="flex w-full  items-center px-6 py-3 border-t-[2px] border-gray-900 border-b-0"
                  key={index}
                >
                  {data.incoming ? (
                    <BsArrowDownRight className="text-xl w-[5%] text-green-500" />
                  ) : (
                    <BsArrowUpRight className="text-xl w-[5%] text-red-500" />
                  )}
                  <p className="w-[45%] text-xl text-center">{data.from}</p>
                  <p className="w-[20%] text-xl text-center">{data.flowRate}</p>
                  <p className="w-[20%] text-xl text-center">
                    {(Date.now() / 1000 - data.startTime) * data.flowRate}
                  </p>
                  {data.incoming ? (
                    <p className="w-[10%] text-xl text-green-500 text-center">
                      incoming
                    </p>
                  ) : (
                    <div className="w-[10%] flex items-center flex-col">
                      <button className=" text-xl bg-red-500 text-center text-white rounded-xl py-1 px-4">
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-4 mt-20">
          <p className="text-2xl  ">Connect your wallet to see your streams</p>
          <button
            className="bg-[#1db227] hover:bg-green-500 tracking-wide text-[22px] px-10 py-3 rounded-full text-white"
            onClick={connect}
          >
            Connect Wallet
          </button>
        </div>
      )}
    </div>
  );
}
