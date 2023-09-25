import { useState } from "react";
export default function Stream({ connected, connect }) {
  const [timePeriod, setTimePeriod] = useState("");

  const sendStream = () => {
    try {
      let formattedFlowRate = document.getElementById("flowrate").value;
      if (timePeriod === "minute") {
        formattedFlowRate /= 60;
      } else if (timePeriod === "hour") {
        formattedFlowRate /= 60 * 60;
      } else if (timePeriod === "day") {
        formattedFlowRate /= 24 * 60 * 60;
      } else if (timePeriod === "month") {
        formattedFlowRate /= 30 * 24 * 60 * 60;
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div className="border-[3px] border-gray-400 rounded-xl mt-16 w-[50%] py-7 px-8">
        <p className="text-black text-xl font-bold">Send Stream</p>
        <div className="mt-4">
          <p className="text-lg">Receiver Wallet Address</p>
          <input
            type="text"
            placeholder="Enter Wallet Address"
            className="rounded-lg text-lg py-2 px-2 w-full border-[3px] border-gray-300 focus:outline-none mt-2"
          />
        </div>
        <div className="mt-4">
          <p className="text-lg">Flow Rate</p>
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Flow Rate"
              className=" rounded-lg text-lg py-2 px-2 w-full border-[3px] border-gray-300 focus:outline-none mt-2 "
              id="flowrate"
            />
            <select
              className="  flex items-center border-[3px] border-gray-300 p-2 px-4 rounded-md justify-center outline-none mt-2"
              onChange={(e) => {
                setTimePeriod(e.target.value);
              }}
            >
              <option value="second">/second</option>
              <option value="minute">/minute</option>
              <option value="hour">/hour</option>
              <option value="day">/day</option>
              <option value="month">/month</option>
            </select>
          </div>
        </div>
        <div>
          {connected ? (
            <button className="bg-[#1db227] hover:bg-green-500 tracking-wide text-[22px] px-10 py-3 rounded-lg w-full text-white mt-7">
              Send Stream
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
  );
}
