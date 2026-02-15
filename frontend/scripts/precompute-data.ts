import { readFileSync, writeFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA = resolve(__dirname, "../../data/smiley159");
const OUT = resolve(__dirname, "../public/data");

function loadJson(name: string, base = DATA) {
  return JSON.parse(readFileSync(resolve(base, name), "utf-8"));
}

// ── Load raw data ───────────────────────────────────────────────────
const partyData = loadJson("party-data.json");
const commonData = loadJson("common-data.json");
const candidateData = loadJson("candidate-data.json");
const constResults = loadJson("all-areas-constituency-results.json");
const plResults = loadJson("all-areas-party-list-results.json");

// ── Build lookups ───────────────────────────────────────────────────
const partyByCode: Record<string, any> = {};
const partyByNumber: Record<number, any> = {};
for (const p of partyData.parties) {
  partyByCode[p.code] = p;
  partyByNumber[p.number] = p;
}

const candidateByCode: Record<string, any> = {};
for (const c of candidateData.candidates) {
  candidateByCode[c.code] = c;
}

const areaNameByCode: Record<string, string> = {};
for (const a of commonData.areas) {
  areaNameByCode[a.code] = a.name;
}

// ── Compute party-list national averages ────────────────────────────
const plVotesByParty: Record<string, number> = {};
let totalPlGoodVotes = 0;

for (const area of plResults.areas) {
  totalPlGoodVotes += area.goodVotes;
  for (const e of area.entries) {
    plVotesByParty[e.partyCode] = (plVotesByParty[e.partyCode] || 0) + e.voteTotal;
  }
}

const nationalAvg: Record<string, number> = {};
for (const [code, votes] of Object.entries(plVotesByParty)) {
  nationalAvg[code] = ((votes as number) / totalPlGoodVotes) * 100;
}

// ── Big parties (not subject to spillover analysis) ─────────────────
const BIG_PARTIES = new Set([
  "PARTY-0046", // ประชาชน
  "PARTY-0009", // เพื่อไทย
  "PARTY-0037", // ภูมิใจไทย
  "PARTY-0027", // ประชาธิปัตย์
  "PARTY-0042", // กล้าธรรม
]);

// ── Build party output ──────────────────────────────────────────────
const parties: Record<string, any> = {};
for (const p of partyData.parties) {
  parties[p.code] = {
    code: p.code,
    number: p.number,
    name: p.name,
    nameEn: p.nameEn || "",
    color: p.colorPrimary || "#999999",
    nationalAvgPct: +(nationalAvg[p.code] || 0).toFixed(4),
    isSmall: !BIG_PARTIES.has(p.code),
  };
}

// ── Build area-level constituency index ─────────────────────────────
const constByArea: Record<string, any> = {};
for (const area of constResults.areas) {
  constByArea[area.areaCode] = area;
}

const plByArea: Record<string, any> = {};
for (const area of plResults.areas) {
  plByArea[area.areaCode] = area;
}

// ── Process each area ───────────────────────────────────────────────
const areas: Record<string, any> = {};

for (const areaMeta of commonData.areas) {
  const areaCode = areaMeta.code;
  const svgId = "area-" + areaCode.slice(5); // AREA-1033 → area-1033
  const constArea = constByArea[areaCode];
  const plArea = plByArea[areaCode];

  if (!constArea || !plArea) continue;

  // Constituency: sort entries by rank
  const constEntries = [...constArea.entries].sort(
    (a: any, b: any) => a.rank - b.rank
  );
  const winner = constEntries[0];
  const runnerUp = constEntries[1];

  const winnerCandidate = candidateByCode[winner?.candidateCode];
  const runnerUpCandidate = candidateByCode[runnerUp?.candidateCode];

  const candidateName = (c: any) =>
    c ? `${c.prefix || ""}${c.firstName} ${c.lastName}`.trim() : "";

  const constituency = {
    winnerPartyCode: winner?.partyCode || "",
    winnerCandidateName: candidateName(winnerCandidate),
    winnerBallotNumber: winnerCandidate?.number || 0,
    winnerVotes: winner?.voteTotal || 0,
    winnerPct: winner?.votePercent || 0,
    runnerUpPartyCode: runnerUp?.partyCode || "",
    runnerUpCandidateName: candidateName(runnerUpCandidate),
    runnerUpVotes: runnerUp?.voteTotal || 0,
    runnerUpPct: runnerUp?.votePercent || 0,
    margin: +((winner?.votePercent || 0) - (runnerUp?.votePercent || 0)).toFixed(2),
    totalGoodVotes: constArea.goodVotes,
    turnout: constArea.totalEligibleVoters
      ? +((constArea.totalVotes / constArea.totalEligibleVoters) * 100).toFixed(1)
      : 0,
  };

  // Party list: top 5
  const plEntries = [...plArea.entries]
    .sort((a: any, b: any) => a.rank - b.rank)
    .slice(0, 5);

  const partyList = {
    winnerPartyCode: plEntries[0]?.partyCode || "",
    winnerVotes: plEntries[0]?.voteTotal || 0,
    winnerPct: plEntries[0]?.votePercent || 0,
    topEntries: plEntries.map((e: any) => ({
      partyCode: e.partyCode,
      votes: e.voteTotal,
      pct: e.votePercent,
    })),
    totalGoodVotes: plArea.goodVotes,
  };

  // Spillover analysis
  let spillover = null;
  const ballotNumber = winnerCandidate?.number;
  if (ballotNumber && partyByNumber[ballotNumber]) {
    const matchedParty = partyByNumber[ballotNumber];
    const matchedPartyCode = matchedParty.code;

    // Find this party's vote in this area's party-list
    const plEntry = plArea.entries.find(
      (e: any) => e.partyCode === matchedPartyCode
    );
    const matchedPct = plEntry?.votePercent || 0;
    const natAvg = nationalAvg[matchedPartyCode] || 0;
    const isSmall = !BIG_PARTIES.has(matchedPartyCode);

    spillover = {
      candidateBallotNumber: ballotNumber,
      matchedPartyCode,
      matchedPartyName: matchedParty.name,
      matchedPartyPct: +matchedPct.toFixed(2),
      matchedPartyNationalAvgPct: +natAvg.toFixed(4),
      excessPct: +(matchedPct - natAvg).toFixed(4),
      excessVotes: Math.round(
        (matchedPct - natAvg) / 100 * plArea.goodVotes
      ),
      isSmallParty: isSmall,
      isSuspicious: isSmall && matchedPct - natAvg > 0.5,
    };
  }

  areas[areaCode] = {
    code: areaCode,
    svgId,
    provinceCode: areaMeta.provinceCode,
    areaName: areaMeta.name,
    constituency,
    partyList,
    spillover,
  };
}

// ── Ballot match analysis ────────────────────────────────────────────
// For each target ballot number, find the small party with that party-list number,
// then see how much party-list vote they got in each area vs their national average.
// Also record which constituency candidate has that same ballot number in each area.

const TARGET_NUMBERS = [1, 2, 3, 4, 5, 7, 8, 13];

// Build index: candidatesByArea[areaCode][ballotNumber] = candidate
const candidatesByArea: Record<string, Record<number, any>> = {};
for (const c of candidateData.candidates) {
  if (!candidatesByArea[c.areaCode]) candidatesByArea[c.areaCode] = {};
  candidatesByArea[c.areaCode][c.number] = c;
}

const ballotMatch: Record<string, any> = {};

for (const num of TARGET_NUMBERS) {
  const targetParty = partyByNumber[num];
  if (!targetParty) continue;

  const partyCode = targetParty.code;
  const natAvg = nationalAvg[partyCode] || 0;
  const areaEntries: Record<string, any> = {};

  for (const areaMeta of commonData.areas) {
    const areaCode = areaMeta.code;
    const plArea = plByArea[areaCode];
    if (!plArea) continue;

    // Find this party's party-list vote in this area
    const plEntry = plArea.entries.find((e: any) => e.partyCode === partyCode);
    const plVotes = plEntry?.voteTotal || 0;
    const plPct = plEntry?.votePercent || 0;
    const excessPct = plPct - natAvg;

    // Find the constituency candidate with this ballot number in this area
    const cand = candidatesByArea[areaCode]?.[num];
    const constArea = constByArea[areaCode];
    const constEntry = constArea?.entries.find(
      (e: any) => e.candidateCode === cand?.code
    );

    const candidateName = (c: any) =>
      c ? `${c.prefix || ""}${c.firstName} ${c.lastName}`.trim() : "";

    areaEntries[areaCode] = {
      plVotes,
      plPct: +plPct.toFixed(2),
      excessPct: +excessPct.toFixed(4),
      candPartyCode: cand?.partyCode || "",
      candName: candidateName(cand),
      candVotes: constEntry?.voteTotal || 0,
    };
  }

  ballotMatch[String(num)] = {
    partyCode,
    partyName: targetParty.name,
    nationalAvgPct: +natAvg.toFixed(4),
    areas: areaEntries,
  };
}

// ── Write output ────────────────────────────────────────────────────
const output = { parties, areas, ballotMatch };
const json = JSON.stringify(output);
writeFileSync(resolve(OUT, "election-data.json"), json);

console.log(
  `Written election-data.json: ${Object.keys(areas).length} areas, ${Object.keys(parties).length} parties, ${(json.length / 1024).toFixed(0)}KB`
);
