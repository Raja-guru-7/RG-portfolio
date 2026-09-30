import React, { useEffect, useRef, useState } from "react";
import LiquidBackground from "threejs-components/build/backgrounds/liquid1.min.js";

const MOBILE_QUERY_WIDTH = 768;

const Entrance = ({ onEnter }) => {
  const canvasRef = useRef(null);
  const audioRef = useRef(null);
  const enteredRef = useRef(false);

  const [name, setName] = useState("");
  const [role, setRole] = useState("");

  /* =========================================
     DETECT MOBILE

     FIX: initial value is computed immediately.
     Before, it started as `false`, so on a phone
     the WebGL liquid effect was created on the
     first render and then abandoned when the
     state flipped to `true`.
  ========================================= */

  const [isMobile, setIsMobile] = useState(
    () =>
      typeof window !== "undefined" &&
      window.innerWidth <= MOBILE_QUERY_WIDTH
  );

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= MOBILE_QUERY_WIDTH);
    };

    window.addEventListener("resize", checkMobile);

    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  /* =========================================
     AUDIO PRELOAD
  ========================================= */

  useEffect(() => {
    const audio = new Audio("/sounds/water 3.mp3");

    audio.preload = "auto";
    audio.volume = 1;
    audio.load();

    audioRef.current = audio;

    return () => {
      audio.pause();
      audio.currentTime = 0;
      audioRef.current = null;
    };
  }, []);

  /* =========================================
     LIQUID BACKGROUND (DESKTOP ONLY)

     FIX: the app is now disposed properly so
     no WebGL renderer / listeners are left
     behind.
  ========================================= */

  useEffect(() => {
    if (isMobile) return;
    if (!canvasRef.current) return;

    const app = LiquidBackground(canvasRef.current);

    app.loadImage("/images/Fish.jpg");

    app.liquidPlane.material.metalness = 0.75;
    app.liquidPlane.material.roughness = 0.25;

    app.liquidPlane.uniforms.displacementScale.value = 5;

    app.setRain(false);

    return () => {
      try {
        app?.dispose?.();
      } catch (error) {
        console.warn("Liquid dispose failed:", error);
      }
    };
  }, [isMobile]);

  /* =========================================
     TYPING ANIMATION
  ========================================= */

  useEffect(() => {
    const fullName = "Welcome to R G's Portfolio";
    const fullRole = "FULL STACK DEVELOPER";

    let nameIndex = 0;
    let roleIndex = 0;

    let nameTimer;
    let roleTimer;

    const typeRole = () => {
      if (roleIndex <= fullRole.length) {
        setRole(fullRole.slice(0, roleIndex));
        roleIndex++;

        roleTimer = setTimeout(typeRole, 80);
      }
    };

    const typeName = () => {
      if (nameIndex <= fullName.length) {
        setName(fullName.slice(0, nameIndex));
        nameIndex++;

        nameTimer = setTimeout(typeName, 120);
      } else {
        roleTimer = setTimeout(typeRole, 500);
      }
    };

    typeName();

    return () => {
      clearTimeout(nameTimer);
      clearTimeout(roleTimer);
    };
  }, []);

  /* =========================================
     ENTER BUTTON

     FIX: entering no longer waits for the audio
     promise. On phones (Low Power Mode, slow
     network, autoplay rules) play() can stay
     pending forever, which made the button look
     dead. Audio is best-effort now; the site
     always opens.
  ========================================= */

  const handleEnter = () => {
    if (enteredRef.current) return;
    enteredRef.current = true;

    const audio = audioRef.current;

    if (audio) {
      try {
        audio.currentTime = 0;
        const playPromise = audio.play();

        if (playPromise && typeof playPromise.catch === "function") {
          playPromise.catch((error) => {
            console.warn("Audio play aagalai:", error);
          });
        }
      } catch (error) {
        console.warn("Audio error:", error);
      }
    }

    setTimeout(() => {
      onEnter();
    }, 350);
  };

  return (
    <section
      className="
        relative
        h-screen
        min-h-[100svh]
        w-full
        overflow-hidden
        bg-black
        touch-pan-y
      "
    >
      {/* =========================================
          DESKTOP LIQUID BACKGROUND
      ========================================= */}

      {!isMobile && (
        <canvas
          ref={canvasRef}
          className="
            absolute
            inset-0
            h-full
            w-full
          "
        />
      )}

      {/* =========================================
          MOBILE STATIC BACKGROUND
      ========================================= */}

      {isMobile && (
        <div
          className="
            absolute
            inset-0
            bg-black
          "
          style={{
            backgroundImage: 'url("/images/Fish.jpg")',
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        />
      )}

      {/* Dark Overlay */}

      <div
        className="
          absolute
          inset-0
          bg-black/20
          pointer-events-none
        "
      />

      {/* =========================================
          MAIN CONTENT
      ========================================= */}

      <div
        className="
          absolute
          inset-0
          z-10
          flex
          flex-col
          items-center
          justify-center
          px-5
          text-center
          touch-pan-y
        "
      >
        <h1
          className="
            max-w-full
            text-4xl
            font-black
            uppercase
            tracking-[-0.06em]
            text-[#fffbd4]

            max-[480px]:text-[2rem]
            max-[480px]:leading-tight
            max-[480px]:tracking-[-0.05em]

            sm:text-5xl
            md:text-6xl
            lg:text-6xl
          "
          style={{
            fontFamily:
              '"Arial Rounded MT Bold", "Trebuchet MS", sans-serif',
          }}
        >
          {name}
          <span className="animate-pulse">_</span>
        </h1>

        <p
          className="
            mt-4
            text-sm
            font-semibold
            uppercase
            tracking-[0.35em]
            text-[#fffbd4]

            max-[480px]:mt-3
            max-[480px]:text-[0.65rem]
            max-[480px]:tracking-[0.2em]

            sm:text-sm
            md:text-base
          "
          style={{
            fontFamily:
              '"Arial Rounded MT Bold", "Trebuchet MS", sans-serif',
          }}
        >
          {role}
        </p>

        {/* =========================================
            ENTER THE EXPERIENCE
        ========================================= */}

        <button
          type="button"
          onClick={handleEnter}
          className="
            relative
            mt-12
            px-8
            py-4
            text-sm
            font-semibold
            uppercase
            tracking-wider
            text-[#fffbd4]
            transition-all
            duration-300

            hover:bg-[#fffbd4]
            hover:text-black
            hover:scale-109

            active:translate-y-0.5
            active:scale-90

            max-[480px]:mt-9
            max-[480px]:px-6
            max-[480px]:py-3.5
            max-[480px]:text-[0.65rem]
            max-[480px]:tracking-[0.12em]

            sm:px-7
            sm:py-4

            md:px-8
            md:py-4
            md:text-sm
          "
          style={{
            fontFamily:
              '"Arial Rounded MT Bold", "Trebuchet MS", sans-serif',
            touchAction: "manipulation",
          }}
        >
          <span className="corner top-left"></span>
          <span className="corner top-right"></span>
          <span className="corner bottom-left"></span>
          <span className="corner bottom-right"></span>

          <span className="relative z-10">
            ENTER THE EXPERIENCE
          </span>
        </button>
      </div>

      {/* =========================================
          BOTTOM BALL
      ========================================= */}

      <div
        className="
          absolute
          bottom-8
          left-1/2
          z-10
          -translate-x-1/2
          pointer-events-none

          max-[480px]:bottom-5
        "
      >
        <div
          className="
            flex
            h-12
            w-12
            items-center
            justify-center
            rounded-full
            border
            border-[#fffbd4]/60

            max-[480px]:h-10
            max-[480px]:w-10
          "
        >
          <div
            className="
              h-2.5
              w-2.5
              rounded-full
              bg-[#fffbd4]

              max-[480px]:h-2
              max-[480px]:w-2
            "
          />
        </div>
      </div>

      {/* =========================================
          BUTTON CORNER CSS
      ========================================= */}

      <style>{`
        .corner {
          position: absolute;
          width: 12px;
          height: 12px;
          border-color: rgba(255, 251, 212, 0.7);
          border-style: solid;
        }

        .top-left {
          top: 0;
          left: 0;
          border-width: 1px 0 0 1px;
        }

        .top-right {
          top: 0;
          right: 0;
          border-width: 1px 1px 0 0;
        }

        .bottom-left {
          bottom: 0;
          left: 0;
          border-width: 0 0 1px 1px;
        }

        .bottom-right {
          bottom: 0;
          right: 0;
          border-width: 0 1px 1px 0;
        }
      `}</style>
    </section>
  );
};

export default Entrance;