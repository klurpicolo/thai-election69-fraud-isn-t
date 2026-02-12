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
  return (
    <div className="flex flex-col gap-1.5">
      {/* Party swatches — always visible */}
      <div className="flex flex-col gap-0.5">
        {MAJOR_PARTIES.map((code) => {
          const party = data.parties[code];
          if (!party) return null;
          return (
            <div key={code} className="flex items-center gap-1 text-xs">
              <span
                className="w-2.5 h-2.5 rounded-sm inline-block border border-gray-200"
                style={{ backgroundColor: party.color }}
              />
              <span className="text-gray-700">{party.name}</span>
            </div>
          );
        })}
      </div>

      {/* Spillover gradient + toggle — only in spillover view */}
      {view === "spillover" && (
        <div className="flex flex-col gap-1.5 border-t border-gray-200 pt-1.5 mt-0.5">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-gray-500">No match</span>
            <span className="w-4 h-3 rounded bg-gray-200 border border-gray-300" />
            <span className="text-xs text-gray-500">Low</span>
            <div
              className="w-20 h-3 rounded border border-gray-300"
              style={{
                background: usePartyColor
                  ? "linear-gradient(to right, #FFFFFF, #888888)"
                  : "linear-gradient(to right, #FEE2E2, #DC2626)",
              }}
            />
            <span className="text-xs text-gray-500">High (+3%+)</span>
          </div>
          <button
            onClick={onTogglePartyColor}
            className={`text-xs px-2 py-0.5 rounded-full border transition-colors self-start ${
              usePartyColor
                ? "bg-indigo-50 border-indigo-300 text-indigo-700"
                : "bg-gray-50 border-gray-300 text-gray-600 hover:bg-gray-100"
            }`}
          >
            {usePartyColor ? "Party colors" : "Red gradient"} — toggle
          </button>
        </div>
      )}
    </div>
  );
}
