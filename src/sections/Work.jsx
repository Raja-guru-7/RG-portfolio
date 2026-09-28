import { Icon } from "@iconify/react/dist/iconify.js";
import AnimatedHeaderSection from "../components/AnimatedHeaderSection";
import { projects } from "../constants";
import { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

const Works = ({ soundEnabled }) => {
  const overlayRefs = useRef([]);
  const previewRef = useRef(null);

  const [currentIndex, setCurrentIndex] = useState(null);

  const text = `Featured projects that have been meticulously
    crafted with passion to drive
    results and impact.`;

  const mouse = useRef({ x: 0, y: 0 });
  const moveX = useRef(null);
  const moveY = useRef(null);

  // =========================
  // HOVER SOUND
  // =========================

  const hoverSoundRef = useRef(null);

  useEffect(() => {
    const audio = new Audio("/sounds/pg.click.mp3");

    audio.preload = "auto";
    audio.volume = 0.5;
    audio.load();

    hoverSoundRef.current = audio;

    return () => {
      audio.pause();
      audio.currentTime = 0;
      hoverSoundRef.current = null;
    };
  }, []);

  // =========================
  // GSAP ANIMATIONS
  // =========================

  useGSAP(() => {
    moveX.current = gsap.quickTo(previewRef.current, "x", {
      duration: 1.5,
      ease: "power3.out",
    });

    moveY.current = gsap.quickTo(previewRef.current, "y", {
      duration: 2,
      ease: "power3.out",
    });

    gsap.from("#project", {
      y: 100,
      opacity: 0,
      delay: 0.5,
      duration: 1,
      stagger: 0.3,
      ease: "back.out",
      scrollTrigger: {
        trigger: "#project",
      },
    });
  }, []);

  // =========================
  // MOUSE ENTER
  // =========================

  const handleMouseEnter = (index) => {
    if (window.innerWidth < 768) return;

    // 🔊 MASTER SOUND CHECK
    if (soundEnabled) {
      const audio = hoverSoundRef.current;

      if (audio) {
        audio.currentTime = 0;

        audio.play().catch((error) => {
          console.log("Hover sound play failed:", error);
        });
      }
    }

    setCurrentIndex(index);

    const el = overlayRefs.current[index];

    if (!el) return;

    gsap.killTweensOf(el);

    gsap.fromTo(
      el,
      {
        clipPath:
          "polygon(0 100%, 100% 100%, 100% 100%, 0 100%)",
      },
      {
        clipPath:
          "polygon(0 0, 100% 0, 100% 100%, 0% 100%)",
        duration: 0.15,
        ease: "power2.out",
      }
    );

    gsap.to(previewRef.current, {
      opacity: 1,
      scale: 1,
      duration: 0.3,
      ease: "power2.out",
    });
  };

  // =========================
  // MOUSE LEAVE
  // =========================

  const handleMouseLeave = (index) => {
    if (window.innerWidth < 768) return;

    setCurrentIndex(null);

    const el = overlayRefs.current[index];

    if (!el) return;

    gsap.killTweensOf(el);

    gsap.to(el, {
      clipPath:
        "polygon(0 100%, 100% 100%, 100% 100%, 0 100%)",
      duration: 0.2,
      ease: "power2.in",
    });

    gsap.to(previewRef.current, {
      opacity: 0,
      scale: 0.95,
      duration: 0.3,
      ease: "power2.out",
    });
  };

  // =========================
  // MOUSE MOVE
  // =========================

  const handleMouseMove = (e) => {
    if (window.innerWidth < 768) return;

    mouse.current.x = e.clientX + 24;
    mouse.current.y = e.clientY + 24;

    if (moveX.current) {
      moveX.current(mouse.current.x);
    }

    if (moveY.current) {
      moveY.current(mouse.current.y);
    }
  };

  // =========================
  // PROJECT CLICK
  // =========================

  const handleProjectClick = (project) => {
    if (project.href) {
      window.open(
        project.href,
        "_blank",
        "noopener,noreferrer"
      );
    }
  };

  return (
    <section
      id="work"
      className="
        flex
        min-h-screen
        flex-col
        overflow-hidden
      "
    >

      {/* =========================
          HEADER
      ========================= */}

      <div
        className="
          w-full
          overflow-hidden
          max-[767px]:w-full
        "
      >
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
            subTitle={"Logic meets Aesthetics, Seamlessly"}
            title={"Works"}
            text={text}
            textColor={"text-black"}
            withScrollTrigger={true}
          />
        </div>
      </div>

      {/* =========================
          PROJECTS
      ========================= */}

      <div
        className="
          relative
          flex
          flex-col
          font-light
          max-[767px]:w-full
        "
        onMouseMove={handleMouseMove}
      >
        {projects.map((project, index) => (
          <div
            key={project.id}
            id="project"
            className="
              group
              relative
              flex
              cursor-pointer
              flex-col
              gap-1
              py-5
              md:gap-0
              max-[767px]:py-4
            "
            onMouseEnter={() =>
              handleMouseEnter(index)
            }
            onMouseLeave={() =>
              handleMouseLeave(index)
            }
            onClick={() =>
              handleProjectClick(project)
            }
          >

            {/* DESKTOP HOVER OVERLAY */}

            <div
              ref={(el) => {
                overlayRefs.current[index] = el;
              }}
              className="
                absolute
                inset-0
                -z-10
                hidden
                bg-black
                duration-200
                clip-path
                md:block
              "
            />

            {/* PROJECT TITLE */}

            <div
              className="
                flex
                items-center
                justify-between
                px-10
                text-black
                transition-all
                duration-500
                md:group-hover:px-12
                md:group-hover:text-white
                max-[767px]:gap-4
                max-[767px]:px-5
              "
            >
              <h2
                className="
                  text-[26px]
                  leading-none
                  lg:text-[32px]
                  max-[767px]:min-w-0
                  max-[767px]:text-[1.35rem]
                  max-[767px]:leading-tight
                "
              >
                {project.name}
              </h2>

              <Icon
                icon="lucide:arrow-up-right"
                className="
                  size-5
                  flex-shrink-0
                  md:size-6
                "
              />
            </div>

            {/* DIVIDER */}

            <div
              className="
                h-0.5
                w-full
                bg-black/80
                max-[767px]:h-px
              "
            />

            {/* FRAMEWORKS */}

            <div
              className="
                flex
                gap-x-5
                px-10
                text-xs
                uppercase
                leading-loose
                transition-all
                duration-500
                md:text-sm
                md:group-hover:px-12
                max-[767px]:flex-wrap
                max-[767px]:gap-x-3
                max-[767px]:gap-y-0
                max-[767px]:px-5
                max-[767px]:text-[0.6rem]
                max-[767px]:leading-relaxed
              "
            >
              {project.frameworks.map((framework) => (
                <p
                  key={framework.id}
                  className="
                    text-black
                    transition-colors
                    duration-500
                    md:group-hover:text-white
                  "
                >
                  {framework.name}
                </p>
              ))}
            </div>

            {/* MOBILE PREVIEW */}

            <div
              className="
                relative
                flex
                h-[400px]
                items-center
                justify-center
                rounded-lg
                bg-black/5
                px-10
                md:hidden
                max-[767px]:mt-3
                max-[767px]:h-[280px]
                max-[767px]:px-5
                max-[480px]:h-[240px]
              "
            >
              <img
                src={project.image}
                alt={project.name}
                className="
                  max-h-[80%]
                  max-w-[85%]
                  rounded-xl
                  object-contain
                  max-[767px]:max-h-[80%]
                  max-[767px]:max-w-[90%]
                "
              />
            </div>
          </div>
        ))}

        {/* DESKTOP FLOATING PREVIEW */}

        <div
          ref={previewRef}
          className="
            fixed
            -top-2/6
            left-0
            z-50
            hidden
            w-[960px]
            overflow-hidden
            border-8
            border-black
            pointer-events-none
            opacity-0
            md:block
          "
        >
          {currentIndex !== null && (
            <img
              src={projects[currentIndex].image}
              alt={`${projects[currentIndex].name}-preview`}
              className="
                h-full
                w-full
                object-cover
              "
            />
          )}
        </div>
      </div>
    </section>
  );
};

export default Works;