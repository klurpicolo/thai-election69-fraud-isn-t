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
      if (!s || !s.isSmallParty) return "#E5E7EB";
      if (s.excessPct <= 0) return "#FAFAFA";
      const intensity = Math.min(s.excessPct / 3, 1);
      if (usePartyColor) {
        const partyColor =
          data.parties[area.constituency.winnerPartyCode]?.color ?? "#DC2626";
        return interpolateColor("#FFFFFF", partyColor, intensity);
      }
      return interpolateColor("#FEE2E2", "#DC2626", intensity);
    }
  }
}
