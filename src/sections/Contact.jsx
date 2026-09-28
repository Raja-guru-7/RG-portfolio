import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const Contact = () => {
  const sectionRef = useRef(null);
  const orbRef = useRef(null);
  const ringsRef = useRef(null);
  const dotsRef = useRef([]);
  const titleRef = useRef(null);
  const cursorDotRef = useRef(null);
  const floatTweenRef = useRef(null);

  // =========================================
  // MAIL CHOOSER
  // =========================================

  const [showMailOptions, setShowMailOptions] = useState(false);

  const email = "rajaguru4481@gmail.com";

  const subject = "Project Inquiry";

  const body = `Hi Raja Guru,

I'd like to discuss a project with you.

Thanks!`;

  const encodedSubject = encodeURIComponent(subject);
  const encodedBody = encodeURIComponent(body);
  const encodedEmail = encodeURIComponent(email);

  const mailLinks = {
    gmail: `https://mail.google.com/mail/?view=cm&fs=1&to=${encodedEmail}&su=${encodedSubject}&body=${encodedBody}`,

    outlook: `https://outlook.live.com/mail/0/deeplink/compose?to=${encodedEmail}&subject=${encodedSubject}&body=${encodedBody}`,

    yahoo: `https://compose.mail.yahoo.com/?to=${encodedEmail}&subject=${encodedSubject}&body=${encodedBody}`,

    default: `mailto:${email}?subject=${encodedSubject}&body=${encodedBody}`,
  };

  const openMailChooser = (e) => {
    e.preventDefault();
    setShowMailOptions(true);
  };

  const closeMailChooser = () => {
    setShowMailOptions(false);
  };

  const openMailService = (service) => {
    const url = mailLinks[service];

    if (!url) return;

    setShowMailOptions(false);

    if (service === "default") {
      window.location.href = url;
      return;
    }

    window.open(url, "_blank", "noopener,noreferrer");
  };

  // =========================================
  // CLOSE POPUP WITH ESCAPE
  // =========================================

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        setShowMailOptions(false);
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, []);

  // =========================================
  // MAIN GSAP ANIMATIONS
  // =========================================

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(orbRef.current, {
        y: -260,
        opacity: 0,
        scale: 0.85,
      });

      gsap.set(ringsRef.current, {
        opacity: 0,
        scale: 0.8,
      });

      /* =========================================
         ORBIT ROTATION
      ========================================= */

      gsap.to(ringsRef.current, {
        rotation: 360,
        duration: 12,
        repeat: -1,
        ease: "none",
      });

      /* =========================================
         FLOATING DOTS
      ========================================= */

      dotsRef.current.forEach((dot, index) => {
        if (!dot) return;

        gsap.to(dot, {
          x: index % 2 === 0 ? 18 : -20,
          y: index % 2 === 0 ? -25 : 22,
          duration: 2 + index * 0.4,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: index * 0.2,
        });
      });

      /* =========================================
         TITLE ENTRANCE
      ========================================= */

      gsap.fromTo(
        titleRef.current,
        {
          y: 50,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
            toggleActions: "restart none none reset",
          },
        }
      );

      /* =========================================
         ORB IDLE FLOAT
      ========================================= */

      const startIdleFloat = () => {
        floatTweenRef.current?.kill();

        floatTweenRef.current = gsap.to(orbRef.current, {
          y: -14,
          duration: 2.2,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      };

      /* =========================================
         ORB DROP ANIMATION
      ========================================= */

      const dropTl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 55%",
          toggleActions: "restart none none reset",
        },

        onStart: () => {
          floatTweenRef.current?.kill();
        },

        onComplete: startIdleFloat,
      });

      dropTl
        .set(orbRef.current, {
          y: -260,
          opacity: 0,
          scale: 0.85,
        })
        .to(orbRef.current, {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.85,
          ease: "power2.in",
        })
        .to(orbRef.current, {
          y: -20,
          duration: 0.2,
          ease: "power1.out",
        })
        .to(orbRef.current, {
          y: 0,
          duration: 0.4,
          ease: "bounce.out",
        });

      /* =========================================
         CURSOR DOT
      ========================================= */

      const xTo = gsap.quickTo(cursorDotRef.current, "x", {
        duration: 0.5,
        ease: "power3",
      });

      const yTo = gsap.quickTo(cursorDotRef.current, "y", {
        duration: 0.5,
        ease: "power3",
      });

      const handleMove = (e) => {
        const rect = sectionRef.current.getBoundingClientRect();

        xTo(e.clientX - rect.left);
        yTo(e.clientY - rect.top);
      };

      sectionRef.current.addEventListener("mousemove", handleMove);

      return () => {
        sectionRef.current?.removeEventListener(
          "mousemove",
          handleMove
        );
      };
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // =========================================
  // ORB HOVER
  // =========================================

  const handleOrbEnter = () => {
    floatTweenRef.current?.pause();

    gsap.to(orbRef.current, {
      scale: 1.08,
      duration: 0.4,
      ease: "power2.out",
    });

    gsap.to(ringsRef.current, {
      opacity: 1,
      scale: 1,
      duration: 0.45,
      ease: "power2.out",
    });
  };

  const handleOrbLeave = () => {
    gsap.to(orbRef.current, {
      scale: 1,
      duration: 0.4,
      ease: "power2.out",
    });

    gsap.to(ringsRef.current, {
      opacity: 0,
      scale: 0.8,
      duration: 0.45,
      ease: "power2.out",
    });

    floatTweenRef.current?.resume();
  };

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="
        relative
        min-h-screen
        overflow-hidden
        bg-[#fffbd4]
        text-black
      "
    >
      {/* =========================================
          CURSOR DOT
      ========================================== */}

      <span
        ref={cursorDotRef}
        className="
          pointer-events-none
          absolute
          left-0
          top-0
          z-40
          h-2.5
          w-2.5
          -translate-x-1/2
          -translate-y-1/2
          rounded-full
          bg-[#a90e02]
          mix-blend-difference
        "
      />

      {/* =========================================
          BLACK TOP CURVE
      ========================================== */}

      <div
        className="
          absolute
          left-1/2
          top-0
          h-[35vh]
          w-[150%]
          -translate-x-1/2
          rounded-b-[50%]
          bg-black
          sm:h-[40vh]
          sm:w-[125%]
          md:h-[46vh]
        "
      />

      {/* =========================================
          CONTACT LABEL
      ========================================== */}

      <div
        className="
          absolute
          left-0
          right-0
          top-0
          z-30
          flex
          items-start
          justify-between
          px-4
          py-5
          sm:px-6
          sm:py-6
          md:px-10
          md:py-8
        "
      >
        <a
          href="#"
          onClick={openMailChooser}
          className="
            cursor-pointer
            text-[9px]
            uppercase
            tracking-[0.3em]
            text-white/50
            transition-colors
            duration-300
            hover:text-[#fffbd4]
            sm:text-[10px]
            md:text-xs
          "
        >
          Contact
        </a>
      </div>

      {/* =========================================
          TITLE
      ========================================== */}

      <div
        ref={titleRef}
        className="
          absolute
          left-1/2
          top-[12%]
          z-20
          w-full
          -translate-x-1/2
          px-4
          text-center
          opacity-0
          sm:top-[15%]
          sm:px-6
        "
      >
        <p
          className="
            mb-2
            text-[9px]
            uppercase
            tracking-[0.3em]
            text-white/40
            sm:mb-3
            sm:text-[10px]
            sm:tracking-[0.4em]
            md:text-xs
          "
        >
          Have a project in mind?
        </p>

        <h2
          className="
            text-3xl
            font-light
            tracking-tight
            text-[#fffbd4]
            sm:text-4xl
            md:text-5xl
            lg:text-6xl
          "
        >
          Let's build something
          <span className="text-[#a90e02]">
            {" "}
            meaningful.
          </span>
        </h2>
      </div>

      {/* =========================================
          MAIN CONTACT AREA
      ========================================== */}

      <div
        className="
          absolute
          bottom-0
          left-0
          right-0
          h-[65vh]
          md:h-[60vh]
        "
      >
        {/* =========================================
            FLOATING DOTS
        ========================================= */}

        <span
          ref={(el) => (dotsRef.current[0] = el)}
          className="
            absolute
            left-[15%]
            top-[20%]
            h-1.5
            w-1.5
            rounded-full
            bg-[#a90e02]
            sm:left-[22%]
            sm:h-2
            sm:w-2
            md:h-3
            md:w-3
          "
        />

        <span
          ref={(el) => (dotsRef.current[1] = el)}
          className="
            absolute
            right-[15%]
            top-[32%]
            h-1
            w-1
            rounded-full
            bg-black
            sm:right-[23%]
            sm:h-1.5
            sm:w-1.5
            md:h-2
            md:w-2
          "
        />

        <span
          ref={(el) => (dotsRef.current[2] = el)}
          className="
            absolute
            left-[25%]
            top-[45%]
            h-1
            w-1
            rounded-full
            bg-[#a90e02]
            sm:left-[31%]
            sm:h-1.5
            sm:w-1.5
          "
        />

        <span
          ref={(el) => (dotsRef.current[3] = el)}
          className="
            absolute
            right-[25%]
            top-[18%]
            h-1.5
            w-1.5
            rounded-full
            bg-black/60
            sm:right-[31%]
            sm:h-2
            sm:w-2
          "
        />

        {/* =========================================
            BLACK ARCH
        ========================================== */}

        <div
          className="
            absolute
            bottom-[-20%]
            left-1/2
            h-[130vw]
            w-[130vw]
            -translate-x-1/2
            rounded-full
            bg-black
            sm:bottom-[-25%]
            sm:h-[90vw]
            sm:w-[90vw]
            md:bottom-[-38%]
            md:h-[85vh]
            md:w-[85vh]
          "
        >
          {/* Inner cream circle */}

          <div
            className="
              absolute
              left-1/2
              top-[43%]
              h-[55vw]
              w-[55vw]
              -translate-x-1/2
              rounded-full
              bg-[#fffbd4]
              sm:h-[40vw]
              sm:w-[40vw]
              md:h-[38vh]
              md:w-[38vh]
            "
          />
        </div>

        {/* =========================================
            CONTACT ORB
        ========================================== */}

        <div
          ref={orbRef}
          className="
            absolute
            left-1/2
            top-[28%]
            z-20
            -translate-x-1/2
          "
        >
          {/* Orbit rings */}

          <div
            ref={ringsRef}
            className="
              pointer-events-none
              absolute
              left-1/2
              top-1/2
              h-[130px]
              w-[130px]
              -translate-x-1/2
              -translate-y-1/2
              sm:h-[150px]
              sm:w-[150px]
              md:h-[190px]
              md:w-[190px]
            "
          >
            <span
              className="
                absolute
                left-1/2
                top-1/2
                h-full
                w-[45%]
                -translate-x-1/2
                -translate-y-1/2
                rounded-full
                border
                border-black/30
              "
            />

            <span
              className="
                absolute
                left-1/2
                top-1/2
                h-[55%]
                w-full
                -translate-x-1/2
                -translate-y-1/2
                rounded-full
                border
                border-black/20
              "
            />
          </div>

          {/* =========================================
              MAIN CONTACT BUTTON
          ========================================== */}

          <a
            href="#"
            onClick={openMailChooser}
            onMouseEnter={handleOrbEnter}
            onMouseLeave={handleOrbLeave}
            className="
              group
              relative
              flex
              h-[95px]
              w-[95px]
              cursor-pointer
              items-center
              justify-center
              rounded-full
              bg-[#a90e02]
              text-center
              shadow-[0_15px_40px_rgba(0,0,0,0.18)]
              transition-colors
              duration-500
              hover:bg-black
              sm:h-[105px]
              sm:w-[105px]
              md:h-[125px]
              md:w-[125px]
            "
          >
            <span
              className="
                text-xs
                font-medium
                leading-[1.05]
                tracking-tight
                text-[#fffbd4]
                sm:text-sm
                md:text-base
              "
            >
              Let's
              <br />
              <span className="font-bold">meet</span>
              <br />
              up!
            </span>

            <span
              className="
                absolute
                right-1
                top-3
                h-1.5
                w-1.5
                rounded-full
                bg-[#fffbd4]
                sm:top-4
                sm:h-2
                sm:w-2
                md:right-2
              "
            />
          </a>
        </div>
      </div>

      {/* =========================================
          FOOTER INFO
      ========================================== */}

      <div
        className="
          absolute
          bottom-6
          left-0
          right-0
          z-30
          flex
          flex-col
          items-center
          gap-4
          px-4
          text-[9px]
          uppercase
          tracking-[0.2em]
          sm:flex-row
          sm:items-end
          sm:justify-between
          sm:px-6
          md:px-10
          md:text-[10px]
        "
      >
        {/* Left */}

        <div
          className="
            flex
            flex-col
            items-center
            gap-1
            text-center
            font-medium
            text-black/50
            sm:items-start
            sm:gap-2
            sm:text-left
          "
        >
          <span>© 2026 Raja Guru</span>
          <span>Full Stack Developer</span>
        </div>

        {/* Email */}

        <a
          href="#"
          onClick={openMailChooser}
          className="
            cursor-pointer
            text-black/50
            transition-colors
            duration-300
            hover:text-black
          "
        >
          rajaguru4481@gmail.com
        </a>

        {/* Social */}

        <div className="flex gap-4 sm:gap-5">
          <a
            href="https://github.com/Raja-guru-7"
            target="_blank"
            rel="noreferrer"
            className="
              text-black/50
              transition-colors
              duration-300
              hover:text-black
            "
          >
            GitHub
          </a>

          <a
            href="https://www.linkedin.com/in/raja-guru-207003280/"
            target="_blank"
            rel="noreferrer"
            className="
              text-black/50
              transition-colors
              duration-300
              hover:text-black
            "
          >
            LinkedIn
          </a>
        </div>
      </div>

      {/* =========================================
          MAIL CHOOSER MODAL
      ========================================== */}

      {showMailOptions && (
        <>
          {/* =========================================
              MODAL ANIMATION
          ========================================== */}

          <style>
            {`
              @keyframes mailBackdropIn {
                from {
                  opacity: 0;
                  backdrop-filter: blur(0px);
                }

                to {
                  opacity: 1;
                  backdrop-filter: blur(8px);
                }
              }

              @keyframes mailCardIn {
                from {
                  opacity: 0;
                  transform: translateY(35px) scale(0.94);
                }

                45% {
                  opacity: 1;
                  transform: translateY(-4px) scale(1.01);
                }

                70% {
                  transform: translateY(1px) scale(0.998);
                }

                to {
                  opacity: 1;
                  transform: translateY(0) scale(1);
                }
              }

              .mail-modal-backdrop {
                animation:
                  mailBackdropIn
                  0.5s
                  cubic-bezier(0.22, 1, 0.36, 1)
                  forwards;
              }

              .mail-modal-card {
                animation:
                  mailCardIn
                  0.65s
                  cubic-bezier(0.22, 1, 0.36, 1)
                  forwards;

                will-change: transform, opacity;
              }
            `}
          </style>

          {/* =========================================
              BACKDROP
          ========================================== */}

          <div
            className="
              mail-modal-backdrop
              fixed
              inset-0
              z-[99999]
              flex
              items-center
              justify-center
              bg-[#080706]/75
              px-5
              backdrop-blur-sm
            "
            onClick={closeMailChooser}
          >
            {/* =========================================
                MODAL CARD
            ========================================== */}

            <div
              className="
                mail-modal-card
                relative
                w-full
                max-w-[390px]
                rounded-3xl
                bg-[#F4F0E6]
                p-6
                shadow-2xl
                sm:p-8
              "
              onClick={(e) => e.stopPropagation()}
            >
              {/* =========================================
                  CLOSE
              ========================================== */}

              <button
                type="button"
                onClick={closeMailChooser}
                className="
                  absolute
                  right-4
                  top-4
                  flex
                  h-8
                  w-8
                  items-center
                  justify-center
                  rounded-full
                  bg-black/5
                  text-lg
                  transition-all
                  duration-300
                  hover:bg-black
                  hover:text-[#fffbd4]
                "
                aria-label="Close"
              >
                ×
              </button>

              {/* =========================================
                  HEADING
              ========================================== */}

              <div className="mb-6 pr-8">
                <p
                  className="
                    mb-2
                    text-[9px]
                    uppercase
                    tracking-[0.3em]
                    text-black/40
                  "
                >
                  Get in touch
                </p>

                <h3
                  className="
                    text-2xl
                    font-medium
                    tracking-tight
                    text-black
                    sm:text-3xl
                  "
                >
                  Choose your mail
                </h3>

                <p
                  className="
                    mt-2
                    text-xs
                    leading-relaxed
                    text-black/50
                  "
                >
                  Select the email service you want to use.
                </p>
              </div>

              {/* =========================================
                  MAIL OPTIONS
              ========================================== */}

              <div className="space-y-3">
                {/* =========================================
                    GMAIL
                ========================================= */}

                <button
                  type="button"
                  onClick={() => openMailService("gmail")}
                  className="
                    flex
                    w-full
                    items-center
                    gap-4
                    rounded-2xl
                    border
                    border-[#B8B1A3]/30
                    bg-[#F9F7F1]
                    p-4
                    text-left
                    transition-all
                    duration-300
                    hover:-translate-y-0.5
                    hover:bg-[#FFFFFF]
                    hover:shadow-lg
                  "
                >
                  <span
                    className="
                      flex
                      h-11
                      w-11
                      flex-shrink-0
                      items-center
                      justify-center
                      rounded-xl
                      bg-white
                    "
                  >
                    {/* Gmail Logo */}

                    <svg
                      viewBox="0 0 24 24"
                      className="h-7 w-7"
                      aria-hidden="true"
                    >
                      <path
                        fill="#EA4335"
                        d="M5 18.5h2.5V9.8L12 13.25l4.5-3.45v8.7H19V6.5h-2.5L12 9.95 7.5 6.5H5z"
                      />

                      <path
                        fill="#4285F4"
                        d="M5 6.5h2.5L12 9.95 16.5 6.5H19l-7 5.4z"
                      />

                      <path
                        fill="#34A853"
                        d="M5 6.5v12h2.5V9.8z"
                      />

                      <path
                        fill="#FBBC05"
                        d="M19 6.5v12h-2.5V9.8z"
                      />
                    </svg>
                  </span>

                  <span>
                    <span className="block text-sm font-semibold">
                      Gmail
                    </span>

                    <span className="block text-[10px] text-black/45">
                      Open Gmail compose
                    </span>
                  </span>

                  <span className="ml-auto text-lg text-black/30">
                    →
                  </span>
                </button>

                {/* =========================================
                    OUTLOOK
                ========================================= */}

                <button
                  type="button"
                  onClick={() => openMailService("outlook")}
                  className="
                    flex
                    w-full
                    items-center
                    gap-4
                    rounded-2xl
                    border
                    border-[#B8B1A3]/30
                    bg-[#F9F7F1]
                    p-4
                    text-left
                    transition-all
                    duration-300
                    hover:-translate-y-0.5
                    hover:bg-[#FFFFFF]
                    hover:shadow-lg
                  "
                >
                  <span
                    className="
                      flex
                      h-11
                      w-11
                      flex-shrink-0
                      items-center
                      justify-center
                      rounded-xl
                      bg-white
                    "
                  >
                    {/* Outlook Logo */}

                    <svg
                      viewBox="0 0 24 24"
                      className="h-7 w-7"
                      aria-hidden="true"
                    >
                      <path
                        fill="#0078D4"
                        d="M13.5 5.2v3.1l3.1-1.9 3.4 1.9v7.4l-3.4 1.9-3.1-1.9v3.1L20 16V8z"
                      />

                      <path
                        fill="#0364B8"
                        d="M13.5 8.3v7.2l3.1-1.8V10z"
                      />

                      <path
                        fill="#0A78D4"
                        d="M4 7.2 13.5 5v14L4 16.8z"
                      />

                      <path
                        fill="#FFFFFF"
                        d="M6.5 10.1c-.4.7-.6 1.6-.6 2.9s.2 2.2.6 2.9c.5.7 1.2 1 2.1 1s1.6-.3 2.1-1c.5-.7.7-1.6.7-2.9s-.2-2.2-.7-2.9c-.5-.7-1.2-1-2.1-1s-1.6.3-2.1 1Zm3 4.6c-.2.4-.5.6-.9.6s-.7-.2-.9-.6c-.2-.4-.3-1-.3-1.7s.1-1.3.3-1.7c.2-.4.5-.6.9-.6s.7.2.9.6c.2.4.3 1 .3 1.7s-.1 1.3-.3 1.7Z"
                      />
                    </svg>
                  </span>

                  <span>
                    <span className="block text-sm font-semibold">
                      Outlook
                    </span>

                    <span className="block text-[10px] text-black/45">
                      Open Outlook compose
                    </span>
                  </span>

                  <span className="ml-auto text-lg text-black/30">
                    →
                  </span>
                </button>

                {/* =========================================
                    YAHOO
                ========================================= */}

                <button
                  type="button"
                  onClick={() => openMailService("yahoo")}
                  className="
                    flex
                    w-full
                    items-center
                    gap-4
                    rounded-2xl
                    border
                    border-[#B8B1A3]/30
                    bg-[#F9F7F1]
                    p-4
                    text-left
                    transition-all
                    duration-300
                    hover:-translate-y-0.5
                    hover:bg-[#FFFFFF]
                    hover:shadow-lg
                  "
                >
                  <span
                    className="
                      flex
                      h-11
                      w-11
                      flex-shrink-0
                      items-center
                      justify-center
                      rounded-xl
                      bg-white
                    "
                  >
                    {/* Yahoo Logo */}

                    <svg
                      viewBox="0 0 24 24"
                      className="h-7 w-7"
                      aria-hidden="true"
                    >
                      <path
                        fill="#6001D2"
                        d="M4.2 5h3.3l4.5 6.2L16.5 5h3.3l-6.1 8.3V19h-3.4v-5.7z"
                      />

                      <circle
                        cx="18.7"
                        cy="18.1"
                        r="1.3"
                        fill="#6001D2"
                      />
                    </svg>
                  </span>

                  <span>
                    <span className="block text-sm font-semibold">
                      Yahoo Mail
                    </span>

                    <span className="block text-[10px] text-black/45">
                      Open Yahoo compose
                    </span>
                  </span>

                  <span className="ml-auto text-lg text-black/30">
                    →
                  </span>
                </button>

                {/* =========================================
                    DEFAULT MAIL
                ========================================= */}

                <button
                  type="button"
                  onClick={() => openMailService("default")}
                  className="
                    flex
                    w-full
                    items-center
                    gap-4
                    rounded-2xl
                    border
                    border-black/10
                    bg-black
                    p-4
                    text-left
                    text-[#fffbd4]
                    transition-all
                    duration-300
                    hover:-translate-y-0.5
                    hover:bg-[#8F0B05]
                    hover:shadow-lg
                  "
                >
                  <span
                    className="
                      flex
                      h-11
                      w-11
                      flex-shrink-0
                      items-center
                      justify-center
                      rounded-xl
                      bg-[#fffbd4]
                      text-lg
                      font-bold
                      text-black
                    "
                  >
                    @
                  </span>

                  <span>
                    <span className="block text-sm font-semibold">
                      Default Mail App
                    </span>

                    <span className="block text-[10px] text-white/50">
                      Use your device's mail app
                    </span>
                  </span>

                  <span className="ml-auto text-lg text-white/40">
                    →
                  </span>
                </button>
              </div>

              {/* =========================================
                  RECIPIENT
              ========================================== */}

              <div
                className="
                  mt-5
                  border-t
                  border-black/10
                  pt-4
                  text-center
                "
              >
                <span className="text-[9px] uppercase tracking-[0.2em] text-black/35">
                  Sending to
                </span>

                <p className="mt-1 text-xs font-medium text-black/60">
                  {email}
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </section>
  );
};

export default Contact;