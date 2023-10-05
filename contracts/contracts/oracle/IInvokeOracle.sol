// SPDX-License-Identifier: MIT

pragma solidity ^0.8.18;

interface IInvokeOracle {
    function requestData(address _caller) external returns (bytes32 requestId);

    function showPrice() external view returns (uint256);

    function showLatestPrice(
        bytes32 _requestId
    ) external view returns (uint256);
}
