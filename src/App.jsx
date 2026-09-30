import React, { useState, useEffect, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

import Entrance from "./sections/Entrance";
import Navbar from "./sections/Navbar";
import Hero from "./sections/Hero";
import CustomCursor from "./components/CustomCursor";
import LoadingScreen from "./sections/LoadingScreen";

import ServiceSummary from "./sections/ServiceSummary";
import Services from "./sections/Services";
import About from "./sections/About";
import SectionShredTransition from "./components/SectionShredTransition";

import BuildTogether from "./sections/BuildTogether";
import WorkIntro from "./sections/WorkIntro";
import Work from "./sections/Work";
import Contact from "./sections/Contact";


import TouchDebug from "./sections/TouchDebug";

gsap.registerPlugin(ScrollTrigger);

/* =========================================
   MOBILE ADDRESS BAR FIX

   On phones the browser address bar shows /
   hides while scrolling, which resizes the
   viewport and makes ScrollTrigger refresh
   (pinned sections jump or get stuck).
   This makes ScrollTrigger ignore those
   vertical resizes. Desktop is unaffected.
========================================= */

ScrollTrigger.config({ ignoreMobileResize: true });

const App = () => {
  const [loading, setLoading] = useState(true);

  // MASTER SOUND
  const [soundEnabled, setSoundEnabled] = useState(true);

  const [exiting, setExiting] = useState(false);
  const [entered, setEntered] = useState(false);

  const handleEnter = () => {
    setExiting(true);

    setTimeout(() => {
      setEntered(true);
    }, 1700);
  };

  /* =========================================
     STABLE CALLBACK

     Before, an inline arrow function was passed
     to LoadingScreen. Every App re-render created
     a new function, which restarted the loading
     timeline (its effect depends on onComplete).
  ========================================= */

  const handleLoadingComplete = useCallback(() => {
    setLoading(false);
  }, []);

  /* =========================================
     LENIS SMOOTH SCROLL

     Desktop:
     - Lenis remains enabled.

     Mobile:
     - Lenis is disabled.
     - ScrollTrigger normalizeScroll is enabled so
       pinned / scrubbed sections stay in sync with
       native touch scrolling.

     If normalizeScroll makes mobile feel worse,
     delete the two normalizeScroll lines below.
  ========================================= */

  useEffect(() => {
    if (!entered) return;

    const isMobile =
      window.matchMedia("(max-width: 768px)").matches;

    if (isMobile) {
      ScrollTrigger.normalizeScroll(true);
      ScrollTrigger.refresh();

      return () => {
        ScrollTrigger.normalizeScroll(false);
      };
    }

    const lenis = new Lenis({
      lerp: 0.1,
      smoothWheel: true,
      syncTouch: false,
    });

    lenis.on("scroll", ScrollTrigger.update);

    const tick = (time) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
  }, [entered]);

  /* =========================================
     REFRESH SCROLLTRIGGER
  ========================================= */

  useEffect(() => {
    if (!entered) return;

    const refresh = () => {
      ScrollTrigger.refresh();
    };

    window.addEventListener("load", refresh);

    const timer = setTimeout(refresh, 300);

    return () => {
      window.removeEventListener("load", refresh);
      clearTimeout(timer);
    };
  }, [entered]);

  /* =========================================
     RIGHT-CLICK SUPPORT
  ========================================= */

  useEffect(() => {
    const allowRightClick = (e) => {
      if (e.button === 2) {
        e.stopImmediatePropagation();
      }
    };

    window.addEventListener("mousedown", allowRightClick, true);

    return () => {
      window.removeEventListener(
        "mousedown",
        allowRightClick,
        true
      );
    };
  }, []);

  useEffect(() => {
    const allowContextMenu = (e) => {
      e.stopImmediatePropagation();
    };

    window.addEventListener(
      "contextmenu",
      allowContextMenu,
      true
    );

    return () => {
      window.removeEventListener(
        "contextmenu",
        allowContextMenu,
        true
      );
    };
  }, []);

  return (
    <div
      className="
        relative
        w-full
        overflow-x-clip
        mobile-touch-scroll
      "
    >
      {/* =========================================
          ENTRANCE
      ========================================= */}

      {!entered && (
        <div
          className={`
            mobile-entrance-bg
            fixed
            inset-0
            z-[999]
            overflow-hidden
            transition-transform
            duration-[2000ms]
            ease-[cubic-bezier(0.76,0,0.24,1)]
            ${exiting ? "-translate-y-full" : "translate-y-0"}
          `}
        >
          <Entrance
            onEnter={handleEnter}
            soundEnabled={soundEnabled}
          />
        </div>
      )}

      {/* =========================================
          LOADING SCREEN
      ========================================= */}

      {loading && (
        <LoadingScreen onComplete={handleLoadingComplete} />
      )}

      {/* =========================================
          CUSTOM CURSOR
      ========================================= */}

      <CustomCursor />
      {new URLSearchParams(window.location.search).has("debug") && <TouchDebug />}

      {/* =========================================
          MAIN PORTFOLIO
      ========================================= */}

      {entered && (
        <>
          {/* NAVBAR */}

          <Navbar
            soundEnabled={soundEnabled}
            setSoundEnabled={setSoundEnabled}
          />

          {/* HERO */}

          <Hero />

          {/* SERVICES */}

          <div className="service-transition relative z-20 -mt-[100vh]">
            <ServiceSummary />

            <div className="services-layer">
              <Services />
            </div>
          </div>

          {/* ABOUT */}

          <SectionShredTransition>
            <About soundEnabled={soundEnabled} />
          </SectionShredTransition>

          {/* WORK INTRO */}

          <WorkIntro />

          {/* WORK */}

          <Work soundEnabled={soundEnabled} />

          {/* BUILD TOGETHER */}

          <BuildTogether />

          {/* CONTACT */}

          <Contact soundEnabled={soundEnabled} />
        </>
      )}
    </div>
  );
};

export default App;