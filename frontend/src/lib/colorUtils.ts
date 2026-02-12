import type { ViewMode, ElectionData } from "./types";

export function svgIdToAreaCode(svgId: string): string {
  // "area-1033" → "AREA-1033"
  return "AREA-" + svgId.slice(5);
}

export function interpolateColor(
  from: string,
  to: string,
  t: number
): string {
  const f = hexToRgb(from);
  const tt = hexToRgb(to);
  const r = Math.round(f.r + (tt.r - f.r) * t);
  const g = Math.round(f.g + (tt.g - f.g) * t);
  const b = Math.round(f.b + (tt.b - f.b) * t);
  return `rgb(${r},${g},${b})`;
}

function hexToRgb(hex: string) {
  const h = hex.replace("#", "");
  return {
    r: parseInt(h.slice(0, 2), 16),
    g: parseInt(h.slice(2, 4), 16),
    b: parseInt(h.slice(4, 6), 16),
  };
}

export function getAreaColor(
  svgId: string,
  view: ViewMode,
  data: ElectionData,
  usePartyColor?: boolean
): string {
  const areaCode = svgIdToAreaCode(svgId);
  const area = data.areas[areaCode];
  if (!area) return "#CCCCCC";

  switch (view) {
    case "constituency":
      return data.parties[area.constituency.winnerPartyCode]?.color ?? "#999999";

    case "partyList":
      return data.parties[area.partyList.winnerPartyCode]?.color ?? "#999999";

    case "spillover": {
      const s = area.spillover;
      const partyColor =
        data.parties[area.constituency.winnerPartyCode]?.color ?? "#999999";
      if (!s || s.excessPct <= 0) {
        // slightly more visible tint or near-white
        return usePartyColor ? interpolateColor("#FFFFFF", partyColor, 0.25) : "#FAFAFA";
      }
      // Log scale so outliers pop: log(1+x)/log(1+cap)
      // Suspicious areas: range from 0.35 → 1.0 so they clearly stand out from the faint tints above
      const rawIntensity = Math.min(Math.log1p(s.excessPct) / Math.log1p(3), 1);
      const intensity = 0.35 + rawIntensity * 0.65;
      if (usePartyColor) {
        return interpolateColor("#FFFFFF", partyColor, intensity);
      }
      return interpolateColor("#FEE2E2", "#DC2626", rawIntensity);
    }
  }
}
