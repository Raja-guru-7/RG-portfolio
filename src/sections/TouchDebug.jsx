import { useEffect, useRef, useState } from "react";

/* =========================================
   TOUCH DEBUG OVERLAY (temporary)

   Shows on the phone screen:
   - scrollY and the maximum scroll possible
   - how many touchmove events were cancelled
     by JS (preventDefault)
   - whether scrollY actually changed during
     the last swipe
   - the element under your finger and every
     ancestor that has touch-action / overflow /
     fixed / sticky / pointer-events set

   Enable with:  ?debug=1  at the end of the URL
========================================= */

const describe = (node) => {
  const id = node.id ? `#${node.id}` : "";
  const cls =
    typeof node.className === "string" && node.className.trim()
      ? `.${node.className.trim().split(/\s+/)[0]}`
      : "";
  return `${node.tagName.toLowerCase()}${id}${cls}`;
};

const inspectChain = (start) => {
  const lines = [];
  let node = start;
  let depth = 0;

  while (node && node.nodeType === 1 && depth < 15) {
    const cs = getComputedStyle(node);
    const bits = [];

    if (cs.touchAction !== "auto") bits.push(`touch:${cs.touchAction}`);
    if (cs.overflowY !== "visible") bits.push(`oy:${cs.overflowY}`);
    if (cs.overflowX !== "visible") bits.push(`ox:${cs.overflowX}`);
    if (cs.position === "fixed" || cs.position === "sticky")
      bits.push(cs.position);
    if (cs.pointerEvents === "none") bits.push("pe:none");

    if (bits.length) lines.push(`${describe(node)} [${bits.join(" ")}]`);

    node = node.parentElement;
    depth++;
  }

  return lines;
};

const TouchDebug = () => {
  const data = useRef({
    moves: 0,
    prevented: 0,
    notCancelable: 0,
    startY: 0,
    delta: 0,
    hit: "-",
    chain: [],
  });

  const [, setTick] = useState(0);

  useEffect(() => {
    const onStart = (e) => {
      const t = e.touches[0];
      const hit = document.elementFromPoint(t.clientX, t.clientY);

      data.current.moves = 0;
      data.current.prevented = 0;
      data.current.notCancelable = 0;
      data.current.startY = window.scrollY;
      data.current.hit = hit ? describe(hit) : "null";
      data.current.chain = hit ? inspectChain(hit) : [];
    };

    const onMove = (e) => {
      data.current.moves++;

      if (!e.cancelable) data.current.notCancelable++;

      // check after every other listener has run
      setTimeout(() => {
        if (e.defaultPrevented) data.current.prevented++;
      }, 0);

      data.current.delta = Math.round(window.scrollY - data.current.startY);
    };

    const onEnd = () => {
      data.current.delta = Math.round(window.scrollY - data.current.startY);
    };

    const opts = { passive: true, capture: true };

    window.addEventListener("touchstart", onStart, opts);
    window.addEventListener("touchmove", onMove, opts);
    window.addEventListener("touchend", onEnd, opts);

    const timer = setInterval(() => setTick((n) => n + 1), 200);

    return () => {
      window.removeEventListener("touchstart", onStart, opts);
      window.removeEventListener("touchmove", onMove, opts);
      window.removeEventListener("touchend", onEnd, opts);
      clearInterval(timer);
    };
  }, []);

  const html = document.documentElement;
  const body = document.body;
  const htmlCs = getComputedStyle(html);
  const bodyCs = getComputedStyle(body);

  const max = Math.round(html.scrollHeight - window.innerHeight);
  const d = data.current;

  const text = [
    `scrollY: ${Math.round(window.scrollY)} / max: ${max}`,
    `innerH: ${window.innerHeight}  scrollH: ${html.scrollHeight}`,
    `touchmoves: ${d.moves}  jsPrevented: ${d.prevented}  notCancelable: ${d.notCancelable}`,
    `scroll change in last swipe: ${d.delta}px`,
    `html: oy=${htmlCs.overflowY} ox=${htmlCs.overflowX} touch=${htmlCs.touchAction} class="${html.className}"`,
    `body: oy=${bodyCs.overflowY} ox=${bodyCs.overflowX} pos=${bodyCs.position} touch=${bodyCs.touchAction}`,
    `finger on: ${d.hit}`,
    ...d.chain.map((l) => `  > ${l}`),
  ].join("\n");

  return (
    <div
      style={{
        position: "fixed",
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 2147483647,
        maxHeight: "45vh",
        overflow: "hidden",
        padding: "6px 8px",
        background: "rgba(0,0,0,0.85)",
        color: "#7CFC00",
        font: "10px/1.35 monospace",
        whiteSpace: "pre-wrap",
        wordBreak: "break-all",
        pointerEvents: "none",
      }}
    >
      {text}
    </div>
  );
};

export default TouchDebug;