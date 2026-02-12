import { useState, useCallback } from "react";
import type { ViewMode } from "./lib/types";
import { useElectionData } from "./hooks/useElectionData";
import { ElectionMap } from "./components/map/ElectionMap";
import { ViewToggle } from "./components/ui/ViewToggle";
import { Tooltip } from "./components/ui/Tooltip";
import { Legend } from "./components/ui/Legend";
import { Header } from "./components/ui/Header";

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
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-500 text-lg">Loading election data...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center px-4 py-6 gap-4">
      <Header view={view} />
      <ViewToggle current={view} onChange={setView} />
      <Legend
        view={view}
        data={data}
        usePartyColor={usePartyColor}
        onTogglePartyColor={() => setUsePartyColor((v) => !v)}
      />

      <div className="flex-1 w-full max-w-3xl relative flex items-center justify-center">
        <ElectionMap
          data={data}
          view={view}
          usePartyColor={usePartyColor}
          onAreaHover={handleAreaHover}
          onAreaClick={handleAreaClick}
        />

        {hovered && (
          <Tooltip
            areaCode={hovered.areaCode}
            rect={hovered.rect}
            view={view}
            data={data}
          />
        )}
      </div>
    </div>
  );
}
