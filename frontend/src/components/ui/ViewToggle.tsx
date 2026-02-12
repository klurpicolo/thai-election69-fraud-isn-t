import type { ViewMode } from "../../lib/types";

const views: { key: ViewMode; label: string }[] = [
  { key: "constituency", label: "Constituency Winner" },
  { key: "partyList", label: "Party List Winner" },
  { key: "spillover", label: "Spillover Analysis" },
];

interface Props {
  current: ViewMode;
  onChange: (view: ViewMode) => void;
}

export function ViewToggle({ current, onChange }: Props) {
  return (
    <div className="flex gap-1 p-1 bg-gray-100 rounded-lg">
      {views.map(({ key, label }) => (
        <button
          key={key}
          onClick={() => onChange(key)}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            current === key
              ? "bg-white text-gray-900 shadow-sm"
              : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
