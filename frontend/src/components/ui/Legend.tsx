import type { ViewMode, ElectionData } from "../../lib/types";

interface Props {
  view: ViewMode;
  data: ElectionData;
  usePartyColor: boolean;
  onTogglePartyColor: () => void;
}

// Top parties by seat count for constituency/partyList legends
const MAJOR_PARTIES = [
  "PARTY-0046",
  "PARTY-0009",
  "PARTY-0037",
  "PARTY-0027",
  "PARTY-0006",
  "PARTY-0043",
  "PARTY-0033",
  "PARTY-0029",
];

export function Legend({ view, data, usePartyColor, onTogglePartyColor }: Props) {
  if (view === "spillover") {
    return (
      <SpilloverLegend
        usePartyColor={usePartyColor}
        onToggle={onTogglePartyColor}
      />
    );
  }

  return (
    <div className="flex flex-wrap gap-3 justify-center">
      {MAJOR_PARTIES.map((code) => {
        const party = data.parties[code];
        if (!party) return null;
        return (
          <div key={code} className="flex items-center gap-1.5 text-xs">
            <span
              className="w-3 h-3 rounded-sm inline-block border border-gray-200"
              style={{ backgroundColor: party.color }}
            />
            <span className="text-gray-700">{party.name}</span>
          </div>
        );
      })}
    </div>
  );
}

function SpilloverLegend({
  usePartyColor,
  onToggle,
}: {
  usePartyColor: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex items-center gap-3 justify-center">
        <span className="text-xs text-gray-500">No match / Large party</span>
        <span className="w-5 h-4 rounded bg-gray-200 border border-gray-300" />
        <span className="text-xs text-gray-500">No excess</span>
        <div
          className="w-32 h-4 rounded border border-gray-300"
          style={{
            background: usePartyColor
              ? "linear-gradient(to right, #FFFFFF, #888888)"
              : "linear-gradient(to right, #FEE2E2, #DC2626)",
          }}
        />
        <span className="text-xs text-gray-500">High excess (+3%+)</span>
      </div>
      <button
        onClick={onToggle}
        className={`text-xs px-3 py-1 rounded-full border transition-colors ${
          usePartyColor
            ? "bg-indigo-50 border-indigo-300 text-indigo-700"
            : "bg-gray-50 border-gray-300 text-gray-600 hover:bg-gray-100"
        }`}
      >
        {usePartyColor ? "Colored by party" : "Colored by red gradient"}
        {" — click to toggle"}
      </button>
    </div>
  );
}
