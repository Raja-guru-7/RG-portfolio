import { useRef } from "react";
import AnimatedHeaderSection from "../components/AnimatedHeaderSection";
import { servicesData } from "../constants";
import { useMediaQuery } from "react-responsive";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const Services = () => {
  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const cardsRef = useRef(null);
  const serviceRefs = useRef([]);

  // =========================================
  // SERVICES DESCRIPTION
  // =========================================

  const text = `Engineering production-grade web applications 
  with scalable architectures and immersive interfaces. 
  Clean code, zero compromises.`;

  const isDesktop = useMediaQuery({
    minWidth: 768,
  });

  // =========================================
  // GSAP
  // =========================================

  useGSAP(
    () => {
      /* =========================================
         SERVICE CARDS ENTRY
      ========================================= */

      serviceRefs.current.forEach((el) => {
        if (!el) return;

        gsap.fromTo(
          el,
          {
            y: 80,
            opacity: 0,
          },
          {
            y: 0,
            opacity: 1,
            ease: "none",
            scrollTrigger: {
              trigger: el,
              start: "top 95%",
              end: "top 65%",
              scrub: true,
            },
          }
        );
      });

      /* =========================================
         HEADER FADES AS CARDS COME IN
      ========================================= */

      if (headerRef.current && cardsRef.current) {
        gsap.to(headerRef.current, {
          opacity: 0,
          scale: 0.94,
          transformOrigin: "top center",
          ease: "none",
          scrollTrigger: {
            trigger: cardsRef.current,
            start: "top 45%",
            end: "top 10%",
            scrub: true,
          },
        });
      }
    },
    {
      scope: sectionRef,
    }
  );

  return (
    <section
      ref={sectionRef}
      id="services"
      className="
        relative
        z-20
        min-h-screen
        overflow-clip
        bg-black
        text-[#fffbd4]
        antialiased
      "
    >
      {/* =========================================
          SERVICES HEADER
      ========================================= */}

      <div
        ref={headerRef}
        className="
          sticky
          top-0
          z-0

          max-[767px]:min-h-[100svh]
          max-[767px]:w-full
          max-[767px]:max-w-full
          max-[767px]:overflow-hidden
        "
      >
        {/* =========================================
            MOBILE HEADER SCALE
        ========================================= */}

        <div
          className="
            w-full

            max-[767px]:origin-top-center
            max-[767px]:scale-[0.72]
            max-[767px]:w-[138.88%]
            max-[767px]:-translate-x-[14%]
          "
        >
          <AnimatedHeaderSection
            subTitle="From Database to 3D Canvas"
            title="Expertise"
            text={text}
            textColor="text-[#fffbd4]"
            withScrollTrigger={true}
          />
        </div>
      </div>

      {/* =========================================
          SERVICE CARDS
      ========================================= */}

      <div
        ref={cardsRef}
        className="
          relative
          z-10
          mt-10

          max-[767px]:mt-0
        "
      >
        {servicesData.map((service, index) => (
          <div
            key={service.title}
            ref={(el) => {
              serviceRefs.current[index] = el;
            }}
            className="
              sticky
              border-t
              border-white/20
              bg-black
              px-6
              pb-12
              pt-6
              text-[#fffbd4]
              md:px-10
              will-change-transform

              max-[767px]:px-5
              max-[767px]:pb-10
              max-[767px]:pt-5
            "
            style={
              isDesktop
                ? {
                    top: `calc(10vh + ${index * 5}rem)`,
                    marginBottom: `${
                      (servicesData.length - index - 1) * 5
                    }rem`,
                    zIndex: index + 1,
                  }
                : {
                    top: 0,
                    zIndex: index + 1,
                  }
            }
          >
            <div
              className="
                mx-auto
                max-w-7xl

                max-[767px]:w-full
              "
            >
              {/* =========================================
                  SERVICE TITLE
              ========================================= */}

              <div
                className="
                  mb-10
                  flex
                  items-baseline
                  gap-4

                  max-[767px]:mb-7
                  max-[767px]:gap-3
                "
              >
                <span
                  className="
                    text-sm
                    font-medium
                    tracking-[0.3em]
                    text-[#a90e02]

                    max-[767px]:text-[0.65rem]
                    max-[767px]:tracking-[0.2em]
                  "
                >
                  0{index + 1}
                </span>

                <h2
                  className="
                    text-xl
                    font-medium
                    leading-none
                    tracking-tight
                    md:text-2xl
                    lg:text-3xl

                    max-[767px]:text-2xl
                  "
                >
                  {service.title}
                </h2>
              </div>

              {/* =========================================
                  DESCRIPTION
              ========================================= */}

              <p
                className="
                  mb-8
                  max-w-4xl
                  text-sm
                  font-light
                  leading-relaxed
                  tracking-wide
                  text-white/70
                  md:text-base
                  lg:text-lg

                  max-[767px]:mb-7
                  max-[767px]:max-w-none
                  max-[767px]:text-[0.85rem]
                  max-[767px]:leading-[1.7]
                  max-[767px]:tracking-normal
                "
              >
                {service.description}
              </p>

              {/* =========================================
                  SERVICE ITEMS
              ========================================= */}

              <div className="border-t border-white/20">
                {service.items.map((item, itemIndex) => (
                  <div
                    key={`${service.title}-${item.title}`}
                    className="
                      group
                      flex
                      flex-col
                      gap-3
                      border-b
                      border-white/15
                      py-5
                      transition-all
                      duration-300

                      md:flex-row
                      md:items-center
                      md:justify-between
                      md:py-6

                      max-[767px]:gap-2.5
                      max-[767px]:py-5
                    "
                  >
                    {/* =========================================
                        ITEM TITLE
                    ========================================= */}

                    <div
                      className="
                        flex
                        min-w-0
                        items-center
                        gap-6

                        max-[767px]:gap-4
                      "
                    >
                      <span
                        className="
                          flex-shrink-0
                          text-sm
                          font-light
                          text-white/30

                          max-[767px]:text-xs
                        "
                      >
                        0{itemIndex + 1}
                      </span>

                      <h3
                        className="
                          text-lg
                          font-medium
                          transition-colors
                          duration-300
                          group-hover:text-[#a90e02]

                          md:text-xl

                          max-[767px]:text-base
                          max-[767px]:leading-snug
                        "
                      >
                        {item.title}
                      </h3>
                    </div>

                    {/* =========================================
                        ITEM DESCRIPTION
                    ========================================= */}

                    <p
                      className="
                        text-xs
                        font-light
                        tracking-wide
                        text-white/50
                        md:text-right

                        max-[767px]:pl-8
                        max-[767px]:text-[0.7rem]
                        max-[767px]:leading-relaxed
                        max-[767px]:tracking-normal
                      "
                    >
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Services;