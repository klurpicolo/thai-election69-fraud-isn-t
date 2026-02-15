export type ViewMode = "constituency" | "partyList" | "spillover" | "ballotMatch";

export interface Party {
  code: string;
  number: number;
  name: string;
  nameEn: string;
  color: string;
  nationalAvgPct: number;
  isSmall: boolean;
}

export interface ConstituencyResult {
  winnerPartyCode: string;
  winnerCandidateName: string;
  winnerBallotNumber: number;
  winnerVotes: number;
  winnerPct: number;
  runnerUpPartyCode: string;
  runnerUpCandidateName: string;
  runnerUpVotes: number;
  runnerUpPct: number;
  margin: number;
  totalGoodVotes: number;
  turnout: number;
}

export interface PartyListEntry {
  partyCode: string;
  votes: number;
  pct: number;
}

export interface PartyListResult {
  winnerPartyCode: string;
  winnerVotes: number;
  winnerPct: number;
  topEntries: PartyListEntry[];
  totalGoodVotes: number;
}

export interface SpilloverData {
  candidateBallotNumber: number;
  matchedPartyCode: string;
  matchedPartyName: string;
  matchedPartyPct: number;
  matchedPartyNationalAvgPct: number;
  excessPct: number;
  excessVotes: number;
  isSmallParty: boolean;
  isSuspicious: boolean;
}

export interface AreaData {
  code: string;
  svgId: string;
  provinceCode: string;
  areaName: string;
  constituency: ConstituencyResult;
  partyList: PartyListResult;
  spillover: SpilloverData | null;
}

export interface BallotMatchAreaEntry {
  plVotes: number;
  plPct: number;
  excessPct: number;
  candPartyCode: string;
  candName: string;
  candVotes: number;
}

export interface BallotMatchNumber {
  partyCode: string;
  partyName: string;
  nationalAvgPct: number;
  areas: Record<string, BallotMatchAreaEntry>;
}

export interface ElectionData {
  parties: Record<string, Party>;
  areas: Record<string, AreaData>;
  ballotMatch?: Record<string, BallotMatchNumber>;
}
