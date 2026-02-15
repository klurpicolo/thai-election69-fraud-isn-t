import type { ViewMode } from "../../lib/types";

const views: { key: ViewMode; label: string }[] = [
  { key: "constituency", label: "สส.เขต" },
  { key: "partyList", label: "บช.รายชื่อ" },
  { key: "spillover", label: "กระสุนหล่น หรือไม่?" },
  { key: "ballotMatch", label: "เบอร์ตรง" },
];

interface Props {
  current: ViewMode;
  onChange: (view: ViewMode) => void;
}

export function ViewToggle({ current, onChange }: Props) {
  return (
    <div className="flex gap-1 p-0.5 bg-gray-100 rounded-md mt-1.5">
      {views.map(({ key, label }) => (
        <button
          key={key}
          onClick={() => onChange(key)}
          className={`px-3 py-2 sm:py-1 rounded text-xs font-medium transition-colors ${
            current === key
              ? "bg-white text-gray-900 shadow-sm"
              : "text-gray-500 hover:text-gray-900 active:text-gray-900"
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
