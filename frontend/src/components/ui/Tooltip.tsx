import type { ViewMode, ElectionData, AreaData, Party, BallotMatchNumber } from "../../lib/types";
import { useLanguage, usePartyName } from "../../lib/i18n";

interface Props {
  areaCode: string;
  rect: DOMRect;
  view: ViewMode;
  data: ElectionData;
  ballotMatchData?: BallotMatchNumber;
}

type GetParty = (code: string) => Party | undefined;

function PName({ party }: { party: Party | undefined }) {
  const name = usePartyName(party);
  return <>{name}</>;
}

export function Tooltip({ areaCode, rect, view, data, ballotMatchData }: Props) {
  const area = data.areas[areaCode];
  if (!area) return null;

  const getParty: GetParty = (code) => data.parties[code];

  const isMobile = window.innerWidth < 640;

  // On mobile, show as a bottom sheet; on desktop, show near the hovered area
  const style: React.CSSProperties = isMobile
    ? {
        position: "fixed",
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 50,
      }
    : (() => {
        const x = rect.left + rect.width / 2;
        const tooltipHeight = 200;
        const showBelow = rect.top < tooltipHeight + 16;
        return {
          position: "fixed" as const,
          left: Math.max(16, Math.min(x, window.innerWidth - 180)),
          top: showBelow ? rect.bottom + 8 : rect.top - 8,
          transform: showBelow ? "translateX(-50%)" : "translate(-50%, -100%)",
          zIndex: 50,
        };
      })();

  return (
    <div
      style={style}
      className={
        isMobile
          ? "bg-white rounded-t-xl shadow-xl border-t border-gray-200 p-4 max-h-[50vh] overflow-y-auto text-sm"
          : "bg-white rounded-lg shadow-xl border border-gray-200 p-3 pointer-events-none max-w-[420px] text-sm"
      }
    >
      <div className="font-bold text-gray-900 mb-1.5 text-base">
        {area.areaName}
      </div>

      {view === "constituency" && (
        <ConstituencyTooltip area={area} getParty={getParty} />
      )}
      {view === "partyList" && (
        <PartyListTooltip area={area} getParty={getParty} />
      )}
      {view === "spillover" && (
        <SpilloverTooltip area={area} getParty={getParty} />
      )}
      {view === "ballotMatch" && ballotMatchData && (
        <BallotMatchTooltip area={area} getParty={getParty} ballotMatchData={ballotMatchData} />
      )}
    </div>
  );
}

function ConstituencyTooltip({
  area,
  getParty,
}: {
  area: AreaData;
  getParty: GetParty;
}) {
  const { t } = useLanguage();
  const c = area.constituency;
  const wp = getParty(c.winnerPartyCode);
  const rp = getParty(c.runnerUpPartyCode);

  return (
    <div className="space-y-1">
      <div>
        <div className="flex items-center gap-1.5">
          <span
            className="w-3 h-3 rounded-sm inline-block shrink-0"
            style={{ backgroundColor: wp?.color }}
          />
          <span className="font-medium truncate">{c.winnerCandidateName}</span>
        </div>
        <div className="text-gray-500 text-xs"><PName party={wp} /></div>
        <div className="text-gray-700 text-xs">
          {c.winnerVotes.toLocaleString()} {t.votes} ({c.winnerPct}%)
        </div>
      </div>
      <div className="text-gray-500 text-xs border-t pt-1 mt-1">
        <div>{t.rank2}: {c.runnerUpCandidateName} (<PName party={rp} />)</div>
        <div>{c.runnerUpVotes.toLocaleString()} ({c.runnerUpPct}%)</div>
      </div>
      <div className="text-gray-400 text-xs">
        {t.margin}: {c.margin} {t.points} · {t.turnout}: {c.turnout}%
      </div>
    </div>
  );
}

function PartyListTooltip({
  area,
  getParty,
}: {
  area: AreaData;
  getParty: GetParty;
}) {
  return (
    <div className="space-y-0.5">
      {area.partyList.topEntries.map((e, i) => {
        const p = getParty(e.partyCode);
        return (
          <div key={e.partyCode} className="flex items-center gap-2">
            <span className="text-gray-400 w-4 text-right text-xs">
              {i + 1}.
            </span>
            <span
              className="w-2.5 h-2.5 rounded-sm inline-block"
              style={{ backgroundColor: p?.color }}
            />
            <span className="flex-1"><PName party={p} /></span>
            <span className="text-gray-600 tabular-nums">
              {e.votes.toLocaleString()} ({e.pct}%)
            </span>
          </div>
        );
      })}
    </div>
  );
}

