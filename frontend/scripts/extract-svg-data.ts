import { readFileSync, writeFileSync } from "fs";
import { parse } from "node-html-parser";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "../..");
const OUT = resolve(__dirname, "../src/data");

const html = readFileSync(resolve(ROOT, "demo.html"), "utf-8");
const root = parse(html);
const svg = root.querySelector("svg")!;

// ── Extract area rects and paths ────────────────────────────────────
interface AreaRect {
  x: number;
  y: number;
}

interface AreaPath {
  d: string;
  fill: string;
}

const areaRects: Record<string, AreaRect> = {};
const areaPaths: Record<string, AreaPath[]> = {};

const areaGroups = svg.querySelectorAll("[id^=area-]");
for (const g of areaGroups) {
  const id = g.getAttribute("id")!;
  if (!id.match(/^area-\d+$/)) continue;

  const rect = g.querySelector("rect");
  if (!rect) continue;

  const transform = rect.getAttribute("transform") || "";
  const m = transform.match(/translate\(([.\d]+)\s+([.\d]+)\)/);
  if (!m) continue;

  areaRects[id] = { x: parseFloat(m[1]), y: parseFloat(m[2]) };

  const paths = g.querySelectorAll("path");
  areaPaths[id] = paths.map((p) => ({
    d: p.getAttribute("d") || "",
    fill: p.getAttribute("fill") || "#FFFBF8",
  }));
}

console.log(`Extracted ${Object.keys(areaRects).length} areas`);

// ── Extract province name paths ─────────────────────────────────────
interface ProvinceNamePath {
  d: string;
  fill: string;
}

const provinceNames: Record<string, ProvinceNamePath[]> = {};

const nameGroups = svg.querySelectorAll("[id$=-name]");
for (const g of nameGroups) {
  const id = g.getAttribute("id")!;
  if (!id.match(/^province-\d+-name$/)) continue;

  const paths = g.querySelectorAll("path");
  provinceNames[id] = paths.map((p) => ({
    d: p.getAttribute("d") || "",
    fill: p.getAttribute("fill") || "#333332",
  }));
}

console.log(`Extracted ${Object.keys(provinceNames).length} province names`);

// ── Extract hierarchy ───────────────────────────────────────────────
interface SvgGroup {
  id: string;
  type: "region" | "province";
  children: string[]; // area IDs or province IDs
}

const layout: SvgGroup[] = [];

// Find top-level groups (regions and standalone provinces like province-10)
for (const child of svg.childNodes) {
  if (typeof (child as any).getAttribute !== "function") continue;
  const el = child as any;
  const id = el.getAttribute?.("id");
  if (!id) continue;

  if (id.match(/^region-\d+$/)) {
    // Region group — children are provinces
    const provinceIds: string[] = [];
    const provinces = el.querySelectorAll("[id^=province-]");
    for (const p of provinces) {
      const pid = p.getAttribute("id")!;
      if (pid.match(/^province-\d+$/) && p.parentNode === el) {
        provinceIds.push(pid);
      }
    }
    layout.push({ id, type: "region", children: provinceIds });
  } else if (id.match(/^province-\d+$/)) {
    // Standalone province (Bangkok)
    layout.push({ id, type: "province", children: [] });
  }
}

// For each province, find its area children
function getAreasForProvince(provinceId: string): string[] {
  const pGroup = svg.querySelector(`#${provinceId}`);
  if (!pGroup) return [];
  const areas: string[] = [];
  const areaEls = pGroup.querySelectorAll("[id^=area-]");
  for (const a of areaEls) {
    const aid = a.getAttribute("id")!;
    if (aid.match(/^area-\d+$/)) {
      areas.push(aid);
    }
  }
  return areas;
}

// Build province → areas mapping
const provinceAreas: Record<string, string[]> = {};
for (const group of layout) {
  if (group.type === "province") {
    provinceAreas[group.id] = getAreasForProvince(group.id);
  } else {
    for (const pid of group.children) {
      provinceAreas[pid] = getAreasForProvince(pid);
    }
  }
}

console.log(
  `Hierarchy: ${layout.length} top-level groups, ${Object.keys(provinceAreas).length} provinces`
);

// ── Write output files ──────────────────────────────────────────────

writeFileSync(
  resolve(OUT, "svgAreas.ts"),
  `// Auto-generated from demo.html — do not edit
export const areaRects: Record<string, { x: number; y: number }> = ${JSON.stringify(areaRects)};

export const areaPaths: Record<string, Array<{ d: string; fill: string }>> = ${JSON.stringify(areaPaths)};
`
);

writeFileSync(
  resolve(OUT, "svgProvinceNames.ts"),
  `// Auto-generated from demo.html — do not edit
export const provinceNamePaths: Record<string, Array<{ d: string; fill: string }>> = ${JSON.stringify(provinceNames)};
`
);

writeFileSync(
  resolve(OUT, "svgLayout.ts"),
  `// Auto-generated from demo.html — do not edit
export interface SvgGroup {
  id: string;
  type: "region" | "province";
  children: string[];
}

export const svgHierarchy: SvgGroup[] = ${JSON.stringify(layout, null, 2)};

export const provinceAreas: Record<string, string[]> = ${JSON.stringify(provinceAreas, null, 2)};
`
);

console.log("Written svgAreas.ts, svgProvinceNames.ts, svgLayout.ts");
