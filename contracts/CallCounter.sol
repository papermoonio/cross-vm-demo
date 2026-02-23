// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

interface ICounter {
    function inc() external;
}

contract CallCounter {
    function callInc(address counter) public {
        ICounter(counter).inc();
    }
}
