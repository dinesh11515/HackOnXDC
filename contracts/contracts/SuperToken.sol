// SPDX-License-Identifier: MIT

pragma solidity ^0.8.18;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol";
import "@openzeppelin/contracts/utils/Context.sol";
import "./oracle/IInvokeOracle.sol";

contract SuperToken is Context, IERC20, IERC20Metadata {
    event tokenMinted(address receiver, uint value);
    struct transaction {
        uint flowRate;
        uint timestamp;
        bool isOnGoing;
        address participant;
    }
    mapping(address => transaction[]) public incomingStreams;
    mapping(address => transaction[]) public outgoingStreams;

    mapping(address => mapping(address => uint)) public tokensSentTillDate;
    mapping(address => int256) private _balances;

    mapping(address => mapping(address => uint256)) private _allowances;

    uint256 private _totalSupply;

    string private _name;
    string private _symbol;
    address CONTRACTADDR = 0x443446eB0b55fB47c0B8aB5814Da38eC9c2eC5D1;
    bytes32 public requestId;
    address private owner;

    /**
     * @dev Sets the values for {name} and {symbol}.
     *
     * All two of these values are immutable: they can only be set once during
     * construction.
     */
    constructor(string memory name_, string memory symbol_) {
        _name = name_;
        _symbol = symbol_;
        owner = msg.sender;
    }

    /* VIEW FUCNTIONS */

    /**
     * @dev Returns the name of the token.
     */
    function name() public view virtual override returns (string memory) {
        return _name;
    }

    /**
     * @dev Returns the symbol of the token, usually a shorter version of the
     * name.
     */
    function symbol() public view virtual override returns (string memory) {
        return _symbol;
    }

    /**
     * @dev Returns the number of decimals used to get its user representation.
     * For example, if `decimals` equals `2`, a balance of `505` tokens should
     * be displayed to a user as `5.05` (`505 / 10 ** 2`).
     *
     * Tokens usually opt for a value of 18, imitating the relationship between
     * Ether and Wei. This is the default value returned by this function, unless
     * it's overridden.
     *
     * NOTE: This information is only used for _display_ purposes: it in
     * no way affects any of the arithmetic of the contract, including
     * {IERC20-balanceOf} and {IERC20-transfer}.
     */
    function decimals() public view virtual override returns (uint8) {
        return 18;
    }

    /**
     * @dev See {IERC20-totalSupply}.
     */
    function totalSupply() public view virtual override returns (uint256) {
        return _totalSupply;
    }

    function getOutgoingStreams(
        address address_
    ) public view returns (transaction[] memory) {
        return outgoingStreams[address_];
    }

    function getIncomingStreams(
        address address_
    ) public view returns (transaction[] memory) {
        return incomingStreams[address_];
    }

    /**
     * @dev See {IERC20-balanceOf}.
     */
    function balanceOf(
        address account
    ) public view virtual override returns (uint256) {
        uint incomingBalance = 0;
        uint outgoingBalance = 0;

        /**
         * calculate the total balance that has been streamed to you by now
         */
        for (uint i = 0; i < incomingStreams[account].length; i++) {
            if (incomingStreams[account][i].isOnGoing == true) {
                incomingBalance +=
                    (block.timestamp - incomingStreams[account][i].timestamp) *
                    incomingStreams[account][i].flowRate;
            }
        }

        /**
         * calculate the total balance that has been stream from you by now
         */
        for (uint i = 0; i < outgoingStreams[account].length; i++) {
            if (outgoingStreams[account][i].isOnGoing == true) {
                outgoingBalance +=
                    (block.timestamp - outgoingStreams[account][i].timestamp) *
                    outgoingStreams[account][i].flowRate;
            }
        }

        /**
         * outgoing balance <= incoming balance + static balance
         */
        // if(outgoingBalance > incomingBalance + balance[msg.sender]) {
        // do something
        // }

        int userBalance = ((_balances[account] + int(incomingBalance)) -
            int(outgoingBalance));

        if (userBalance < 0) {
            return 0;
        }

        return uint(userBalance);
    }

    /**
     * @dev See {IERC20-allowance}.
     */
    function allowance(
        address owner,
        address spender
    ) public view virtual override returns (uint256) {
        return _allowances[owner][spender];
    }

    /**
     * send real token in the contract to receive the 1:1 Super token (wrap tokens)
     */
    function wrap(uint _amount) external payable {
        require(msg.value >= _amount, "amount not matched");
        _mint(msg.sender, _amount);

        emit tokenMinted(msg.sender, _amount);
    }

    /**
     * send super tokens back to the smart contract to unwrap it to erc20 token
     * @param _amount  the amount of tokens you want to burn
     */
    function unwrap(uint _amount) external {
        _burn(msg.sender, _amount);
        (bool sent, ) = payable(msg.sender).call{value: _amount}("");
        require(sent, "Failed to send XDC");
    }

    //Fund this contract with sufficient PLI, before you trigger below function.
    //Note, below function will not trigger if you do not put PLI in above contract address
    function getPriceInfo() external returns (bytes32) {
        require(msg.sender == owner, "Only owner can trigger this");
        (requestId) = IInvokeOracle(CONTRACTADDR).requestData({
            _caller: msg.sender
        });
        return requestId;
    }

    //This function will give you last stored value in the contract
    function show() external view returns (uint256) {
        return IInvokeOracle(CONTRACTADDR).showPrice();
    }

    function showPriceOnRequestId(
        bytes32 _requestId
    ) external view returns (uint256) {
        return IInvokeOracle(CONTRACTADDR).showLatestPrice(_requestId);
    }

    /**
     *
     * @param _flowRate is the flowRate per second
     * @param _receiver is the address of the receiver
     */
    function createStream(uint _flowRate, address _receiver) external {
        //check if user has enough balance to start a stream for 10 sec
        require(balanceOf(msg.sender) > _flowRate * 10, "NOT ENOUGH BALANCE");

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

    /**
     * @dev See {IERC20-transfer}.
     *
     * Requirements:
     *
     * - `to` cannot be the zero address.
     * - the caller must have a balance of at least `amount`.
     */
    function transfer(
        address to,
        uint256 amount
    ) public virtual override returns (bool) {
        address sender = _msgSender();
        _transfer(sender, to, amount);
        return true;
    }

    /**
     * @dev See {IERC20-approve}.
     *
     * NOTE: If `amount` is the maximum `uint256`, the allowance is not updated on
     * `transferFrom`. This is semantically equivalent to an infinite approval.
     *
     * Requirements:
     *
     * - `spender` cannot be the zero address.
     */
    function approve(
        address spender,
        uint256 amount
    ) public virtual override returns (bool) {
        address owner = _msgSender();
        _approve(owner, spender, amount);
        return true;
    }

    /**
     * @dev See {IERC20-transferFrom}.
     *
     * Emits an {Approval} event indicating the updated allowance. This is not
     * required by the EIP. See the note at the beginning of {ERC20}.
     *
     * NOTE: Does not update the allowance if the current allowance
     * is the maximum `uint256`.
     *
     * Requirements:
     *
     * - `from` and `to` cannot be the zero address.
     * - `from` must have a balance of at least `amount`.
     * - the caller must have allowance for ``from``'s tokens of at least
     * `amount`.
     */
    function transferFrom(
        address from,
        address to,
        uint256 amount
    ) public virtual override returns (bool) {
        address spender = _msgSender();
        _spendAllowance(from, spender, amount);
        _transfer(from, to, amount);
        return true;
    }

    /**
     * @dev Atomically increases the allowance granted to `spender` by the caller.
     *
     * This is an alternative to {approve} that can be used as a mitigation for
     * problems described in {IERC20-approve}.
     *
     * Emits an {Approval} event indicating the updated allowance.
     *
     * Requirements:
     *
     * - `spender` cannot be the zero address.
     */
    function increaseAllowance(
        address spender,
        uint256 addedValue
    ) public virtual returns (bool) {
        address owner = _msgSender();
        _approve(owner, spender, allowance(owner, spender) + addedValue);
        return true;
    }

    /**
     * @dev Atomically decreases the allowance granted to `spender` by the caller.
     *
     * This is an alternative to {approve} that can be used as a mitigation for
     * problems described in {IERC20-approve}.
     *
     * Emits an {Approval} event indicating the updated allowance.
     *
     * Requirements:
     *
     * - `spender` cannot be the zero address.
     * - `spender` must have allowance for the caller of at least
     * `subtractedValue`.
     */
    function decreaseAllowance(
        address spender,
        uint256 subtractedValue
    ) public virtual returns (bool) {
        address owner = _msgSender();
        uint256 currentAllowance = allowance(owner, spender);
        require(
            currentAllowance >= subtractedValue,
            "ERC20: decreased allowance below zero"
        );
        unchecked {
            _approve(owner, spender, currentAllowance - subtractedValue);
        }

        return true;
    }

    /**
     * @dev Moves `amount` of tokens from `from` to `to`.
     *
     * This internal function is equivalent to {transfer}, and can be used to
     * e.g. implement automatic token fees, slashing mechanisms, etc.
     *
     * Emits a {Transfer} event.
     *
     * Requirements:
     *
     * - `from` cannot be the zero address.
     * - `to` cannot be the zero address.
     * - `from` must have a balance of at least `amount`.
     */
    function _transfer(
        address from,
        address to,
        uint256 amount
    ) internal virtual {
        require(from != address(0), "ERC20: transfer from the zero address");
        require(to != address(0), "ERC20: transfer to the zero address");

        _beforeTokenTransfer(from, to, amount);

        uint256 fromBalance = balanceOf(msg.sender);
        require(
            fromBalance >= amount,
            "ERC20: transfer amount exceeds balance"
        );
        unchecked {
            _balances[from] -= int(amount);
            _balances[to] += int(amount);
        }

        emit Transfer(from, to, amount);

        _afterTokenTransfer(from, to, amount);
    }

    /** @dev Creates `amount` tokens and assigns them to `account`, increasing
     * the total supply.
     *
     * Emits a {Transfer} event with `from` set to the zero address.
     *
     * Requirements:
     *
     * - `account` cannot be the zero address.
     */
    function _mint(address account, uint256 amount) internal virtual {
        require(account != address(0), "ERC20: mint to the zero address");

        _beforeTokenTransfer(address(0), account, amount);

        _totalSupply += amount;
        unchecked {
            // Overflow not possible: balance + amount is at most totalSupply + amount, which is checked above.
            _balances[account] += int(amount);
        }
        emit Transfer(address(0), account, amount);

        _afterTokenTransfer(address(0), account, amount);
    }

    /**
     * @dev Destroys `amount` tokens from `account`, reducing the
     * total supply.
     *
     * Emits a {Transfer} event with `to` set to the zero address.
     *
     * Requirements:
     *
     * - `account` cannot be the zero address.
     * - `account` must have at least `amount` tokens.
     */
    function _burn(address account, uint256 amount) internal virtual {
        require(account != address(0), "ERC20: burn from the zero address");

        _beforeTokenTransfer(account, address(0), amount);

        uint256 accountBalance = balanceOf(msg.sender);
        require(accountBalance >= amount, "ERC20: burn amount exceeds balance");
        unchecked {
            _balances[account] -= int(amount);
            // Overflow not possible: amount <= accountBalance <= totalSupply.
            _totalSupply -= amount;
        }

        emit Transfer(account, address(0), amount);

        _afterTokenTransfer(account, address(0), amount);
    }

    /**
     * @dev Sets `amount` as the allowance of `spender` over the `owner` s tokens.
     *
     * This internal function is equivalent to `approve`, and can be used to
     * e.g. set automatic allowances for certain subsystems, etc.
     *
     * Emits an {Approval} event.
     *
     * Requirements:
     *
     * - `owner` cannot be the zero address.
     * - `spender` cannot be the zero address.
     */
    function _approve(
        address owner,
        address spender,
        uint256 amount
    ) internal virtual {
        require(owner != address(0), "ERC20: approve from the zero address");
        require(spender != address(0), "ERC20: approve to the zero address");

        _allowances[owner][spender] = amount;
        emit Approval(owner, spender, amount);
    }

    /**
     * @dev Updates `owner` s allowance for `spender` based on spent `amount`.
     *
     * Does not update the allowance amount in case of infinite allowance.
     * Revert if not enough allowance is available.
     *
     * Might emit an {Approval} event.
     */
    function _spendAllowance(
        address owner,
        address spender,
        uint256 amount
    ) internal virtual {
        uint256 currentAllowance = allowance(owner, spender);
        if (currentAllowance != type(uint256).max) {
            require(
                currentAllowance >= amount,
                "ERC20: insufficient allowance"
            );
            unchecked {
                _approve(owner, spender, currentAllowance - amount);
            }
        }
    }

    /**
     * @dev Hook that is called before any transfer of tokens. This includes
     * minting and burning.
     *
     * Calling conditions:
     *
     * - when `from` and `to` are both non-zero, `amount` of ``from``'s tokens
     * will be transferred to `to`.
     * - when `from` is zero, `amount` tokens will be minted for `to`.
     * - when `to` is zero, `amount` of ``from``'s tokens will be burned.
     * - `from` and `to` are never both zero.
     *
     * To learn more about hooks, head to xref:ROOT:extending-contracts.adoc#using-hooks[Using Hooks].
     */
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 amount
    ) internal virtual {}

    /**
     * @dev Hook that is called after any transfer of tokens. This includes
     * minting and burning.
     *
     * Calling conditions:
     *
     * - when `from` and `to` are both non-zero, `amount` of ``from``'s tokens
     * has been transferred to `to`.
     * - when `from` is zero, `amount` tokens have been minted for `to`.
     * - when `to` is zero, `amount` of ``from``'s tokens have been burned.
     * - `from` and `to` are never both zero.
     *
     * To learn more about hooks, head to xref:ROOT:extending-contracts.adoc#using-hooks[Using Hooks].
     */
    function _afterTokenTransfer(
        address from,
        address to,
        uint256 amount
    ) internal virtual {}

    receive() external payable {}

    fallback() external payable {}
}
