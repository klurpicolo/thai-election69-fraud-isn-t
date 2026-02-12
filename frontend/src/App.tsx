import { useState, useCallback } from "react";
import type { ViewMode } from "./lib/types";
import { useElectionData } from "./hooks/useElectionData";
import { ElectionMap } from "./components/map/ElectionMap";
import { ViewToggle } from "./components/ui/ViewToggle";
import { Tooltip } from "./components/ui/Tooltip";
import { Legend } from "./components/ui/Legend";

export default function App() {
  const { data, loading } = useElectionData();
  const [view, setView] = useState<ViewMode>("spillover");
  const [usePartyColor, setUsePartyColor] = useState(false);
  const [hovered, setHovered] = useState<{
    areaCode: string;
    rect: DOMRect;
  } | null>(null);

  const handleAreaHover = useCallback(
    (areaCode: string | null, rect: DOMRect | null) => {
      if (areaCode && rect) {
        setHovered({ areaCode, rect });
      } else {
        setHovered(null);
      }
    },
    []
  );

  const handleAreaClick = useCallback(
    (_areaCode: string | null) => {
      // On mobile, click acts like hover
    },
    []
  );

  if (loading || !data) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-gray-500 text-lg">Loading election data...</div>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen overflow-hidden relative">
      {/* Map fills the entire viewport */}
      <ElectionMap
        data={data}
        view={view}
        usePartyColor={usePartyColor}
        onAreaHover={handleAreaHover}
        onAreaClick={handleAreaClick}
      />

      {/* Top-left panel: title + view toggle + legend */}
      <div className="absolute top-3 left-3 flex flex-col gap-2 pointer-events-none">
        <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-lg border border-gray-200 px-4 py-3 pointer-events-auto">
          <h1 className="text-base font-bold text-gray-900 leading-tight">
            Thailand Election 69 — Fraud Analysis
          </h1>
          <ViewToggle current={view} onChange={setView} />
        </div>

        <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-lg border border-gray-200 px-3 py-2 pointer-events-auto">
          <Legend
            view={view}
            data={data}
            usePartyColor={usePartyColor}
            onTogglePartyColor={() => setUsePartyColor((v) => !v)}
          />
        </div>
      </div>

      {/* Tooltip */}
      {hovered && (
        <Tooltip
          areaCode={hovered.areaCode}
          rect={hovered.rect}
          view={view}
          data={data}
        />
      )}
    </div>
  );
}
