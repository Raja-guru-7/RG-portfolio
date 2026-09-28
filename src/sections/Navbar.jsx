import React, { useEffect, useRef, useState } from "react";
import { socials } from "../constants";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Link } from "react-scroll";

const Navbar = ({ soundEnabled, setSoundEnabled }) => {
  const navRef = useRef(null);
  const linksRef = useRef([]);
  const contactRef = useRef(null);
  const topLineRef = useRef(null);
  const bottomLineRef = useRef(null);
  const tl = useRef(null);
  const iconTl = useRef(null);

  // =========================================
  // MENU AUDIO
  // =========================================
  const menuAudioRef = useRef(null);

  const [isOpen, setIsOpen] = useState(false);
  const [showBurger, setShowBurger] = useState(true);

  // =========================================
  // PRELOAD MENU AUDIO
  // =========================================

  useEffect(() => {
    const audio = new Audio("/sounds/burger.mp3");

    audio.preload = "auto";
    audio.volume = 0.5;
    audio.load();

    menuAudioRef.current = audio;

    return () => {
      audio.pause();
      audio.currentTime = 0;
      menuAudioRef.current = null;
    };
  }, []);

  useGSAP(() => {
    gsap.set(navRef.current, { xPercent: 100 });

    gsap.set([linksRef.current, contactRef.current], {
      autoAlpha: 0,
      x: -20,
    });

    tl.current = gsap
      .timeline({ paused: true })
      .to(navRef.current, {
        xPercent: 0,
        duration: 1,
        ease: "power3.out",
      })
      .to(
        linksRef.current,
        {
          autoAlpha: 1,
          x: 0,
          stagger: 0.1,
          duration: 0.5,
          ease: "power2.out",
        },
        "<"
      )
      .to(
        contactRef.current,
        {
          autoAlpha: 1,
          x: 0,
          duration: 0.5,
          ease: "power2.out",
        },
        "<+0.2"
      );

    iconTl.current = gsap
      .timeline({ paused: true })
      .to(topLineRef.current, {
        rotate: 45,
        y: 3.3,
        duration: 0.3,
        ease: "power2.inOut",
      })
      .to(
        bottomLineRef.current,
        {
          rotate: -45,
          y: -3.3,
          duration: 0.3,
          ease: "power2.inOut",
        },
        "<"
      );
  }, []);

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      setShowBurger(
        currentScrollY <= lastScrollY || currentScrollY < 10
      );

      lastScrollY = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, {
      passive: true,
    });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => {
    // =========================================
    // MENU SOUND
    // =========================================

    if (soundEnabled && menuAudioRef.current) {
      const menuAudio = menuAudioRef.current;

      menuAudio.currentTime = 0;

      menuAudio.play().catch((err) => {
        console.log("Menu audio blocked:", err);
      });
    }

    if (isOpen) {
      tl.current.reverse();
      iconTl.current.reverse();
    } else {
      tl.current.play();
      iconTl.current.play();
    }

    setIsOpen(!isOpen);
  };

  const toggleSound = () => {
    setSoundEnabled((prev) => !prev);
  };

  return (
    <>
      {/* =========================================
          ANIMATION STYLES
      ========================================= */}

      <style>
        {`
          @keyframes wave-bounce {
            0%, 100% {
              transform: scaleY(0.3);
              opacity: 0.5;
            }

            50% {
              transform: scaleY(1);
              opacity: 1;
            }
          }

          .animate-wave-1 {
            animation: wave-bounce 0.8s ease-in-out infinite;
          }

          .animate-wave-2 {
            animation: wave-bounce 0.8s ease-in-out infinite 0.2s;
          }

          .animate-wave-3 {
            animation: wave-bounce 0.8s ease-in-out infinite 0.4s;
          }

          .animate-wave-4 {
            animation: wave-bounce 0.8s ease-in-out infinite 0.1s;
          }

          .animate-wave-5 {
            animation: wave-bounce 0.8s ease-in-out infinite 0.3s;
          }

          .no-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }

          .no-scrollbar::-webkit-scrollbar {
            display: none;
          }
        `}
      </style>

      {/* =========================================
          BACKDROP
      ========================================= */}

      <div
        className={`
          fixed inset-0 z-40
          transition-all duration-700 ease-out
          ${
            isOpen
              ? "opacity-100 backdrop-blur-[3px]"
              : "pointer-events-none opacity-0 backdrop-blur-0"
          }
        `}
        onClick={isOpen ? toggleMenu : undefined}
      />

      {/* =========================================
          MENU
      ========================================= */}

      <nav
        ref={navRef}
        className="
          fixed
          z-50
          flex
          flex-col
          justify-between
          w-full
          h-[100dvh]
          px-6
          uppercase
          bg-black
          text-white/80
          pt-24
          pb-8
          overflow-y-auto
          no-scrollbar
          gap-y-8

          sm:px-8

          md:w-1/2
          md:h-full
          md:left-1/2
          md:px-10
          md:pt-20
          md:pb-10
          md:gap-y-10
        "
      >
        {/* =========================================
            MENU LINKS
        ========================================= */}

        <div
          className="
            flex
            flex-col
            text-[3.2rem]
            leading-[0.95]
            gap-y-2

            sm:text-[4rem]

            md:text-6xl
            lg:text-8xl
          "
        >
          {["home", "services", "about", "work", "contact"].map(
            (section, index) => (
              <div
                key={index}
                ref={(el) => (linksRef.current[index] = el)}
              >
                <Link
                  className="
                    transition-all
                    duration-300
                    cursor-pointer
                    hover:text-white
                  "
                  to={section}
                  smooth
                  offset={0}
                  duration={2000}
                >
                  {section}
                </Link>
              </div>
            )
          )}
        </div>

        {/* =========================================
            CONTACT + SOUND
        ========================================= */}

        <div
          ref={contactRef}
          className="
            flex
            flex-col
            gap-6
          "
        >
          {/* =========================================
              EMAIL + SOCIAL
          ========================================= */}

          <div
            className="
              flex
              flex-col
              flex-wrap
              justify-between
              gap-6

              md:flex-row
              md:items-end
              md:gap-8
            "
          >
            {/* EMAIL */}

            <div className="font-light min-w-0">
              <p className="tracking-wider text-white/50">
                E-mail
              </p>

              <p
                className="
                  text-sm
                  tracking-widest
                  lowercase
                  break-all
                  text-pretty

                  sm:text-base

                  md:text-l
                  md:break-normal
                "
              >
                rajaguru4481@gmail.com
              </p>
            </div>

            {/* SOCIAL MEDIA */}

            <div className="font-light">
              <p className="tracking-wider text-white/50">
                Social Media
              </p>

              <div
                className="
                  flex
                  flex-wrap
                  gap-x-2
                  gap-y-1

                  md:flex-row
                "
              >
                {socials.map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noreferrer"
                    className="
                      text-xs
                      leading-loose
                      tracking-widest
                      uppercase
                      hover:text-white
                      transition-colors
                      duration-300

                      sm:text-sm
                    "
                  >
                    {"{ "}
                    {social.name}
                    {" }"}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* =========================================
              SOUND TOGGLE
          ========================================= */}

          <button
            type="button"
            onClick={toggleSound}
            className="
              group
              flex
              items-center
              justify-start
              gap-3
              w-full
              cursor-pointer
              select-none
              rounded-lg
              border-t
              border-white/10
              pt-4
              pb-1
              transition-all
              duration-300

              md:gap-4
              md:pt-5
            "
          >
            {/* LABEL */}

            <span
              className="
                text-[10px]
                font-medium
                tracking-[0.2em]
                text-white/50
                group-hover:text-white/70
                transition-colors
              "
            >
              SOUND
            </span>

            <div className="flex items-center gap-3">
              {/* =====================================
                  3D SOUND ICON
              ===================================== */}

              <div
                className={`
                  relative
                  flex
                  h-7
                  w-7
                  items-center
                  justify-center
                  rounded-full
                  transition-all
                  duration-500
                  ease-out
                  border

                  md:h-8
                  md:w-8

                  ${
                    soundEnabled
                      ? "border-[#a90e02]/40 bg-gradient-to-br from-[#a90e02]/10 to-transparent"
                      : "border-white/10 bg-white/[0.02]"
                  }
                `}
                style={{
                  boxShadow: soundEnabled
                    ? "0 4px 12px rgba(169, 14, 2, 0.2), inset 0 1px 1px rgba(255, 255, 255, 0.1)"
                    : "0 2px 8px rgba(0, 0, 0, 0.3), inset 0 1px 1px rgba(255, 255, 255, 0.05)",
                }}
              >
                {/* WAVY BARS */}

                <div className="relative flex h-3 items-end gap-[2px]">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <span
                      key={i}
                      className={`
                        w-[2px]
                        rounded-full
                        transition-all
                        duration-500

                        ${
                          soundEnabled
                            ? `bg-[#a90e02] animate-wave-${i}`
                            : "bg-white/30 h-1"
                        }
                      `}
                      style={{
                        boxShadow: soundEnabled
                          ? "0 0 6px rgba(169,14,2,0.8)"
                          : "none",
                      }}
                    />
                  ))}
                </div>

                {/* OFF SLASH */}

                <div
                  className={`
                    absolute
                    inset-0
                    m-auto
                    h-[1.5px]
                    w-5
                    rounded-full
                    bg-white/70
                    transition-all
                    duration-500
                    ease-[cubic-bezier(.22,1,.36,1)]

                    ${
                      soundEnabled
                        ? "scale-x-0 opacity-0 -rotate-45"
                        : "scale-x-100 opacity-100 -rotate-45"
                    }
                  `}
                  style={{
                    boxShadow: "0 0 4px rgba(0,0,0,0.8)",
                  }}
                />
              </div>

              {/* ON / OFF */}

              <span
                className={`
                  text-[9px]
                  font-bold
                  tracking-[0.2em]
                  transition-colors
                  duration-300
                  w-6
                  text-left

                  ${
                    soundEnabled
                      ? "text-[#a90e02]"
                      : "text-white/30"
                  }
                `}
                style={{
                  textShadow: soundEnabled
                    ? "0 0 8px rgba(169,14,2,0.5)"
                    : "none",
                }}
              >
                {soundEnabled ? "ON" : "OFF"}
              </span>
            </div>
          </button>
        </div>
      </nav>

      {/* =========================================
          BURGER / CLOSE BUTTON
      ========================================= */}

      <div
        className="
          fixed
          z-50
          flex
          flex-col
          items-center
          justify-center
          gap-1
          transition-all
          duration-300
          bg-black
          rounded-full
          cursor-pointer

          w-12
          h-12
          top-3
          right-4

          sm:w-14
          sm:h-14
          sm:top-4
          sm:right-6

          md:w-20
          md:h-20
          md:top-4
          md:right-10
        "
        onClick={toggleMenu}
        style={
          showBurger
            ? { clipPath: "circle(50% at 50% 50%)" }
            : { clipPath: "circle(0% at 50% 50%)" }
        }
      >
        <span
          ref={topLineRef}
          className="
            block
            w-6
            h-0.5
            bg-white
            rounded-full
            origin-center

            md:w-8
          "
        />

        <span
          ref={bottomLineRef}
          className="
            block
            w-6
            h-0.5
            bg-white
            rounded-full
            origin-center

            md:w-8
          "
        />
      </div>
    </>
  );
};

export default Navbar;