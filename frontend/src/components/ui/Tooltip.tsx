import type { ViewMode, ElectionData } from "../../lib/types";

interface Props {
  areaCode: string;
  rect: DOMRect;
  view: ViewMode;
  data: ElectionData;
}

export function Tooltip({ areaCode, rect, view, data }: Props) {
  const area = data.areas[areaCode];
  if (!area) return null;

  const getParty = (code: string) => data.parties[code];

  const x = rect.left + rect.width / 2;
  const y = rect.top - 8;

  // Keep tooltip on screen
  const style: React.CSSProperties = {
    position: "fixed",
    left: Math.min(x, window.innerWidth - 320),
    top: Math.max(y, 10),
    transform: "translate(-50%, -100%)",
    zIndex: 50,
  };

  return (
    <div
      style={style}
      className="bg-white rounded-lg shadow-xl border border-gray-200 p-3 pointer-events-none max-w-[300px] text-sm"
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
    </div>
  );
}

function ConstituencyTooltip({
  area,
  getParty,
}: {
  area: any;
  getParty: (code: string) => any;
}) {
  const c = area.constituency;
  const wp = getParty(c.winnerPartyCode);
  const rp = getParty(c.runnerUpPartyCode);

  return (
    <div className="space-y-1">
      <div className="flex items-center gap-2">
        <span
          className="w-3 h-3 rounded-sm inline-block"
          style={{ backgroundColor: wp?.color }}
        />
        <span>
          <span className="font-medium">{c.winnerCandidateName}</span>{" "}
          <span className="text-gray-500">({wp?.name})</span>
        </span>
      </div>
      <div className="text-gray-700">
        {c.winnerVotes.toLocaleString()} votes ({c.winnerPct}%)
      </div>
      <div className="text-gray-500 text-xs border-t pt-1 mt-1">
        Runner-up: {c.runnerUpCandidateName} ({rp?.name}) —{" "}
        {c.runnerUpVotes.toLocaleString()} ({c.runnerUpPct}%)
      </div>
      <div className="text-gray-400 text-xs">
        Margin: {c.margin} pts · Turnout: {c.turnout}%
      </div>
    </div>
  );
}

function PartyListTooltip({
  area,
  getParty,
}: {
  area: any;
  getParty: (code: string) => any;
}) {
  return (
    <div className="space-y-0.5">
      {area.partyList.topEntries.map((e: any, i: number) => {
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
            <span className="flex-1">{p?.name}</span>
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
  area: any;
  getParty: (code: string) => any;
}) {
  const s = area.spillover;
  const c = area.constituency;
  const wp = getParty(c.winnerPartyCode);

  if (!s) {
    return <div className="text-gray-500">No spillover data</div>;
  }

  const mp = getParty(s.matchedPartyCode);

  return (
    <div className="space-y-1.5">
      <div className="text-xs text-gray-500">
        Winner: {c.winnerCandidateName} ({wp?.name})
      </div>
      <div>
        <span className="text-gray-600">Ballot #{s.candidateBallotNumber}</span>{" "}
        →{" "}
        <span className="font-medium">
          Party list #{s.candidateBallotNumber} ({mp?.name || s.matchedPartyName})
        </span>
      </div>
      <div className="grid grid-cols-2 gap-x-3 text-xs">
        <div className="text-gray-500">Area vote:</div>
        <div className="font-medium">{s.matchedPartyPct}%</div>
        <div className="text-gray-500">National avg:</div>
        <div>{s.matchedPartyNationalAvgPct.toFixed(2)}%</div>
        <div className="text-gray-500">Excess:</div>
        <div
          className={`font-bold ${
            s.excessPct > 0 ? "text-red-600" : "text-green-600"
          }`}
        >
          {s.excessPct > 0 ? "+" : ""}
          {s.excessPct.toFixed(2)} pts ({s.excessVotes > 0 ? "+" : ""}
          {s.excessVotes} votes)
        </div>
      </div>
      {s.isSuspicious && (
        <div className="text-red-600 text-xs font-bold bg-red-50 rounded px-2 py-1 mt-1">
          Suspicious: small party got excess votes matching winner's ballot #
        </div>
      )}
      {!s.isSmallParty && (
        <div className="text-gray-400 text-xs italic">
          Matched party is not small — less likely spillover
        </div>
      )}
    </div>
  );
}
