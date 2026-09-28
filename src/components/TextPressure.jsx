import { useEffect, useRef, useState, useMemo, useCallback } from "react";

const dist = (a, b) => {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  return Math.sqrt(dx * dx + dy * dy);
};

const getAttr = (distance, maxDist, minVal, maxVal) => {
  const val = maxVal - Math.abs((maxVal * distance) / maxDist);
  return Math.max(minVal, val + minVal);
};

const debounce = (func, delay) => {
  let timeoutId;

  return (...args) => {
    clearTimeout(timeoutId);

    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  };
};

const TextPressure = ({
  text = "Compressa",
  fontFamily = "Roboto Flex",
  fontUrl = "https://fonts.googleapis.com/css2?family=Roboto+Flex:opsz,wdth,wght@8..144,25..151,100..1000&display=swap",

  width = true,
  weight = true,
  italic = true,
  alpha = false,

  flex = true,
  stroke = false,
  scale = false,

  textColor = "#FFFFFF",
  strokeColor = "#FF0000",
  className = "",

  minFontSize = 24,
}) => {
  const containerRef = useRef(null);
  const titleRef = useRef(null);
  const spansRef = useRef([]);

  const mouseRef = useRef({ x: 0, y: 0 });
  const cursorRef = useRef({ x: 0, y: 0 });

  const [fontSize, setFontSize] = useState(minFontSize);
  const [scaleY, setScaleY] = useState(1);
  const [lineHeight, setLineHeight] = useState(1);

  const chars = text.split("");

  /*
   * Load the variable font through a real stylesheet link.
   * This is more reliable across Chromium-based browsers,
   * including Opera, than using @import inside a React-injected style tag.
   */
  useEffect(() => {
    const existingLink = document.querySelector(
      'link[data-text-pressure-font="roboto-flex"]'
    );

    if (existingLink) return;

    const link = document.createElement("link");

    link.rel = "stylesheet";
    link.href = fontUrl;
    link.dataset.textPressureFont = "roboto-flex";

    document.head.appendChild(link);

    return () => {
      const currentLink = document.querySelector(
        'link[data-text-pressure-font="roboto-flex"]'
      );

      if (currentLink) {
        currentLink.remove();
      }
    };
  }, [fontUrl]);

  /*
   * Track mouse position.
   */
  useEffect(() => {
    const handleMouseMove = (e) => {
      cursorRef.current.x = e.clientX;
      cursorRef.current.y = e.clientY;
    };

    const handleTouchMove = (e) => {
      const touch = e.touches[0];

      if (!touch) return;

      cursorRef.current.x = touch.clientX;
      cursorRef.current.y = touch.clientY;
    };

    window.addEventListener("mousemove", handleMouseMove, {
      passive: true,
    });

    window.addEventListener("touchmove", handleTouchMove, {
      passive: true,
    });

    if (containerRef.current) {
      const { left, top, width, height } =
        containerRef.current.getBoundingClientRect();

      mouseRef.current.x = left + width / 2;
      mouseRef.current.y = top + height / 2;

      cursorRef.current.x = mouseRef.current.x;
      cursorRef.current.y = mouseRef.current.y;
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
    };
  }, []);

  /*
   * Calculate responsive text size.
   */
  const setSize = useCallback(() => {
    if (!containerRef.current || !titleRef.current) return;

    const {
      width: containerW,
      height: containerH,
    } = containerRef.current.getBoundingClientRect();

    let newFontSize = Math.min(containerW / 10, 180);

    newFontSize = Math.max(newFontSize, minFontSize);

    setFontSize(newFontSize);
    setScaleY(1);
    setLineHeight(1);

    requestAnimationFrame(() => {
      if (!titleRef.current) return;

      const textRect = titleRef.current.getBoundingClientRect();

      if (scale && textRect.height > 0) {
        const yRatio = containerH / textRect.height;

        setScaleY(yRatio);
        setLineHeight(yRatio);
      }
    });
  }, [minFontSize, scale]);

  useEffect(() => {
    const debouncedSetSize = debounce(setSize, 100);

    debouncedSetSize();

    window.addEventListener("resize", debouncedSetSize);

    return () => {
      window.removeEventListener("resize", debouncedSetSize);
    };
  }, [setSize]);

  /*
   * Apply the variable-font effect.
   */
  useEffect(() => {
    let rafId;

    const animate = () => {
      mouseRef.current.x +=
        (cursorRef.current.x - mouseRef.current.x) / 15;

      mouseRef.current.y +=
        (cursorRef.current.y - mouseRef.current.y) / 15;

      if (titleRef.current) {
        const titleRect = titleRef.current.getBoundingClientRect();

        const maxDist = Math.max(titleRect.width / 2, 1);

        spansRef.current.forEach((span) => {
          if (!span) return;

          const rect = span.getBoundingClientRect();

          const charCenter = {
            x: rect.left + rect.width / 2,
            y: rect.top + rect.height / 2,
          };

          const distance = dist(mouseRef.current, charCenter);

          const wdth = width
            ? Math.floor(getAttr(distance, maxDist, 5, 200))
            : 100;

          const wght = weight
            ? Math.floor(getAttr(distance, maxDist, 150, 600))
            : 400;

          const italVal = italic
            ? getAttr(distance, maxDist, 0, 1).toFixed(2)
            : 0;

          const alphaVal = alpha
            ? getAttr(distance, maxDist, 0, 1).toFixed(2)
            : 1;

          const variationSettings =
            `'wght' ${wght}, ` +
            `'wdth' ${wdth}, ` +
            `'ital' ${italVal}`;

          /*
           * Standard property.
           */
          if (
            span.style.fontVariationSettings !== variationSettings
          ) {
            span.style.fontVariationSettings = variationSettings;
          }

          /*
           * WebKit fallback for browser compatibility.
           */
          if (
            span.style.webkitFontVariationSettings !==
            variationSettings
          ) {
            span.style.webkitFontVariationSettings =
              variationSettings;
          }

          if (alpha) {
            span.style.opacity = alphaVal;
          }
        });
      }

      rafId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(rafId);
    };
  }, [width, weight, italic, alpha]);

  const styleElement = useMemo(() => {
    return (
      <style>{`
        .text-pressure-flex {
          display: flex;
          justify-content: flex-start;
          gap: 0.15em;
        }

        .stroke span {
          position: relative;
          color: ${textColor};
        }

        .stroke span::after {
          content: attr(data-char);
          position: absolute;
          left: 0;
          top: 0;
          color: transparent;
          z-index: -1;
          -webkit-text-stroke-width: 3px;
          -webkit-text-stroke-color: ${strokeColor};
        }

        .text-pressure-title {
          color: ${textColor};
        }
      `}</style>
    );
  }, [textColor, strokeColor]);

  const dynamicClassName = [
    className,
    flex ? "text-pressure-flex" : "",
    stroke ? "stroke" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      ref={containerRef}
      style={{
        position: "relative",
        width: "100%",
        height: "180px",
        background: "transparent",
        display: "flex",
        alignItems: "flex-end",
      }}
    >
      {styleElement}

      <h1
        ref={titleRef}
        className={`text-pressure-title ${dynamicClassName}`}
        style={{
          fontFamily: `"${fontFamily}", sans-serif`,
          textTransform: "uppercase",
          fontSize,
          lineHeight,
          transform: `scale(1, ${scaleY})`,
          transformOrigin: "left top",
          margin: 0,
          textAlign: "left",
          userSelect: "none",
          whiteSpace: "nowrap",
          fontWeight: 100,
          width: "100%",
        }}
      >
        {chars.map((char, index) => (
          <span
            key={index}
            ref={(element) => {
              spansRef.current[index] = element;
            }}
            data-char={char}
            style={{
              display: "inline-block",
              color: stroke ? undefined : textColor,

              /*
               * Explicit variable-font support.
               */
              fontVariationSettings:
                "'wght' 100, 'wdth' 100, 'ital' 0",

              WebkitFontVariationSettings:
                "'wght' 100, 'wdth' 100, 'ital' 0",

              willChange: "font-variation-settings",
            }}
          >
            {char}
          </span>
        ))}
      </h1>
    </div>
  );
};

export default TextPressure;