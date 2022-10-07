//SPDX-License-Identifier: MIT
pragma solidity ^0.8.6;

import "@chainlink/contracts/src/v0.8/ConfirmedOwner.sol";
import "@chainlink/contracts/src/v0.8/VRFV2WrapperConsumerBase.sol";

contract Giveaways is VRFV2WrapperConsumerBase, ConfirmedOwner {
    struct Giveaway {
        string description;
        uint256 proof;
        uint64 num_participants;
        uint64 winner;
        bool completed;
    }

    Giveaway[] public s_giveaways;
    uint public s_current_giveaway;

    string public s_link_prefix;
    string public s_link_suffix;

    // VRF
    struct RequestStatus {
        uint256 paid; // amount paid in link
        bool fulfilled; // whether the request has been successfully fulfilled
        uint256 rng;
    }
    mapping(uint256 => RequestStatus) public s_requests; /* requestId --> requestStatus */
    // past requests Id.
    uint256[] public s_requestIds;
    uint256 public s_lastRequestId;
    address immutable s_linkAddress;
    address immutable s_wrapperAddress;
    uint32 constant callbackGasLimit = 100000;
    event RequestSent(uint256 requestId, uint32 numWords);
    event RequestFulfilled(
        uint256 requestId,
        uint256[] randomWords,
        uint256 payment
    );

    // giveaway_number the number of the created giveaway to be used later on when the giveaway get ran
    event GiveawayCreated(uint giveaway_number);
    event GiveawayFinished(uint giveaway_number, uint winner);

    constructor(
        string memory link_prefix,
        string memory link_suffix,
        address _link,
        address _wrapper
    ) ConfirmedOwner(msg.sender) VRFV2WrapperConsumerBase(_link, _wrapper) {
        s_link_prefix = link_prefix;
        s_link_suffix = link_suffix;
        s_linkAddress = _link;
        s_wrapperAddress = _wrapper;
    }

    /**
     * create a future giveaway with proof of the list of participants using keccak256
     */
    function create_giveaway(
        string calldata description,
        uint proof,
        uint64 num_participants
    ) external onlyOwner {
        emit GiveawayCreated(s_giveaways.length);
        s_giveaways.push(
            Giveaway(description, proof, num_participants, 0, false)
        );
    }

    /**
     * run a given giveaway and select a winner
     */
    function run_giveaway(uint giveaway_number) external onlyOwner {
        require(
            s_giveaways[giveaway_number].proof > 0,
            "Giveaway hasn't started"
        );
        require(
            !s_giveaways[giveaway_number].completed,
            "Giveaway has already completed"
        );

        s_current_giveaway = giveaway_number;
        requestRNG();
    }

    /**
     * retreive the winner of a given giveaway
     */
    function get_winner(uint giveaway_number)
        external
        view
        returns (uint64 winner)
    {
        require(
            s_giveaways[giveaway_number].completed,
            "Giveaway hasn't completed yet. Check back later"
        );
        winner = s_giveaways[giveaway_number].winner;
    }

    /**
     * get the link to the list of participants for a particular giveaway
     */
    function get_participants_list_link(string memory giveaway_number)
        public
        view
        returns (string memory link)
    {
        link = string(
            abi.encodePacked(s_link_prefix, giveaway_number, s_link_suffix)
        );
    }

    // VRF
    function requestRNG() internal onlyOwner returns (uint256 requestId) {
        requestId = requestRandomness(callbackGasLimit, 3, 1);
        s_requests[requestId] = RequestStatus({
            paid: VRF_V2_WRAPPER.calculateRequestPrice(callbackGasLimit),
            rng: 0,
            fulfilled: false
        });
        s_requestIds.push(requestId);
        s_lastRequestId = requestId;
        emit RequestSent(requestId, 1);
        return requestId;
    }

    function fulfillRandomWords(
        uint256 _requestId,
        uint256[] memory _randomWords
    ) internal override {
        require(s_requests[_requestId].paid > 0, "request not found");
        s_requests[_requestId].fulfilled = true;
        s_requests[_requestId].rng = _randomWords[0];

        uint giveaway_number = s_current_giveaway;
        Giveaway memory c = s_giveaways[giveaway_number];
        require(!c.completed, "Giveaway has already completed");
        c.winner = uint64(_randomWords[0] % c.num_participants);
        c.completed = true;

        emit GiveawayFinished(giveaway_number, c.winner);
        s_giveaways[giveaway_number] = c;
        emit RequestFulfilled(
            _requestId,
            _randomWords,
            s_requests[_requestId].paid
        );
    }

    function getRequestStatus(uint256 _requestId)
        external
        view
        returns (
            uint256 paid,
            bool fulfilled,
            uint256 rng
        )
    {
        require(s_requests[_requestId].paid > 0, "request not found");
        RequestStatus memory request = s_requests[_requestId];
        return (request.paid, request.fulfilled, request.rng);
    }

    /**
     * Allow withdraw of Link tokens from the contract
     */
    function withdrawLink() public onlyOwner {
        LinkTokenInterface link = LinkTokenInterface(s_linkAddress);
        require(
            link.transfer(msg.sender, link.balanceOf(address(this))),
            "Unable to transfer"
        );
    }

    function change_link_prefix(string calldata new_prefix) public onlyOwner {
        s_link_prefix = new_prefix;
    }

    function change_link_suffix(string calldata new_suffix) public onlyOwner {
        s_link_suffix = new_suffix;
    }
}
