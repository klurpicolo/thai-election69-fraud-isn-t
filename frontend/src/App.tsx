import { useState, useCallback, useEffect } from "react";
import type { ViewMode } from "./lib/types";
import { useElectionData } from "./hooks/useElectionData";
import { useLanguage } from "./lib/i18n";
import { ElectionMap } from "./components/map/ElectionMap";
import { ViewToggle } from "./components/ui/ViewToggle";
import { Tooltip } from "./components/ui/Tooltip";
import { Legend } from "./components/ui/Legend";
import { About } from "./components/ui/About";

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
  return isMobile;
}

export default function App() {
  const { data, loading } = useElectionData();
  const { lang, setLang, t } = useLanguage();
  const [view, setView] = useState<ViewMode>("spillover");
  const [usePartyColor, setUsePartyColor] = useState(true);
  const [selectedBallotNumber, setSelectedBallotNumber] = useState("1");
  const [ballotMatchThreshold, setBallotMatchThreshold] = useState(1.0);
  const isMobile = useIsMobile();
  const [panelOpen, setPanelOpen] = useState(!isMobile);
  const [showAbout, setShowAbout] = useState(false);
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
    (areaCode: string | null, rect: DOMRect | null) => {
      // On mobile, tap acts like hover (show/hide tooltip)
      if (areaCode && rect) {
        setHovered((prev) =>
          prev?.areaCode === areaCode ? null : { areaCode, rect }
        );
      } else {
        setHovered(null);
      }
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

  if (showAbout) {
    return <About onBack={() => setShowAbout(false)} />;
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
        ballotMatchData={data.ballotMatch?.[selectedBallotNumber]}
        ballotMatchThreshold={ballotMatchThreshold}
      />

      {/* Top-left panel: title + view toggle + legend */}
      <div className="absolute top-3 left-3 flex flex-col gap-2 pointer-events-none max-w-[calc(100vw-24px)]">
        <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-lg border border-gray-200 px-4 py-3 pointer-events-auto">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h1 className="text-base font-bold text-gray-900 leading-tight">
                {t.title}
              </h1>
              <p className="text-[10px] text-gray-400 leading-tight mt-0.5">
                {t.subtitle}
                {" "}
                <button
                  onClick={() => setShowAbout(true)}
                  className="text-indigo-500 hover:text-indigo-700 underline"
                >
                  {t.aboutLink}
                </button>
              </p>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={() => setLang(lang === "th" ? "en" : "th")}
                className="h-9 sm:h-7 px-1.5 flex items-center justify-center rounded-md bg-gray-100 hover:bg-gray-200 active:bg-gray-300 text-gray-600 transition-colors text-xs font-medium"
              >
                <span className={lang === "th" ? "font-bold text-gray-900" : ""}>TH</span>
                <span className="mx-0.5 text-gray-300">|</span>
                <span className={lang === "en" ? "font-bold text-gray-900" : ""}>EN</span>
              </button>
              <button
                onClick={() => setPanelOpen((v) => !v)}
                className="w-9 h-9 sm:w-7 sm:h-7 flex items-center justify-center rounded-md bg-gray-100 hover:bg-gray-200 active:bg-gray-300 text-gray-600 transition-colors text-base sm:text-sm"
                aria-label={panelOpen ? t.hideControls : t.showControls}
              >
                {panelOpen ? "✕" : "☰"}
              </button>
            </div>
          </div>
          {panelOpen && <ViewToggle current={view} onChange={setView} />}
        </div>

        {panelOpen && (
          <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-lg border border-gray-200 px-3 py-2 pointer-events-auto">
            <Legend
              view={view}
              data={data}
              usePartyColor={usePartyColor}
              onTogglePartyColor={() => setUsePartyColor((v) => !v)}
              selectedBallotNumber={selectedBallotNumber}
              onBallotNumberChange={setSelectedBallotNumber}
              ballotMatch={data.ballotMatch}
              ballotMatchThreshold={ballotMatchThreshold}
              onBallotMatchThresholdChange={setBallotMatchThreshold}
            />
          </div>
        )}
      </div>

      {/* Tooltip */}
      {hovered && (
        <Tooltip
          areaCode={hovered.areaCode}
          rect={hovered.rect}
          view={view}
          data={data}
          ballotMatchData={data.ballotMatch?.[selectedBallotNumber]}
        />
      )}
    </div>
  );
}
