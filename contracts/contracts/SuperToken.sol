//SPDX-License-Identifier: MIT

pragma solidity >=0.7.0 <0.9.0;

contract SuperToken {
    event tokenMinted(address receiver, uint value);

    struct transaction {
        uint flowRate;
        uint timestamp;
        bool isOnGoing;
        address participant;
    }

    //static balance of each account address
    //! static balance not dynamic balance
    mapping(address => uint) internal balance;

    mapping(address => transaction[]) public incomingStreams;
    mapping(address => transaction[]) public outgoingStreams;

    mapping(address => mapping(address => uint)) public tokensSentTillDate;

    /**
     * send real token in the contract to receive the 1:1 Super token (wrap tokens)
     */
    function deposit() external payable {
        require(msg.value > 0, "NOT ENOUGH TOKEN SENT");
        balance[msg.sender] += msg.value;

        emit tokenMinted(msg.sender, msg.value);
    }

    /**
     * send super tokens back to the smart contract to unwrap it to erc20 token
     * @param amount  the amount of tokens you want to burn
     */
    function burn(uint amount) external {
        require(balance[msg.sender] >= amount, "NOT ENOUGH BALANCE");

        balance[msg.sender] -= amount;

        (bool success, ) = msg.sender.call{value: amount}("");

        require(success, "TRANSACTION FAILED");
    }

    /**
     *
     * @param _flowRate is the flowRate per second
     * @param _receiver is the address of the receiver
     */
    function transfer(uint _flowRate, address _receiver) external {
        //check if user has enough balance to start a stream for 10 sec
        require(balance[msg.sender] > _flowRate * 10, "NOT ENOUGH BALANCE");

        transaction[] memory currentlyOutgoingStreams = outgoingStreams[
            msg.sender
        ];

        for (uint i = 0; i < currentlyOutgoingStreams.length; i++) {
            if (
                currentlyOutgoingStreams[i].participant == _receiver &&
                currentlyOutgoingStreams[i].isOnGoing
            ) {
                revert("TRANSACTION ALREADY ONGOING");
            } else if (
                // stream exist but is not on going then upadte that stream only instead of creating a new one
                currentlyOutgoingStreams[i].participant == _receiver &&
                !currentlyOutgoingStreams[i].isOnGoing
            ) {
                outgoingStreams[msg.sender][i].isOnGoing = true;
                outgoingStreams[msg.sender][i].flowRate = _flowRate;
                outgoingStreams[msg.sender][i].timestamp = block.timestamp;
                incomingStreams[_receiver][i].isOnGoing = true;
                incomingStreams[_receiver][i].flowRate = _flowRate;
                incomingStreams[_receiver][i].timestamp = block.timestamp;

                return;
            }
        }
        /**
         * update the outgoing streams
         */
        outgoingStreams[msg.sender].push(
            transaction(_flowRate, block.timestamp, true, _receiver)
        );

        /**
         * update the incoming streams
         */
        incomingStreams[_receiver].push(
            transaction(_flowRate, block.timestamp, true, msg.sender)
        );
    }

    /**
     * returns the balance between 2 parties of the current ongoing stream otherwise returns zero
     * @param _receiver is the address of the receiver
     */
    function getTokensSent(address _receiver) external view returns (uint) {
        uint tokens;

        for (uint i = 0; i < outgoingStreams[msg.sender].length; i++) {
            if (
                outgoingStreams[msg.sender][i].participant == _receiver &&
                outgoingStreams[msg.sender][i].isOnGoing
            ) {
                tokens =
                    (block.timestamp -
                        outgoingStreams[msg.sender][i].timestamp) *
                    outgoingStreams[msg.sender][i].flowRate;
                return tokens;
            }
        }

        return 0;
    }

    function balanceOf() external view returns (uint userBalance) {
        uint incomingBalance = 0;
        uint outgoingBalance = 0;

        /**
         * calculate the total balance that has been streamed to you by now
         */
        for (uint i = 0; i < incomingStreams[msg.sender].length; i++) {
            if (incomingStreams[msg.sender][i].isOnGoing == true) {
                incomingBalance +=
                    (block.timestamp -
                        incomingStreams[msg.sender][i].timestamp) *
                    incomingStreams[msg.sender][i].flowRate;
            }
        }

        /**
         * calculate the total balance that has been stream from you by now
         */
        for (uint i = 0; i < outgoingStreams[msg.sender].length; i++) {
            if (outgoingStreams[msg.sender][i].isOnGoing == true) {
                outgoingBalance +=
                    (block.timestamp -
                        outgoingStreams[msg.sender][i].timestamp) *
                    outgoingStreams[msg.sender][i].flowRate;
            }
        }

        /**
         * outgoing balance <= incoming balance + static balance
         */
        // if(outgoingBalance > incomingBalance + balance[msg.sender]) {
        // do something
        // }

        userBalance = (balance[msg.sender] + incomingBalance) - outgoingBalance;
        return userBalance;
    }

    /**
     * stops the streams between 2 parties and updates the tokensSent till dat
     * !still need to check if the total streamed is more than user balance (add that check also)
     * @param _receiver is the address of the receiver
     */
    function stopStream(address _receiver) external {
        for (uint i = 0; i < outgoingStreams[msg.sender].length; i++) {
            if (
                outgoingStreams[msg.sender][i].participant == _receiver &&
                outgoingStreams[msg.sender][i].isOnGoing == true
            ) {
                outgoingStreams[msg.sender][i].isOnGoing = false;
                incomingStreams[_receiver][i].isOnGoing = false;

                tokensSentTillDate[msg.sender][_receiver] +=
                    (block.timestamp -
                        outgoingStreams[msg.sender][i].timestamp) *
                    outgoingStreams[msg.sender][i].flowRate;
            }
        }
    }

    fallback() external payable {}

    receive() external payable {}
}
