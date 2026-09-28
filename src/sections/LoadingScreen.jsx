import React, { useEffect, useRef } from "react";
import gsap from "gsap";

const LoadingScreen = ({ onComplete }) => {
  const screenRef = useRef(null);
  const lineRef = useRef(null);
  const counterRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const counter = { value: 0 };

      const tl = gsap.timeline({
        onComplete: () => {
          onComplete?.();
        },
      });

      tl.to(counter, {
        value: 100,
        duration: 2.2,
        ease: "power2.inOut",

        onUpdate: () => {
          if (counterRef.current) {
            counterRef.current.textContent = `${Math.floor(
              counter.value
            )}%`;
          }
        },
      });

      tl.to(
        lineRef.current,
        {
          scaleX: 1,
          duration: 2.2,
          ease: "power2.inOut",
        },
        0
      );

      tl.to(screenRef.current, {
        yPercent: -100,
        duration: 1.1,
        ease: "power4.inOut",
      });
    }, screenRef);

    return () => ctx.revert();
  }, [onComplete]);

  return (
    <div
      ref={screenRef}
      className="
        fixed
        inset-0
        z-[99999]
        flex
        items-center
        justify-center
        overflow-hidden
        bg-black
        text-[#fffbd4]
      "
    >
      <div className="w-full max-w-7xl px-6 md:px-10">

        {/* TOP */}
        <div className="flex items-center justify-between">
          <span className="text-[10px] uppercase tracking-[0.4em] text-white/40">
            RG / 2026
          </span>

          <span
            ref={counterRef}
            className="
              text-sm
              font-light
              tracking-[0.2em]
              text-[#fffbd4]
              md:text-base
            "
          >
            0%
          </span>
        </div>

        {/* PROGRESS */}
        <div className="mt-6">
          <div className="h-px w-full bg-white/10">
            <div
              ref={lineRef}
              className="
                h-px
                w-full
                origin-left
                scale-x-0
                bg-[#a90e02]
              "
            />
          </div>

          <div className="mt-3">
            <span className="text-[9px] uppercase tracking-[0.35em] text-white/30">
              Loading portfolio
            </span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default LoadingScreen;