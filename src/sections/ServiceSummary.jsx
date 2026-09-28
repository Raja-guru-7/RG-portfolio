import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const ServiceSummary = () => {
  const containerRef = useRef(null);

  useGSAP(
    () => {
      /* =========================================
         SUMMARY TEXT ANIMATION
      ========================================= */

      const textTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
          end: "center 55%",
          scrub: true,
        },
      });

      textTimeline
        .from("#title-service-1", { xPercent: -20 }, 0)
        .from("#title-service-2", { xPercent: 20 }, 0)
        .from("#title-service-3", { xPercent: -20 }, 0)
        .from("#title-service-4", { xPercent: 20 }, 0);

      /* =========================================
         SUMMARY HIDE
         The services layer gradually covers the summary.

         - Y movement creates a subtle parallax effect.
         - Scale and opacity provide a soft transition.
      ========================================= */

      const hideTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "+=100%",
          scrub: true,
          invalidateOnRefresh: true,
        },
      });

      hideTimeline
        .fromTo(
          containerRef.current,
          { y: 0 },
          {
            y: () => window.innerHeight * 0.5,
            ease: "power2.in",
            duration: 1,
          },
          0
        )
        .fromTo(
          containerRef.current,
          {
            scale: 1,
            opacity: 1,
          },
          {
            scale: 0.9,
            opacity: 0.15,
            transformOrigin: "center center",
            force3D: true,
            ease: "sine.inOut",
            duration: 1,
          },
          0
        );
    },
    {
      scope: containerRef,
    }
  );

  return (
    <section
      ref={containerRef}
      style={{
        fontSize: "clamp(1.5rem, 5vw, 5rem)",
      }}
      className="
        service-summary-section
        relative
        z-10
        flex
        min-h-screen
        flex-col
        items-center
        justify-center
        gap-4
        overflow-hidden
        bg-[#fffbd4]
        text-center
        font-light
        leading-snug
      "
    >
      {/* LINE 1 */}

      <div
        id="title-service-1"
        className="min-w-max whitespace-nowrap"
      >
        <p>Architecture</p>
      </div>

      {/* LINE 2 */}

      <div
        id="title-service-2"
        className="
          flex
          min-w-max
          items-center
          justify-center
          gap-3
          whitespace-nowrap
        "
      >
        <p className="flex-shrink-0 font-normal">
          Development
        </p>

        <div className="h-1 w-[1.2em] flex-shrink-0 bg-gold" />

        <p className="flex-shrink-0">
          Deployment
        </p>
      </div>

      {/* LINE 3 */}

      <div
        id="title-service-3"
        className="
          flex
          min-w-max
          items-center
          justify-center
          gap-3
          whitespace-nowrap
        "
      >
        <p className="flex-shrink-0">
          APIs
        </p>

        <div className="h-1 w-[1.2em] flex-shrink-0 bg-gold" />

        <p className="flex-shrink-0 italic">
          Frontends
        </p>

        <div className="h-1 w-[1.2em] flex-shrink-0 bg-gold" />

        <p className="flex-shrink-0">
          Scalability
        </p>
      </div>

      {/* LINE 4 */}

      <div
        id="title-service-4"
        className="min-w-max whitespace-nowrap"
      >
        <p>Databases</p>
      </div>
    </section>
  );
};

export default ServiceSummary;