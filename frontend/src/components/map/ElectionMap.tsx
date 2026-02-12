import { useRef, useEffect, useCallback } from "react";
import type { ViewMode, ElectionData } from "../../lib/types";
import { getAreaColor, svgIdToAreaCode } from "../../lib/colorUtils";

interface Props {
  data: ElectionData;
  view: ViewMode;
  usePartyColor: boolean;
  onAreaHover: (areaCode: string | null, rect: DOMRect | null) => void;
  onAreaClick: (areaCode: string | null) => void;
}

export function ElectionMap({ data, view, usePartyColor, onAreaHover, onAreaClick }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const areaRectsRef = useRef<Map<string, SVGRectElement>>(new Map());

  // Keep latest callbacks in refs so event listeners always use current values
  const onAreaHoverRef = useRef(onAreaHover);
  const onAreaClickRef = useRef(onAreaClick);
  onAreaHoverRef.current = onAreaHover;
  onAreaClickRef.current = onAreaClick;

  // Load SVG once and attach event listeners
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let cancelled = false;

    fetch(`${import.meta.env.BASE_URL}map.svg`)
      .then((r) => r.text())
      .then((svgText) => {
        if (cancelled) return;

        container.innerHTML = svgText;
        const svg = container.querySelector("svg");
        if (!svg) return;

        svg.style.maxWidth = "100%";
        svg.style.maxHeight = "100%";
        svg.style.width = "auto";
        svg.style.height = "auto";
        svgRef.current = svg;

        // Index all area rects
        const map = new Map<string, SVGRectElement>();
        const areaGroups = svg.querySelectorAll<SVGGElement>("[id^=area-]");
        for (const g of areaGroups) {
          const id = g.getAttribute("id")!;
          if (!/^area-\d+$/.test(id)) continue;
          const rect = g.querySelector("rect");
          if (rect) map.set(id, rect);
        }
        areaRectsRef.current = map;

        // Apply initial colors
        applyColors();

        // Event delegation
        function findAreaGroup(target: EventTarget | null): SVGGElement | null {
          let el = target as Element | null;
          while (el && el !== svg) {
            if (
              el.tagName === "g" &&
              el.id?.startsWith("area-") &&
              /^area-\d+$/.test(el.id)
            ) {
              return el as SVGGElement;
            }
            el = el.parentElement;
          }
          return null;
        }

        svg.addEventListener("mousemove", (e: MouseEvent) => {
          const g = findAreaGroup(e.target);
          if (g) {
            const rect = g.querySelector("rect");
            const domRect = rect?.getBoundingClientRect() ?? null;
            onAreaHoverRef.current(svgIdToAreaCode(g.id), domRect);
          } else {
            onAreaHoverRef.current(null, null);
          }
        });

        svg.addEventListener("click", (e: MouseEvent) => {
          const g = findAreaGroup(e.target);
          onAreaClickRef.current(g ? svgIdToAreaCode(g.id) : null);
        });

        svg.addEventListener("mouseleave", () => {
          onAreaHoverRef.current(null, null);
        });

        svg.style.cursor = "pointer";
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const applyColors = useCallback(() => {
    for (const [svgId, rect] of areaRectsRef.current) {
      rect.setAttribute("fill", getAreaColor(svgId, view, data, usePartyColor));
    }
  }, [view, data, usePartyColor]);

  // Update colors when view changes
  useEffect(() => {
    applyColors();
  }, [applyColors]);

  return (
    <div
      ref={containerRef}
      className="flex items-center justify-center w-full h-full"
    />
  );
}