function SpilloverTooltip({
  area,
  getParty,
}: {
  area: AreaData;
  getParty: GetParty;
}) {
  const { t } = useLanguage();
  const s = area.spillover;
  const c = area.constituency;
  const wp = getParty(c.winnerPartyCode);

  if (!s) {
    return <div className="text-gray-500">{t.noSpilloverData}</div>;
  }

  const mp = getParty(s.matchedPartyCode);

  return (
    <div className="space-y-2">
      {/* Two-column on desktop, stacked on mobile */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
        {/* Constituency winner */}
        <div className="space-y-1">
          <div className="text-gray-400 font-medium">{t.constituencyWinner}</div>
          <div className="flex items-center gap-1.5">
            <span
              className="w-3 h-3 rounded-sm inline-block shrink-0"
              style={{ backgroundColor: wp?.color }}
            />
            <span className="font-medium text-gray-900">{t.ballotNumber} {s.candidateBallotNumber} {c.winnerCandidateName} {t.fromParty} <PName party={wp} /></span>
          </div>
          <div className="text-gray-600">
            {c.winnerVotes.toLocaleString()} {t.votes} ({c.winnerPct}%)
          </div>
        </div>

        {/* Party list lucky beneficiary */}
        <div className="space-y-1 sm:border-l border-t sm:border-t-0 border-gray-200 sm:pl-3 pt-2 sm:pt-0">
          <div className="text-gray-400 font-medium">{t.partyListLucky}</div>
          <div className="flex items-center gap-1.5">
            <span
              className="w-3 h-3 rounded-sm inline-block shrink-0"
              style={{ backgroundColor: mp?.color ?? "#999" }}
            />
            <span className="font-medium text-gray-900">{t.ballotNumber} {s.candidateBallotNumber} <PName party={mp} /></span>
          </div>
          <div className="text-gray-600">
            {t.votesInArea}: <span className="font-medium">{s.matchedPartyPct}%</span>
          </div>
          <div className="text-gray-600">
            {t.nationalAvgTooltip}: {s.matchedPartyNationalAvgPct.toFixed(2)}%
          </div>
          <div className={`font-bold ${s.excessPct > 0 ? "text-red-600" : "text-green-600"}`}>
            {t.excess}: {s.excessPct > 0 ? "+" : ""}{s.excessPct.toFixed(2)}%
            {" "}({s.excessVotes > 0 ? "+" : ""}{s.excessVotes} {t.votes})
          </div>
        </div>
      </div>

      {s.isSuspicious && (
        <div className="text-red-600 text-xs font-bold bg-red-50 rounded px-2 py-1">
          {t.suspicious}
        </div>
      )}
      {!s.isSmallParty && (
        <div className="text-gray-400 text-xs italic">
          {t.notSmallParty}
        </div>
      )}
    </div>
  );
}

function BallotMatchTooltip({
  area,
  getParty,
  ballotMatchData,
}: {
  area: AreaData;
  getParty: GetParty;
  ballotMatchData: BallotMatchNumber;
}) {
  const { t } = useLanguage();
  const entry = ballotMatchData.areas[area.code];
  if (!entry) {
    return <div className="text-gray-500">{t.noBallotData}</div>;
  }

  const smallParty = getParty(ballotMatchData.partyCode);
  const candParty = getParty(entry.candPartyCode);

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
        {/* Party-list side: small party */}
        <div className="space-y-1">
          <div className="text-gray-400 font-medium">{t.partyListMatchingNumber}</div>
          <div className="flex items-center gap-1.5">
            <span
              className="w-3 h-3 rounded-sm inline-block shrink-0"
              style={{ backgroundColor: smallParty?.color ?? "#999" }}
            />
            <span className="font-medium text-gray-900"><PName party={smallParty} /></span>
          </div>
          <div className="text-gray-600">
            {t.votesInArea}: <span className="font-medium">{entry.plVotes.toLocaleString()} ({entry.plPct}%)</span>
          </div>
          <div className="text-gray-600">
            {t.nationalAvgTooltip}: {ballotMatchData.nationalAvgPct.toFixed(2)}%
          </div>
          <div className={`font-bold ${entry.excessPct > 0 ? "text-red-600" : "text-green-600"}`}>
            {t.excess}: {entry.excessPct > 0 ? "+" : ""}{entry.excessPct.toFixed(2)}%
          </div>
        </div>

        {/* Constituency side: candidate with same number */}
        <div className="space-y-1 sm:border-l border-t sm:border-t-0 border-gray-200 sm:pl-3 pt-2 sm:pt-0">
          <div className="text-gray-400 font-medium">{t.sameNumberConstituency}</div>
          <div className="flex items-center gap-1.5">
            <span
              className="w-3 h-3 rounded-sm inline-block shrink-0"
              style={{ backgroundColor: candParty?.color ?? "#999" }}
            />
            <span className="font-medium text-gray-900">{entry.candName || t.noCandidate}</span>
          </div>
          {candParty && (
            <div className="text-gray-600">{t.party}: <PName party={candParty} /></div>
          )}
          <div className="text-gray-600">
            {entry.candVotes.toLocaleString()} {t.votes}
          </div>
        </div>
      </div>
    </div>
  );
}
