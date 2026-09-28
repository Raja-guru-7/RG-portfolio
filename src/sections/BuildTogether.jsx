import React from "react";
import ScrollReveal from "../components/ScrollReveal";

const BuildTogether = () => {
  return (
    <section
      id="build-together"
      className="
        relative
        min-h-[120vh]
        md:min-h-[160vh]
        overflow-hidden
        bg-black
        text-[#fffbd4]
      "
    >
      {/* =========================================
         CINEMATIC TEXT AREA
      ========================================== */}

      <div
        className="
          mx-auto
          flex
          min-h-[100vh]
          md:min-h-[140vh]
          max-w-[1600px]
          flex-col
          justify-center
          px-4
          py-24
          sm:px-6
          sm:py-32
          md:px-10
          lg:px-16
        "
      >
        {/* Small intro */}
        <div className="mb-12 flex items-center gap-3 sm:gap-4 sm:mb-16 md:mb-24">
          <span className="h-px w-8 sm:w-12 bg-[#a90e02]" />

          <span
            className="
              text-[9px]
              sm:text-[10px]
              uppercase
              tracking-[0.3em]
              sm:tracking-[0.4em]
              text-white/40
              md:text-xs
            "
          >
            What's next
          </span>
        </div>

        {/* =====================================
            HUGE CINEMATIC STATEMENT
        ====================================== */}

        <div className="w-full">
          <ScrollReveal
            baseOpacity={0.08}
            enableBlur
            baseRotation={3}
            blurStrength={6}
            rotationEnd="bottom 75%"
            wordAnimationEnd="bottom 65%"
            textClassName="
              !text-[clamp(2.5rem,8vw,9rem)]
              sm:!text-[clamp(3.5rem,9vw,9rem)]
              !font-light
              !leading-[0.95]
              sm:!leading-[0.88]
              !tracking-[-0.04em]
              sm:!tracking-[-0.065em]
            "
          >
            Good work starts with a good idea.
          </ScrollReveal>

          <ScrollReveal
            baseOpacity={0.08}
            enableBlur
            baseRotation={-3}
            blurStrength={6}
            rotationEnd="bottom 75%"
            wordAnimationEnd="bottom 65%"
            textClassName="
              !text-[clamp(2.5rem,8vw,9rem)]
              sm:!text-[clamp(3.5rem,9vw,9rem)]
              !font-light
              !leading-[0.95]
              sm:!leading-[0.88]
              !tracking-[-0.04em]
              sm:!tracking-[-0.065em]
            "
          >
            Great products start with a conversation.
          </ScrollReveal>

          {/* Crimson statement */}

          <div className="mt-8 md:mt-16">
            <ScrollReveal
              baseOpacity={0.05}
              enableBlur
              baseRotation={3}
              blurStrength={7}
              rotationEnd="bottom 75%"
              wordAnimationEnd="bottom 65%"
              textClassName="
                !text-[clamp(2.5rem,8vw,9rem)]
                sm:!text-[clamp(3.5rem,9vw,9rem)]
                !font-light
                !leading-[0.95]
                sm:!leading-[0.88]
                !tracking-[-0.04em]
                sm:!tracking-[-0.065em]
                !text-[#a90e02]
              "
            >
             Ideas become experiences.
            </ScrollReveal>
          </div>
        </div>

        {/* =====================================
            BOTTOM CTA
        ====================================== */}

        <div
          className="
            mt-20
            flex
            flex-col
            gap-8
            border-t
            border-white/15
            pt-6
            sm:pt-8
            sm:mt-28
            md:mt-40
            md:flex-row
            md:items-end
            md:justify-between
          "
        >
          <p
            className="
              max-w-xl
              text-xs
              sm:text-sm
              font-light
              leading-relaxed
              tracking-wide
              text-white/45
              md:text-base
            "
          >
            From an idea on a blank screen to a product people can actually
            use. Every project starts somewhere.
          </p>

          <div className="flex flex-col items-start gap-2 sm:gap-3 md:items-end">
            <span
              className="
                text-[8px]
                sm:text-[9px]
                uppercase
                tracking-[0.25em]
                sm:tracking-[0.35em]
                text-white/30
              "
            >
              Next stop
            </span>

            <a
              href="#contact"
              className="
                group
                flex
                items-center
                gap-3
                sm:gap-4
                text-xs
                sm:text-sm
                uppercase
                tracking-[0.2em]
                sm:tracking-[0.25em]
                text-[#fffbd4]
              "
            >
              Let's talk

              <span
                className="
                  flex
                  h-8
                  w-8
                  sm:h-10
                  sm:w-10
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-[#fffbd4]/30
                  text-base
                  sm:text-lg
                  transition-all
                  duration-500
                  group-hover:rotate-45
                  group-hover:border-[#a90e02]/50
                  group-hover:bg-[#a90e02]
                "
              >
                ↗
              </span>
            </a>
          </div>
        </div>
      </div>

      {/* =========================================
         DECORATIVE BACKGROUND
      ========================================== */}

      <div
        className="
          pointer-events-none
          absolute
          right-[-20%]
          sm:right-[-15%]
          top-[25%]
          sm:top-[30%]
          h-[60vw]
          w-[60vw]
          sm:h-[40vw]
          sm:w-[40vw]
          rounded-full
          border
          border-[#dc143c]/10
        "
        style={{ willChange: "transform, opacity" }}
      />

      <div
        className="
          pointer-events-none
          absolute
          right-[-15%]
          sm:right-[-10%]
          top-[30%]
          sm:top-[35%]
          h-[45vw]
          w-[45vw]
          sm:h-[30vw]
          sm:w-[30vw]
          rounded-full
          border
          border-white/[0.04]
        "
        style={{ willChange: "transform, opacity" }}
      />
    </section>
  );
};

export default BuildTogether;