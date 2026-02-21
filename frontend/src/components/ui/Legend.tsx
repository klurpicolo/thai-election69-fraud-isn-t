import type { ViewMode, ElectionData, BallotMatchNumber, Party } from "../../lib/types";
import { useLanguage, usePartyName } from "../../lib/i18n";

interface Props {
  view: ViewMode;
  data: ElectionData;
  usePartyColor: boolean;
  onTogglePartyColor: () => void;
  selectedBallotNumber?: string;
  onBallotNumberChange?: (num: string) => void;
  ballotMatch?: Record<string, BallotMatchNumber>;
  ballotMatchThreshold?: number;
  onBallotMatchThresholdChange?: (value: number) => void;
}

// Top parties for legend display
const MAJOR_PARTIES = [
  "PARTY-0046", // ประชาชน
  "PARTY-0009", // เพื่อไทย
  "PARTY-0037", // ภูมิใจไทย
  "PARTY-0027", // ประชาธิปัตย์
  "PARTY-0042", // กล้าธรรม
  "PARTY-0006",
  "PARTY-0043",
  "PARTY-0033",
  "PARTY-0029",
];

const BALLOT_NUMBERS = ["1", "2", "3", "4", "5", "7", "8", "13"];

function PartyName({ party }: { party: Party | undefined }) {
  const name = usePartyName(party);
  return <>{name}</>;
}

export function Legend({ view, data, usePartyColor, onTogglePartyColor, selectedBallotNumber, onBallotNumberChange, ballotMatch, ballotMatchThreshold, onBallotMatchThresholdChange }: Props) {
  const { t } = useLanguage();

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
              <span className="text-gray-700"><PartyName party={party} /></span>
            </div>
          );
        })}
      </div>

      {/* Spillover gradient + toggle — only in spillover view */}
      {view === "spillover" && (
        <div className="flex flex-col gap-1.5 border-t border-gray-200 pt-1.5 mt-0.5">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-gray-500">{t.noMatch}</span>
            <span className="w-4 h-3 rounded bg-gray-200 border border-gray-300" />
            <span className="text-xs text-gray-500">{t.low}</span>
            <div
              className="w-20 h-3 rounded border border-gray-300"
              style={{
                background: usePartyColor
                  ? "linear-gradient(to right, #FFFFFF, #888888)"
                  : "linear-gradient(to right, #FEE2E2, #DC2626)",
              }}
            />
            <span className="text-xs text-gray-500">{t.high}</span>
          </div>
          <button
            onClick={onTogglePartyColor}
            className={`text-xs px-2 py-0.5 rounded-full border transition-colors self-start ${
              usePartyColor
                ? "bg-indigo-50 border-indigo-300 text-indigo-700"
                : "bg-gray-50 border-gray-300 text-gray-600 hover:bg-gray-100"
            }`}
          >
            {usePartyColor ? t.showPartyColor : t.showGradient} — {t.clickToToggle}
          </button>
        </div>
      )}

      {/* Ballot match — number picker + gradient */}
      {view === "ballotMatch" && ballotMatch && (
        <div className="flex flex-col gap-1.5 border-t border-gray-200 pt-1.5 mt-0.5">
          <div className="text-xs text-gray-500 font-medium">{t.selectNumber}</div>
          <div className="flex gap-1 flex-wrap">
            {BALLOT_NUMBERS.map((num) => (
              <button
                key={num}
                onClick={() => onBallotNumberChange?.(num)}
                className={`w-8 h-8 sm:w-7 sm:h-7 rounded text-xs font-bold transition-colors ${
                  selectedBallotNumber === num
                    ? "bg-red-600 text-white shadow-sm"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200 active:bg-gray-300"
                }`}
              >
                {num}
              </button>
            ))}
          </div>
          {selectedBallotNumber && ballotMatch[selectedBallotNumber] && (
            <div className="text-xs text-gray-700">
              <span className="font-medium"><PartyName party={data.parties[ballotMatch[selectedBallotNumber].partyCode]} /></span>
              {" "}({t.nationalAvg}: {ballotMatch[selectedBallotNumber].nationalAvgPct.toFixed(2)}%)
            </div>
          )}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-gray-500">{t.belowLabel}</span>
            <span className="w-4 h-3 rounded bg-gray-200 border border-gray-300" />
            <span className="text-xs text-gray-500">{t.low}</span>
            <div
              className="w-20 h-3 rounded border border-gray-300"
              style={{
                background: usePartyColor
                  ? "linear-gradient(to right, #FFFFFF, #888888)"
                  : "linear-gradient(to right, #FEE2E2, #DC2626)",
              }}
            />
            <span className="text-xs text-gray-500">{t.high}</span>
          </div>
          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">{t.hideBelowLabel}</span>
              <span className="text-xs font-medium text-gray-700 tabular-nums">
                {(ballotMatchThreshold ?? 0) > 0 ? `+${(ballotMatchThreshold ?? 0).toFixed(1)}%` : t.off}
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="3"
              step="0.1"
              value={ballotMatchThreshold ?? 0}
              onChange={(e) => onBallotMatchThresholdChange?.(parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-red-600"
            />
            <div className="flex justify-between text-[10px] text-gray-400">
              <span>0%</span>
              <span>+1%</span>
              <span>+2%</span>
              <span>+3%</span>
            </div>
          </div>
          <button
            onClick={onTogglePartyColor}
            className={`text-xs px-2 py-0.5 rounded-full border transition-colors self-start ${
              usePartyColor
                ? "bg-indigo-50 border-indigo-300 text-indigo-700"
                : "bg-gray-50 border-gray-300 text-gray-600 hover:bg-gray-100"
            }`}
          >
            {usePartyColor ? t.showPartyColor : t.showGradient} — {t.clickToToggle}
          </button>
        </div>
      )}
    </div>
  );
}
