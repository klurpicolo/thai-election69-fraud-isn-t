import type { ViewMode, ElectionData, AreaData, Party } from "../../lib/types";

interface Props {
  areaCode: string;
  rect: DOMRect;
  view: ViewMode;
  data: ElectionData;
}

type GetParty = (code: string) => Party | undefined;

export function Tooltip({ areaCode, rect, view, data }: Props) {
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
  area: AreaData;
  getParty: GetParty;
}) {
  const s = area.spillover;
  const c = area.constituency;
  const wp = getParty(c.winnerPartyCode);

  if (!s) {
    return <div className="text-gray-500">ไม่มีข้อมูลกระสุนหล่น</div>;
  }

  const mp = getParty(s.matchedPartyCode);
  const matchedName = mp?.name ?? s.matchedPartyName;

  return (
    <div className="space-y-2">
      {/* Two-column on desktop, stacked on mobile */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
        {/* สส.เขต (ผู้ชนะ) */}
        <div className="space-y-1">
          <div className="text-gray-400 font-medium">ผู้ชนะ สส.เขต</div>
          <div className="flex items-center gap-1.5">
            <span
              className="w-3 h-3 rounded-sm inline-block shrink-0"
              style={{ backgroundColor: wp?.color }}
            />
            <span className="font-medium text-gray-900">เบอร์ {s.candidateBallotNumber} {c.winnerCandidateName} จากพรรค{wp?.name}</span>
          </div>
          <div className="text-gray-600">
            {c.winnerVotes.toLocaleString()} คะแนน ({c.winnerPct}%)
          </div>
        </div>

        {/* บช.รายชื่อ (พรรคที่ตรงเบอร์) */}
        <div className="space-y-1 sm:border-l border-t sm:border-t-0 border-gray-200 sm:pl-3 pt-2 sm:pt-0">
          <div className="text-gray-400 font-medium">บช.รายชื่อ ผู้รับโชค</div>
          <div className="flex items-center gap-1.5">
            <span
              className="w-3 h-3 rounded-sm inline-block shrink-0"
              style={{ backgroundColor: mp?.color ?? "#999" }}
            />
            <span className="font-medium text-gray-900">เบอร์ {s.candidateBallotNumber} {matchedName}</span>
          </div>
          <div className="text-gray-600">
            คะแนนในเขต: <span className="font-medium">{s.matchedPartyPct}%</span>
          </div>
          <div className="text-gray-600">
            ค่าเฉลี่ยประเทศ: {s.matchedPartyNationalAvgPct.toFixed(2)}%
          </div>
          <div className={`font-bold ${s.excessPct > 0 ? "text-red-600" : "text-green-600"}`}>
            ส่วนต่าง: {s.excessPct > 0 ? "+" : ""}{s.excessPct.toFixed(2)}%
            {" "}({s.excessVotes > 0 ? "+" : ""}{s.excessVotes} คะแนน)
          </div>
        </div>
      </div>

      {s.isSuspicious && (
        <div className="text-red-600 text-xs font-bold bg-red-50 rounded px-2 py-1">
          น่าสงสัย หรือไม่?: พรรคเล็กได้คะแนนเกินปกติ ตรงกับเบอร์ผู้ชนะ สส.เขต
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
