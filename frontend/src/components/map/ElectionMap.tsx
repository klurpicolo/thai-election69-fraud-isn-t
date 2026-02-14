import { useRef, useEffect, useCallback, useState } from "react";
import type { ViewMode, ElectionData } from "../../lib/types";
import { getAreaColor, svgIdToAreaCode } from "../../lib/colorUtils";

interface Props {
  data: ElectionData;
  view: ViewMode;
  usePartyColor: boolean;
  onAreaHover: (areaCode: string | null, rect: DOMRect | null) => void;
  onAreaClick: (areaCode: string | null, rect: DOMRect | null) => void;
}

// Original SVG viewBox dimensions
const ORIG_VB = { x: 0, y: 0, w: 1663, h: 2631 };
const ZOOM_FACTOR = 1.3;
const MIN_ZOOM = 1;
const MAX_ZOOM = 10;

export function ElectionMap({
  data,
  view,
  usePartyColor,
  onAreaHover,
  onAreaClick,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const areaRectsRef = useRef<Map<string, SVGRectElement>>(new Map());

  // Zoom/pan state stored in ref for direct SVG manipulation, plus React state for button rendering
  const viewBoxRef = useRef({ ...ORIG_VB });
  const zoomRef = useRef(1);
  const [zoom, setZoom] = useState(1);

  // Pan state
  const isPanningRef = useRef(false);
  const panStartRef = useRef({ x: 0, y: 0 });

  // Callback refs
  const onAreaHoverRef = useRef(onAreaHover);
  const onAreaClickRef = useRef(onAreaClick);
  onAreaHoverRef.current = onAreaHover;
  onAreaClickRef.current = onAreaClick;

  const updateViewBox = useCallback(() => {
    const svg = svgRef.current;
    if (!svg) return;
    const vb = viewBoxRef.current;
    svg.setAttribute("viewBox", `${vb.x} ${vb.y} ${vb.w} ${vb.h}`);
  }, []);

  const applyZoom = useCallback(
    (newZoom: number, centerX?: number, centerY?: number) => {
      const clamped = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, newZoom));
      const vb = viewBoxRef.current;

      // Default center: current viewBox center
      const cx = centerX ?? vb.x + vb.w / 2;
      const cy = centerY ?? vb.y + vb.h / 2;

      const newW = ORIG_VB.w / clamped;
      const newH = ORIG_VB.h / clamped;

      // Keep the zoom centered on (cx, cy)
      let newX = cx - newW * ((cx - vb.x) / vb.w);
      let newY = cy - newH * ((cy - vb.y) / vb.h);

      // Clamp to bounds
      newX = Math.max(ORIG_VB.x, Math.min(newX, ORIG_VB.x + ORIG_VB.w - newW));
      newY = Math.max(ORIG_VB.y, Math.min(newY, ORIG_VB.y + ORIG_VB.h - newH));

      viewBoxRef.current = { x: newX, y: newY, w: newW, h: newH };
      zoomRef.current = clamped;
      setZoom(clamped);
      updateViewBox();
    },
    [updateViewBox]
  );

  const resetView = useCallback(() => {
    viewBoxRef.current = { ...ORIG_VB };
    zoomRef.current = 1;
    setZoom(1);
    updateViewBox();
  }, [updateViewBox]);

  // Load SVG once
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

        svg.style.width = "100%";
        svg.style.height = "100%";
        svg.setAttribute("preserveAspectRatio", "xMidYMid meet");
        svg.setAttribute(
          "viewBox",
          `${ORIG_VB.x} ${ORIG_VB.y} ${ORIG_VB.w} ${ORIG_VB.h}`
        );
        svgRef.current = svg;

        // Index area rects
        const map = new Map<string, SVGRectElement>();
        const areaGroups = svg.querySelectorAll<SVGGElement>("[id^=area-]");
        for (const g of areaGroups) {
          const id = g.getAttribute("id")!;
          if (!/^area-\d+$/.test(id)) continue;
          const rect = g.querySelector("rect");
          if (rect) map.set(id, rect);
        }
        areaRectsRef.current = map;
        applyColors();

        // --- Event handlers ---

        function findAreaGroup(
          target: EventTarget | null
        ): SVGGElement | null {
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

        // Hover
        svg.addEventListener("mousemove", (e: MouseEvent) => {
          if (isPanningRef.current) return;
          const g = findAreaGroup(e.target);
          if (g) {
            const rect = g.querySelector("rect");
            const domRect = rect?.getBoundingClientRect() ?? null;
            onAreaHoverRef.current(svgIdToAreaCode(g.id), domRect);
          } else {
            onAreaHoverRef.current(null, null);
          }
        });

        svg.addEventListener("mouseleave", () => {
          onAreaHoverRef.current(null, null);
        });

        // Click (tap on mobile)
        svg.addEventListener("click", (e: MouseEvent) => {
          if (isPanningRef.current) return;
          const g = findAreaGroup(e.target);
          if (g) {
            const rect = g.querySelector("rect");
            const domRect = rect?.getBoundingClientRect() ?? null;
            onAreaClickRef.current(svgIdToAreaCode(g.id), domRect);
          } else {
            onAreaClickRef.current(null, null);
          }
        });

        // Wheel zoom
        svg.addEventListener(
          "wheel",
          (e: WheelEvent) => {
            e.preventDefault();
            const rect = svg.getBoundingClientRect();
            // Convert mouse position to SVG coordinates
            const vb = viewBoxRef.current;
            const mouseX =
              vb.x + ((e.clientX - rect.left) / rect.width) * vb.w;
            const mouseY =
              vb.y + ((e.clientY - rect.top) / rect.height) * vb.h;

            const direction = e.deltaY < 0 ? ZOOM_FACTOR : 1 / ZOOM_FACTOR;
            applyZoom(zoomRef.current * direction, mouseX, mouseY);
          },
          { passive: false }
        );

        // Pan via mouse drag
        svg.addEventListener("mousedown", (e: MouseEvent) => {
          if (e.button !== 0) return;
          isPanningRef.current = false; // will become true on move
          panStartRef.current = { x: e.clientX, y: e.clientY };

          const onMouseMove = (me: MouseEvent) => {
            isPanningRef.current = true;
            const rect = svg!.getBoundingClientRect();
            const vb = viewBoxRef.current;
            const dx =
              ((panStartRef.current.x - me.clientX) / rect.width) * vb.w;
            const dy =
              ((panStartRef.current.y - me.clientY) / rect.height) * vb.h;

            let newX = vb.x + dx;
            let newY = vb.y + dy;
            newX = Math.max(
              ORIG_VB.x,
              Math.min(newX, ORIG_VB.x + ORIG_VB.w - vb.w)
            );
            newY = Math.max(
              ORIG_VB.y,
              Math.min(newY, ORIG_VB.y + ORIG_VB.h - vb.h)
            );

            viewBoxRef.current = { ...vb, x: newX, y: newY };
            updateViewBox();
            panStartRef.current = { x: me.clientX, y: me.clientY };
            onAreaHoverRef.current(null, null);
          };

          const onMouseUp = () => {
            document.removeEventListener("mousemove", onMouseMove);
            document.removeEventListener("mouseup", onMouseUp);
            // Reset panning flag after a tick so click handler can check it
            requestAnimationFrame(() => {
              isPanningRef.current = false;
            });
          };

          document.addEventListener("mousemove", onMouseMove);
          document.addEventListener("mouseup", onMouseUp);
        });

        // Touch: pan (1 finger) and pinch-to-zoom (2 fingers)
        let lastTouchDist = 0;
        let lastTouchCenter = { x: 0, y: 0 };
        let touchMoved = false;

        svg.addEventListener(
          "touchstart",
          (e: TouchEvent) => {
            touchMoved = false;
            if (e.touches.length === 1) {
              panStartRef.current = {
                x: e.touches[0].clientX,
                y: e.touches[0].clientY,
              };
            } else if (e.touches.length === 2) {
              e.preventDefault();
              const dx = e.touches[0].clientX - e.touches[1].clientX;
              const dy = e.touches[0].clientY - e.touches[1].clientY;
              lastTouchDist = Math.hypot(dx, dy);
              lastTouchCenter = {
                x: (e.touches[0].clientX + e.touches[1].clientX) / 2,
                y: (e.touches[0].clientY + e.touches[1].clientY) / 2,
              };
            }
          },
          { passive: false }
        );

        svg.addEventListener(
          "touchmove",
          (e: TouchEvent) => {
            if (e.touches.length === 1 && zoomRef.current > 1) {
              // Single-finger pan (only when zoomed in)
              e.preventDefault();
              touchMoved = true;
              const touch = e.touches[0];
              const rect = svg!.getBoundingClientRect();
              const vb = viewBoxRef.current;
              const dx =
                ((panStartRef.current.x - touch.clientX) / rect.width) * vb.w;
              const dy =
                ((panStartRef.current.y - touch.clientY) / rect.height) * vb.h;

              let newX = vb.x + dx;
              let newY = vb.y + dy;
              newX = Math.max(
                ORIG_VB.x,
                Math.min(newX, ORIG_VB.x + ORIG_VB.w - vb.w)
              );
              newY = Math.max(
                ORIG_VB.y,
                Math.min(newY, ORIG_VB.y + ORIG_VB.h - vb.h)
              );

              viewBoxRef.current = { ...vb, x: newX, y: newY };
              updateViewBox();
              panStartRef.current = { x: touch.clientX, y: touch.clientY };
              onAreaHoverRef.current(null, null);
            } else if (e.touches.length === 2) {
              // Pinch zoom
              e.preventDefault();
              touchMoved = true;
              const dx = e.touches[0].clientX - e.touches[1].clientX;
              const dy = e.touches[0].clientY - e.touches[1].clientY;
              const dist = Math.hypot(dx, dy);

              if (lastTouchDist > 0) {
                const scale = dist / lastTouchDist;
                const rect = svg!.getBoundingClientRect();
                const vb = viewBoxRef.current;
                const cx =
                  vb.x +
                  ((lastTouchCenter.x - rect.left) / rect.width) * vb.w;
                const cy =
                  vb.y +
                  ((lastTouchCenter.y - rect.top) / rect.height) * vb.h;
                applyZoom(zoomRef.current * scale, cx, cy);
              }

              lastTouchDist = dist;
              lastTouchCenter = {
                x: (e.touches[0].clientX + e.touches[1].clientX) / 2,
                y: (e.touches[0].clientY + e.touches[1].clientY) / 2,
              };
            }
          },
          { passive: false }
        );

        svg.addEventListener("touchend", (e: TouchEvent) => {
          if (e.touches.length === 0) {
            lastTouchDist = 0;
            // If it was a tap (not a pan/pinch), let the click handler fire
            if (touchMoved) {
              e.preventDefault();
            }
          }
        });

        svg.style.cursor = "grab";
        svg.style.touchAction = "none";
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

  useEffect(() => {
    applyColors();
  }, [applyColors]);

  return (
    <div className="relative w-full h-full">
      <div
        ref={containerRef}
        className="w-full h-full overflow-hidden"
      />

      {/* Zoom controls — bottom-right on mobile, top-right on desktop */}
      <div className="absolute bottom-4 right-3 sm:bottom-auto sm:top-2 sm:right-2 flex flex-col gap-1.5">
        <button
          onClick={() => applyZoom(zoomRef.current * ZOOM_FACTOR)}
          className="w-10 h-10 sm:w-8 sm:h-8 bg-white rounded-lg sm:rounded shadow-md border border-gray-300 text-gray-700 hover:bg-gray-50 active:bg-gray-100 flex items-center justify-center text-xl sm:text-lg font-bold leading-none"
          title="Zoom in"
        >
          +
        </button>
        <button
          onClick={() => applyZoom(zoomRef.current / ZOOM_FACTOR)}
          className="w-10 h-10 sm:w-8 sm:h-8 bg-white rounded-lg sm:rounded shadow-md border border-gray-300 text-gray-700 hover:bg-gray-50 active:bg-gray-100 flex items-center justify-center text-xl sm:text-lg font-bold leading-none"
          title="Zoom out"
        >
          &minus;
        </button>
        <button
          onClick={resetView}
          disabled={zoom === 1}
          className="w-10 h-10 sm:w-8 sm:h-8 bg-white rounded-lg sm:rounded shadow-md border border-gray-300 text-gray-700 hover:bg-gray-50 active:bg-gray-100 flex items-center justify-center text-sm sm:text-xs font-medium leading-none disabled:opacity-30 disabled:cursor-default"
          title="Reset view"
        >
          <svg viewBox="0 0 16 16" className="w-5 h-5 sm:w-4 sm:h-4" fill="currentColor">
            <path d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 1 1 .908-.418A6 6 0 1 1 8 2v1z" />
            <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466z" />
          </svg>
        </button>
      </div>
    </div>
  );
}
