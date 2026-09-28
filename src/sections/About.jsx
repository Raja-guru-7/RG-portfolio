import { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import AnimatedHeaderSection from "../components/AnimatedHeaderSection";

const Floating3DCard = ({ children }) => {
  const cardRef = useRef(null);
  const requestRef = useRef(null);

  const handleMouseMove = (e) => {
    const el = cardRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (requestRef.current) {
      cancelAnimationFrame(requestRef.current);
    }

    requestRef.current = requestAnimationFrame(() => {
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -15;
      const rotateY = ((x - centerX) / centerX) * 15;

      el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    });
  };

  const handleMouseLeave = () => {
    const el = cardRef.current;
    if (!el) return;

    if (requestRef.current) {
      cancelAnimationFrame(requestRef.current);
    }

    el.style.transform =
      `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
  };

  return (
    <div className="floating-animation w-full h-full">
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="w-full h-full transition-transform duration-200 ease-out will-change-transform"
        style={{ transformStyle: "preserve-3d" }}
      >
        {children}
      </div>
    </div>
  );
};

const funnyPhrases = [
  "Ouch! 💥",
  "Bonk! 🔨",
  "Hey! 😠",
  "That tickles! 🤣",
  "Stop it! 🛑",
  "Boop! 👆",
  "Bug added! 🐛",
  "Level up! 🍄",
  "Coffee needed! ☕",
];

const techSkills = [
  {
    name: "React",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg",
  },
  {
    name: "Java",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/java/java-original.svg",
  },
  {
    name: "JavaScript",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg",
  },
  {
    name: "Node.js",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nodejs/nodejs-original.svg",
  },
  {
    name: "Express",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/express/express-original.svg",
  },
  {
    name: "MongoDB",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mongodb/mongodb-original.svg",
  },
  {
    name: "MySQL",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mysql/mysql-original.svg",
  },
  {
    name: "Three.js",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/threejs/threejs-original.svg",
  },
  {
    name: "GSAP",
    icon: "https://cdn.worldvectorlogo.com/logos/gsap-greensock.svg",
  },
  {
    name: "Tailwind CSS",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg",
  },
];

const About = ({ soundEnabled }) => {
  const text = `I am a Full Stack Developer focused on building modern, scalable, and immersive digital experiences that combine clean engineering with thoughtful design.`;

  // Game state
  const [pops, setPops] = useState([]);
  const imageWrapperRef = useRef(null);

  // =========================================
  // PRELOADED AUDIO
  // =========================================

  const hoverAudioRef = useRef(null);
  const clickAudioRef = useRef(null);

  useEffect(() => {
    const hoverAudio = new Audio(
      "/sounds/image-hover-sound.wav"
    );

    hoverAudio.preload = "auto";
    hoverAudio.volume = 0.5;
    hoverAudio.load();

    const clickAudio = new Audio(
      "/sounds/image-click-sound.mp3"
    );

    clickAudio.preload = "auto";
    clickAudio.volume = 0.5;
    clickAudio.load();

    hoverAudioRef.current = hoverAudio;
    clickAudioRef.current = clickAudio;

    return () => {
      hoverAudio.pause();
      hoverAudio.currentTime = 0;

      clickAudio.pause();
      clickAudio.currentTime = 0;

      hoverAudioRef.current = null;
      clickAudioRef.current = null;
    };
  }, []);

  // =========================================
  // HOVER SOUND
  // =========================================

  const playHoverSound = () => {
    // Master sound check
    if (!soundEnabled) return;

    const audio = hoverAudioRef.current;

    if (!audio) return;

    audio.currentTime = 0;

    audio
      .play()
      .catch((err) =>
        console.log("Hover audio blocked", err)
      );
  };

  // =========================================
  // CLICK HANDLER
  // =========================================

  const handleImageClick = (e) => {
    // Master sound check
    if (soundEnabled) {
      const clickAudio = clickAudioRef.current;

      if (clickAudio) {
        clickAudio.currentTime = 0;

        clickAudio
          .play()
          .catch((err) =>
            console.log("Click audio blocked", err)
          );
      }
    }

    // GSAP Jelly/Bounce
    if (imageWrapperRef.current) {
      gsap.fromTo(
        imageWrapperRef.current,
        {
          scale: 0.9,
          rotateZ: (Math.random() - 0.5) * 10,
        },
        {
          scale: 1,
          rotateZ: 0,
          duration: 0.6,
          ease: "elastic.out(1, 0.3)",
        }
      );
    }

    // Floating text
    const rect =
      e.currentTarget.getBoundingClientRect();

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const randomText =
      funnyPhrases[
        Math.floor(
          Math.random() * funnyPhrases.length
        )
      ];

    const id = Date.now() + Math.random();

    setPops((prev) => [
      ...prev,
      {
        id,
        x,
        y,
        text: randomText,
      },
    ]);

    setTimeout(() => {
      setPops((prev) =>
        prev.filter((p) => p.id !== id)
      );
    }, 1000);
  };

  return (
    <section
      id="about"
      className="
        relative
        min-h-screen
        rounded-t-[2.5rem]
        bg-[#fffbd4]
        text-black
        px-4
        py-16
        sm:px-6
        md:px-10
        md:py-24
        lg:py-32
      "
    >
      <div
        className="
          mx-auto
          grid
          max-w-7xl
          grid-cols-1
          items-start
          gap-10
          md:gap-12
          lg:grid-cols-[0.9fr_1.1fr]
          lg:gap-16
        "
      >

        {/* LEFT SIDE */}

        <div className="
          relative
          h-[45vh]
          min-h-[320px]
          w-full
          sm:h-[50vh]
          lg:sticky
          lg:top-32
          lg:h-[75vh]
        ">
          <Floating3DCard>
            <div
              className="
                relative
                h-full
                w-full
                overflow-hidden
                rounded-[2rem]
                shadow-2xl
                cursor-pointer
              "
              onClick={handleImageClick}
              onMouseEnter={playHoverSound}
            >
              <div
                ref={imageWrapperRef}
                className="h-full w-full"
              >
                <img
                  src="/images/crimson1.png"
                  alt="Raja Guru"
                  className="
                    about-hero-img
                    h-full
                    w-full
                    scale-[1.2]
                    object-cover
                    opacity-0
                  "
                />
              </div>

              {/* POPUPS */}

              {pops.map((pop) => (
                <span
                  key={pop.id}
                  className="
                    funny-pop
                    absolute
                    pointer-events-none
                    text-lg
                    sm:text-xl
                    md:text-2xl
                    font-bold
                    text-white
                    whitespace-nowrap
                    z-50
                    drop-shadow-lg
                  "
                  style={{
                    left: pop.x,
                    top: pop.y,
                    transform:
                      "translate(-50%, -50%)",
                    textShadow:
                      "2px 2px 4px rgba(0,0,0,0.5)",
                  }}
                >
                  {pop.text}
                </span>
              ))}
            </div>
          </Floating3DCard>
        </div>

        {/* RIGHT SIDE */}

        <div className="
          flex
          flex-col
          space-y-6
          md:space-y-8
          pt-2
          lg:pt-0
        ">

          {/* HEADER */}

          <div className="
            about-text-reveal
            about-heading
            opacity-0
            force-normal-case
          ">
            <style>{`
              .force-normal-case * {
                text-transform: none !important;
              }
            `}</style>

            <AnimatedHeaderSection
              subTitle="A little about me"
              title="ABOUT"
              text={text}
              textColor="text-black"
              withScrollTrigger={false}
            />
          </div>

          {/* SKILLS */}

          <div className="
            about-text-reveal
            border-t
            border-black/20
            pt-5
            md:pt-6
            opacity-0
          ">
            <p className="
              mb-4
              md:mb-6
              text-[10px]
              md:text-xs
              tracking-widest
              text-black/50
            ">
              Currently working with
            </p>

            <div className="
              flex
              flex-wrap
              gap-2
              md:gap-3
              mt-2
            ">
              {techSkills.map((skill, index) => (
                <div
                  key={index}
                  className="
                    group
                    flex
                    items-center
                    gap-1.5
                    md:gap-2
                    px-2.5
                    py-1.5
                    md:px-3
                    bg-black/5
                    border
                    border-black/10
                    rounded-full
                    hover:-translate-y-1
                    hover:bg-[#a90e02]
                    hover:border-[#a90e02]
                    hover:shadow-[0_6px_20px_rgba(169,14,2,0.35)]
                    transition-all
                    duration-300
                    cursor-default
                  "
                >
                  <span className="
                    flex
                    items-center
                    justify-center
                    w-4
                    h-4
                    md:w-5
                    md:h-5
                    rounded-full
                    bg-transparent
                    p-0.5
                    transition-colors
                    duration-300
                  ">
                    <img
                      src={skill.icon}
                      alt={skill.name}
                      className="
                        w-3
                        h-3
                        md:w-4
                        md:h-4
                        object-contain
                        opacity-90
                        grayscale-[20%]
                        transition-all
                        duration-300
                        group-hover:grayscale-0
                        group-hover:scale-110
                      "
                    />
                  </span>

                  <span className="
                    text-[10px]
                    md:text-xs
                    font-semibold
                    tracking-wider
                    text-black/70
                    transition-colors
                    duration-300
                    group-hover:text-white
                  ">
                    {skill.name}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* BOTTOM LINE */}

          <div className="
            about-text-reveal
            hidden
            md:block
            mt-8
            md:mt-12
            border-t
            border-black/20
            pt-5
            md:pt-6
            opacity-0
          ">
            <div className="
              flex
              flex-col
              md:flex-row
              justify-between
              gap-3
              text-xs
              md:text-sm
              tracking-wide
              text-black/50
              font-medium
              text-center
              md:text-left
            ">
              <span>Raja Guru</span>
              <span>Full Stack Developer</span>
              <span>2026</span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default About;