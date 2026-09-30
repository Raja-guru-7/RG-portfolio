import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const SectionShredTransition = ({ children, className = "" }) => {
  const wrapperRef = useRef(null);
  const contentRef = useRef(null);
  const topCurtainRef = useRef(null);
  const bottomCurtainRef = useRef(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(wrapperRef);

      // How much of the content is taller than the screen (mobile only)
      const getOverflow = () =>
        Math.max(
          0,
          contentRef.current.offsetHeight - wrapperRef.current.clientHeight
        );

      const buildTimeline = (scrollTrigger, isMobile = false) => {
        const tl = gsap.timeline({ scrollTrigger });

        // 1. Open the curtains
        tl.to(topCurtainRef.current, { yPercent: -100, duration: 1 }, 0);
        tl.to(bottomCurtainRef.current, { yPercent: 100, duration: 1 }, 0);

        // Permanently hide the curtains once fully open
        tl.set(
          [topCurtainRef.current, bottomCurtainRef.current],
          { display: "none" },
          1
        );

        // 2. Reveal the left-side image
        tl.to(
          q(".about-hero-img"),
          {
            scale: 1,
            opacity: 1,
            duration: 1.5,
            ease: "power2.out",
          },
          0.2
        );

        // 3. Reveal the right-side text
        tl.fromTo(
          q(".about-text-reveal"),
          { y: 50, autoAlpha: 0 },
          {
            y: 0,
            autoAlpha: 1,
            duration: 1,
            stagger: 0.15,
            ease: "power3.out",
          },
          0.4
        );

        // 4. MOBILE ONLY: while still pinned, scroll through the tall content
        if (isMobile) {
          tl.to(
            contentRef.current,
            {
              y: () => -getOverflow(),
              duration: 1.5,
              ease: "none",
            },
            1.9
          );
        }

        return tl;
      };

      const mm = gsap.matchMedia();

      // DESKTOP: exactly the same as before
      mm.add("(min-width: 769px)", () => {
        buildTimeline({
          trigger: wrapperRef.current,
          start: "top top",
          end: "+=150%",
          scrub: 1,
          pin: true,
          pinSpacing: true,
        });
      });

      // MOBILE: same pinned cinematic effect, and the tall content
      // scrolls inside the pin so nothing is cut off / stuck
      mm.add("(max-width: 768px)", () => {
        buildTimeline(
          {
            trigger: wrapperRef.current,
            start: "top top",
            end: () =>
              "+=" +
              (wrapperRef.current.clientHeight * 1.5 + getOverflow()),
            scrub: 1,
            pin: true,
            pinSpacing: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
          true
        );
      });

      return () => mm.revert();
    },
    { scope: wrapperRef, dependencies: [] }
  );

  return (
    <div className="w-full bg-[#fffbd4]">
      <div
        ref={wrapperRef}
        className={`relative w-full bg-[#fffbd4] overflow-hidden max-md:h-[100svh] ${className}`}
      >
        <div
          ref={topCurtainRef}
          className="absolute top-0 left-0 z-50 w-full h-[51vh] bg-black will-change-transform"
        />

        <div
          ref={bottomCurtainRef}
          className="absolute top-[49.5vh] left-0 z-50 w-full h-[51vh] bg-black will-change-transform"
        />

        <div
          ref={contentRef}
          className="relative z-0 w-full opacity-100 will-change-transform"
        >
          {children}
        </div>
      </div>
    </div>
  );
};

export default SectionShredTransition;