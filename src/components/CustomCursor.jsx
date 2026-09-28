import { useEffect, useRef } from "react";
import gsap from "gsap";

const lerp = (a, b, n) => (1 - n) * a + n * b;

const CustomCursor = () => {
  const cursorRefs = useRef([]);
  const turbulenceRef = useRef(null);

  useEffect(() => {
    const cursors = cursorRefs.current.filter(Boolean);
    if (!cursors.length) return;

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let isHovering = false;

    const trail = cursors.map((el, index) => ({
      x: mouseX,
      y: mouseY,
      ease: index === 0 ? 1 : 0.2 - index * 0.02,
    }));

    // -----------------------------
    // HOVER LOGIC & DISTORTION
    // -----------------------------
    const setHover = (value) => {
      if (isHovering === value) return;
      isHovering = value;

      cursors.forEach((cursor) => {
        const circle = cursor.querySelector(".cursor__inner");
        if (!circle) return;

        gsap.to(circle, {
          attr: { r: value ? 40 : 15 },
          duration: 0.35,
          ease: "power2.out",
          overwrite: true,
        });
      });

      if (!value && turbulenceRef.current) {
        gsap.killTweensOf(turbulenceRef.current);

        gsap.fromTo(
          turbulenceRef.current,
          { attr: { baseFrequency: 0.9 } },
          {
            attr: { baseFrequency: 0 },
            duration: 0.6,
            ease: "power2.out",
          }
        );
      }
    };

    // Live-ah cursor kela enna element iruku nu kandupudikka
    const checkHoverState = (clientX, clientY) => {
      const el = document.elementFromPoint(clientX, clientY);
      const target = el?.closest(
        "a, button, [data-cursor], h1, p"
      );

      setHover(!!target);
    };

    // -----------------------------
    // MOUSE MOVE & SCROLL FIX
    // -----------------------------
    const handleMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      checkHoverState(mouseX, mouseY);
    };

    const handleScroll = () => {
      checkHoverState(mouseX, mouseY);
    };

    window.addEventListener("mousemove", handleMouseMove, {
      passive: true,
    });

    window.addEventListener("scroll", handleScroll, {
      passive: true,
      capture: true,
    });

    // -----------------------------
    // SMALL BURST WITH SPARKLES
    // ONLY LEFT CLICK
    // -----------------------------
    const handleMouseDown = (e) => {
      // IMPORTANT:
      // 0 = left click
      // 1 = middle click
      // 2 = right click
      //
      // Right click should NOT trigger cursor animation.
      if (e.button !== 0) return;

      const burstContainer = document.createElement("div");

      burstContainer.style.position = "fixed";
      burstContainer.style.left = `${e.clientX}px`;
      burstContainer.style.top = `${e.clientY}px`;
      burstContainer.style.transform = "translate(-50%, -50%)";
      burstContainer.style.pointerEvents = "none";
      burstContainer.style.zIndex = "999999";

      burstContainer.innerHTML = `
        <svg width="100" height="100" viewBox="-50 -50 100 100">
          <circle
            class="burst-center"
            cx="0"
            cy="0"
            r="0"
            fill="#A71C1C"
          />

          <circle
            class="burst-ring-1"
            cx="0"
            cy="0"
            r="2"
            fill="none"
            stroke="#000000"
            stroke-width="2"
          />

          <circle
            class="burst-ring-2"
            cx="0"
            cy="0"
            r="2"
            fill="none"
            stroke="#A71C1C"
            stroke-width="1.5"
          />

          <g class="burst-sparks">
            ${Array.from({ length: 8 })
              .map(
                (_, i) => `
                  <circle
                    class="spark"
                    cx="0"
                    cy="-4"
                    r="1.5"
                    fill="#000000"
                    transform="rotate(${i * 45})"
                  />

                  <circle
                    class="spark-sub"
                    cx="0"
                    cy="-3"
                    r="1"
                    fill="#A71C1C"
                    transform="rotate(${i * 45 + 22.5})"
                  />
                `
              )
              .join("")}
          </g>
        </svg>
      `;

      document.body.appendChild(burstContainer);

      const center =
        burstContainer.querySelector(".burst-center");

      const ring1 =
        burstContainer.querySelector(".burst-ring-1");

      const ring2 =
        burstContainer.querySelector(".burst-ring-2");

      const sparks =
        burstContainer.querySelectorAll(".spark");

      const sparksSub =
        burstContainer.querySelectorAll(".spark-sub");

      const tl = gsap.timeline({
        onComplete: () => burstContainer.remove(),
      });

      tl.to(
        center,
        {
          attr: { r: 4 },
          opacity: 0,
          duration: 0.25,
          ease: "power2.out",
        },
        0
      )
        .to(
          ring1,
          {
            attr: { r: 15 },
            strokeWidth: 0,
            opacity: 0,
            duration: 0.35,
            ease: "power2.out",
          },
          0
        )
        .to(
          ring2,
          {
            attr: { r: 20 },
            strokeWidth: 0,
            opacity: 0,
            duration: 0.45,
            ease: "power2.out",
          },
          0.05
        )
        .to(
          sparks,
          {
            attr: { cy: -20 },
            opacity: 0,
            duration: 0.3,
            ease: "power2.out",
          },
          0
        )
        .to(
          sparksSub,
          {
            attr: { cy: -15 },
            opacity: 0,
            duration: 0.4,
            ease: "power2.out",
          },
          0.05
        );
    };

    window.addEventListener("mousedown", handleMouseDown);

    // -----------------------------
    // ANIMATION LOOP
    // -----------------------------
    let rafId;

    const animate = () => {
      trail[0].x = mouseX;
      trail[0].y = mouseY;

      cursors[0].style.transform = `translate3d(
        ${mouseX - 50}px,
        ${mouseY - 50}px,
        0
      )`;

      for (let i = 1; i < trail.length; i++) {
        const current = trail[i];
        const previous = trail[i - 1];

        current.x = lerp(
          current.x,
          previous.x,
          current.ease
        );

        current.y = lerp(
          current.y,
          previous.y,
          current.ease
        );

        cursors[i].style.transform = `translate3d(
          ${current.x - 50}px,
          ${current.y - 50}px,
          0
        )`;
      }

      rafId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener(
        "mousemove",
        handleMouseMove
      );

      window.removeEventListener(
        "scroll",
        handleScroll,
        { capture: true }
      );

      window.removeEventListener(
        "mousedown",
        handleMouseDown
      );

      cancelAnimationFrame(rafId);

      gsap.killTweensOf(turbulenceRef.current);
    };
  }, []);

  return (
    <>
      <svg
        ref={(el) => (cursorRefs.current[0] = el)}
        className="custom-cursor"
        width="100"
        height="100"
        viewBox="0 0 100 100"
        style={{ zIndex: 100000 }}
      >
        <defs>
          <filter
            id="cursor-filter"
            x="-50%"
            y="-50%"
            width="200%"
            height="200%"
          >
            <feTurbulence
              ref={turbulenceRef}
              type="fractalNoise"
              baseFrequency="0"
              numOctaves="1"
            />

            <feDisplacementMap
              xChannelSelector="R"
              yChannelSelector="G"
              scale="40"
              in="SourceGraphic"
            />
          </filter>
        </defs>

        <circle
          className="cursor__inner"
          cx="50"
          cy="50"
          r="15"
          filter="url(#cursor-filter)"
        />
      </svg>

      {[0.8, 0.6, 0.4, 0.2, 0.1, 0.05].map(
        (opacity, index) => (
          <svg
            key={index}
            ref={(el) =>
              (cursorRefs.current[index + 1] = el)
            }
            className="custom-cursor"
            width="100"
            height="100"
            viewBox="0 0 100 100"
            style={{
              opacity,
              zIndex: 99999 - index,
            }}
          >
            <circle
              className="cursor__inner"
              cx="50"
              cy="50"
              r="15"
            />
          </svg>
        )
      )}
    </>
  );
};

export default CustomCursor;