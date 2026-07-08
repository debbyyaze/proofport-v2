// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract ProofPortLog {
    uint256 public constant MAX_SUMMARY_BYTES = 160;
    uint256 public constant MAX_PROOF_URI_BYTES = 220;
    uint256 public constant MAX_TAG_BYTES = 32;

    struct ShipLog {
        uint256 id;
        address author;
        string summary;
        string proofUri;
        string tag;
        bytes32 contentHash;
        uint64 createdAt;
        uint32 applause;
    }

    error EmptySummary();
    error SummaryTooLong();
    error ProofUriTooLong();
    error TagTooLong();
    error LogNotFound();

    event LogCreated(
        uint256 indexed id,
        address indexed author,
        string summary,
        string proofUri,
        string tag,
        bytes32 contentHash
    );
    event Applauded(
        uint256 indexed id,
        address indexed actor,
        uint32 applause
    );

    uint256 public totalLogs;
    mapping(uint256 => ShipLog) private logs;

    function createLog(
        string calldata summary,
        string calldata proofUri,
        string calldata tag,
        bytes32 contentHash
    ) external returns (uint256 id) {
        _validateText(summary, proofUri, tag);

        id = ++totalLogs;
        logs[id] = ShipLog({
            id: id,
            author: msg.sender,
            summary: summary,
            proofUri: proofUri,
            tag: tag,
            contentHash: contentHash,
            createdAt: uint64(block.timestamp),
            applause: 0
        });

        emit LogCreated(id, msg.sender, summary, proofUri, tag, contentHash);
    }

    function applaud(uint256 id) external returns (uint32 applause) {
        ShipLog storage shipLog = logs[id];
        if (shipLog.author == address(0)) revert LogNotFound();

        applause = shipLog.applause + 1;
        shipLog.applause = applause;

        emit Applauded(id, msg.sender, applause);
    }

    function getLog(uint256 id) external view returns (ShipLog memory) {
        ShipLog memory shipLog = logs[id];
        if (shipLog.author == address(0)) revert LogNotFound();
        return shipLog;
    }

    function _validateText(
        string calldata summary,
        string calldata proofUri,
        string calldata tag
    ) private pure {
        uint256 summaryLength = bytes(summary).length;
        if (summaryLength == 0) revert EmptySummary();
        if (summaryLength > MAX_SUMMARY_BYTES) revert SummaryTooLong();
        if (bytes(proofUri).length > MAX_PROOF_URI_BYTES) {
            revert ProofUriTooLong();
        }
        if (bytes(tag).length > MAX_TAG_BYTES) revert TagTooLong();
    }
}
