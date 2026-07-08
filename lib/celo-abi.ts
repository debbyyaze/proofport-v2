export const proofPortCeloAbi = [
  "function totalLogs() view returns (uint256)",
  "function getLog(uint256 id) view returns (tuple(uint256 id, address author, string summary, string proofUri, string tag, bytes32 contentHash, uint64 createdAt, uint32 applause))",
  "function createLog(string summary, string proofUri, string tag, bytes32 contentHash) returns (uint256)",
  "function applaud(uint256 id) returns (uint32)",
  "event LogCreated(uint256 indexed id, address indexed author, string summary, string proofUri, string tag, bytes32 contentHash)",
  "event Applauded(uint256 indexed id, address indexed actor, uint32 applause)"
] as const;
