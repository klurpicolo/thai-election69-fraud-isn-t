import type { ViewMode } from "../../lib/types";
import { useLanguage } from "../../lib/i18n";
import type { Translations } from "../../lib/translations";

const viewKeys: { key: ViewMode; tKey: keyof Translations }[] = [
  { key: "constituency", tKey: "constituency" },
  { key: "partyList", tKey: "partyList" },
  { key: "spillover", tKey: "spillover" },
  { key: "ballotMatch", tKey: "ballotMatch" },
];

interface Props {
  current: ViewMode;
  onChange: (view: ViewMode) => void;
}

export function ViewToggle({ current, onChange }: Props) {
  const { t } = useLanguage();
  return (
    <div className="flex gap-1 p-0.5 bg-gray-100 rounded-md mt-1.5">
      {viewKeys.map(({ key, tKey }) => (
        <button
          key={key}
          onClick={() => onChange(key)}
          className={`px-3 py-2 sm:py-1 rounded text-xs font-medium transition-colors ${
            current === key
              ? "bg-white text-gray-900 shadow-sm"
              : "text-gray-500 hover:text-gray-900 active:text-gray-900"
          }`}
        >
          {t[tKey]}
        </button>
      ))}
    </div>
  );
}
