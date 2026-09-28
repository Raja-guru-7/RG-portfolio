import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const SectionShredTransition = ({ children, className = "" }) => {
  const wrapperRef = useRef(null);
  const topCurtainRef = useRef(null);
  const bottomCurtainRef = useRef(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: wrapperRef.current,
          start: "top top",
          end: "+=150%",
          scrub: 1,
          pin: true,
          pinSpacing: true,
        },
      });

      // 1. Open the curtains
      tl.to(topCurtainRef.current, { yPercent: -100, duration: 1 }, 0);
      tl.to(bottomCurtainRef.current, { yPercent: 100, duration: 1 }, 0);

      // MAIN FIX: Permanently hide the curtains once they are fully open
      tl.set([topCurtainRef.current, bottomCurtainRef.current], { display: "none" }, 1);

      const q = gsap.utils.selector(wrapperRef);

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
    },
    { scope: wrapperRef, dependencies: [] }
  );

  return (
    <div className="w-full bg-[#fffbd4]">
      <div
        ref={wrapperRef}
        className={`relative w-full bg-[#fffbd4] overflow-hidden ${className}`}
      >
        <div
          ref={topCurtainRef}
          className="absolute top-0 left-0 z-50 w-full h-[51vh] bg-black will-change-transform"
        />

        <div
          ref={bottomCurtainRef}
          className="absolute top-[49.5vh] left-0 z-50 w-full h-[51vh] bg-black will-change-transform"
        />

        <div className="relative z-0 w-full opacity-100">
          {children}
        </div>
      </div>
    </div>
  );
};

export default SectionShredTransition;