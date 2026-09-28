import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const WorkIntro = () => {
  const sectionRef = useRef(null);
  const introRef = useRef(null);
  const lineRef = useRef(null);
  const wordsRef = useRef([]);

  useGSAP(
    () => {
      const ctx = gsap.context(() => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "+=1600",
            scrub: 1,
            pin: true,
            anticipatePin: 1,
          },
        });

        // Intro content exits before the main statement appears
        tl.to(
          introRef.current,
          {
            y: -120,
            opacity: 0,
            scale: 0.92,
            duration: 1,
            ease: "none",
          },
          0
        );

        // Reveal the divider line
        tl.fromTo(
          lineRef.current,
          {
            scaleX: 0,
            transformOrigin: "left center",
          },
          {
            scaleX: 1,
            duration: 0.8,
            ease: "none",
          },
          0.15
        );

        // Reveal the main statement word by word
        wordsRef.current.forEach((word, index) => {
          if (!word) return;

          tl.fromTo(
            word,
            {
              y: 100,
              opacity: 0,
            },
            {
              y: 0,
              opacity: 1,
              duration: 0.7,
              ease: "none",
            },
            0.7 + index * 0.35
          );
        });

        // Apply the final subtle movement
        tl.to(
          ".work-intro-bottom",
          {
            y: -30,
            opacity: 0.5,
            duration: 0.5,
            ease: "none",
          },
          2.1
        );
      }, sectionRef);

      return () => ctx.revert();
    },
    { scope: sectionRef }
  );

  const words = [
    "DIGITAL",
    "EXPERIENCES",
    "THAT",
    "TURN",
    "IDEAS",
    "INTO",
    "PRODUCTS.",
  ];

  return (
    <section
      ref={sectionRef}
      className="
        relative
        z-10
        flex
        min-h-screen
        items-center
        overflow-hidden
        bg-[#fffbd4]
        text-black
      "
    >
      <div className="mx-auto w-full max-w-7xl px-6 md:px-10">

        {/* INTRO */}
        <div
          ref={introRef}
          className="absolute left-6 right-6 top-1/2 -translate-y-1/2 md:left-10 md:right-10"
        >
          <p className="mb-6 text-xs uppercase tracking-[0.4em] text-black/50 md:text-sm">
            Selected Work
          </p>

          <p className="max-w-2xl text-lg font-light leading-relaxed tracking-wide md:text-2xl">
            A collection of digital products built with clean engineering,
            thoughtful interaction and a strong focus on user experience.
          </p>
        </div>

        {/* MAIN CONTENT */}
        <div className="relative w-full">

          {/* TOP LABEL */}
          <div className="mb-6 flex items-center justify-between">
            <span className="text-xs uppercase tracking-[0.35em]">
              What I build
            </span>

            <span className="text-xs tracking-[0.25em] text-[#a90e02] md:text-sm">
              2026
            </span>
          </div>

          {/* DIVIDER */}
          <div
            ref={lineRef}
            className="mb-8 h-px w-full bg-black"
          />

          {/* BIG TYPOGRAPHY */}
          <div className="overflow-hidden">
            {words.map((word, index) => (
              <div
                key={word}
                ref={(el) => {
                  wordsRef.current[index] = el;
                }}
                className="
                  translate-y-[100px]
                  text-[clamp(3rem,8vw,8rem)]
                  font-light
                  uppercase
                  leading-[0.82]
                  tracking-[-0.055em]
                  opacity-0
                "
              >
                {word}
              </div>
            ))}
          </div>

          {/* BOTTOM */}
          <div className="work-intro-bottom mt-10 flex items-center justify-between border-t border-black/20 pt-5">
            <span className="text-xs uppercase tracking-[0.3em] text-black/50">
              From concept
            </span>

            <span className="text-xs uppercase tracking-[0.3em] text-black/50">
              To production
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WorkIntro;