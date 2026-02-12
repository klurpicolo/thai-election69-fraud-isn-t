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
  const tooltipHeight = 200; // estimated max height
  const showBelow = rect.top < tooltipHeight + 16;

  // Keep tooltip on screen: flip below if too close to top
  const style: React.CSSProperties = {
    position: "fixed",
    left: Math.max(16, Math.min(x, window.innerWidth - 180)),
    top: showBelow ? rect.bottom + 8 : rect.top - 8,
    transform: showBelow ? "translateX(-50%)" : "translate(-50%, -100%)",
    zIndex: 50,
  };

  return (
    <div
      style={style}
      className="bg-white rounded-lg shadow-xl border border-gray-200 p-3 pointer-events-none max-w-[340px] text-sm"
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
      <div>
        <div className="flex items-center gap-1.5">
          <span
            className="w-3 h-3 rounded-sm inline-block shrink-0"
            style={{ backgroundColor: wp?.color }}
          />
          <span className="font-medium truncate">{c.winnerCandidateName}</span>
        </div>
        <div className="text-gray-500 text-xs">{wp?.name}</div>
        <div className="text-gray-700 text-xs">
          {c.winnerVotes.toLocaleString()} คะแนน ({c.winnerPct}%)
        </div>
      </div>
      <div className="text-gray-500 text-xs border-t pt-1 mt-1">
        <div>อันดับ 2: {c.runnerUpCandidateName} ({rp?.name})</div>
        <div>{c.runnerUpVotes.toLocaleString()} ({c.runnerUpPct}%)</div>
      </div>
      <div className="text-gray-400 text-xs">
        ห่าง: {c.margin} จุด · ผู้มาใช้สิทธิ: {c.turnout}%
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
    return <div className="text-gray-500">ไม่มีข้อมูลกระสุนหล่น</div>;
  }

  const mp = getParty(s.matchedPartyCode);

  return (
    <div className="space-y-1.5">
      <div>
        <div className="text-xs text-gray-500">
          ผู้ชนะ: {c.winnerCandidateName} ({wp?.name})
        </div>
        <div className="mt-0.5">
          <span className="text-gray-600">เบอร์ สส.เขต #{s.candidateBallotNumber}</span>{" "}
          →{" "}
          <span className="font-medium">
            เบอร์ บช.รายชื่อ #{s.candidateBallotNumber} ({mp?.name || s.matchedPartyName})
          </span>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-x-3 text-xs">
        <div className="text-gray-500">คะแนนในเขต:</div>
        <div className="font-medium">{s.matchedPartyPct}%</div>
        <div className="text-gray-500">ค่าเฉลี่ยประเทศ:</div>
        <div>{s.matchedPartyNationalAvgPct.toFixed(2)}%</div>
        <div className="text-gray-500">ส่วนเกิน:</div>
        <div
          className={`font-bold ${
            s.excessPct > 0 ? "text-red-600" : "text-green-600"
          }`}
        >
          {s.excessPct > 0 ? "+" : ""}
          {s.excessPct.toFixed(2)} จุด ({s.excessVotes > 0 ? "+" : ""}
          {s.excessVotes} คะแนน)
        </div>
      </div>
      {s.isSuspicious && (
        <div className="text-red-600 text-xs font-bold bg-red-50 rounded px-2 py-1 mt-1">
          น่าสงสัย: พรรคเล็กได้คะแนนเกินปกติ ตรงกับเบอร์ผู้ชนะ สส.เขต
        </div>
      )}
      {!s.isSmallParty && (
        <div className="text-gray-400 text-xs italic">
          พรรคที่ตรงเบอร์ไม่ใช่พรรคเล็ก — โอกาสกระสุนหล่นต่ำ
        </div>
      )}
    </div>
  );
}
