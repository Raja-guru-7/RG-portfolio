import { Canvas } from "@react-three/fiber";
import { Environment, Float, OrbitControls } from "@react-three/drei";
import { useMediaQuery } from "react-responsive";
import { useEffect, useRef, useState, Suspense } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

import AnimatedHeaderSection from "../components/AnimatedHeaderSection";
import { BloodRose } from "../components/BloodRose";

gsap.registerPlugin(ScrollTrigger);

const ModelLoadedReporter = ({ onLoaded }) => {
  useEffect(() => {
    onLoaded();
  }, [onLoaded]);

  return null;
};

const EntranceAnimation = ({ children }) => {
  const groupRef = useRef();

  useEffect(() => {
    if (groupRef.current) {
      gsap.to(groupRef.current.position, {
        y: 0,
        duration: 2.5,
        ease: "power3.out",
        delay: 0.5,
      });
    }
  }, []);

  return (
    <group ref={groupRef} position={[0, 10, 0]}>
      {children}
    </group>
  );
};

const Hero = () => {
  const isMobile = useMediaQuery({ maxWidth: 853 });

  const containerRef = useRef(null);
  const bgRef = useRef(null);
  const textRef = useRef(null);
  const swordWrapperRef = useRef(null);

  const [isReady, setIsReady] = useState(false);

  const text = `I help growing brands and startups gain an
unfair advantage through premium
results driven websites.`;

  useGSAP(
    () => {
      if (!isReady) return;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: true,
          invalidateOnRefresh: true,
        },
      });

      /* =========================================
         BACKGROUND + TEXT
      ========================================= */

      tl.to(
        bgRef.current,
        {
          backgroundColor: "#000000",
          duration: 1,
          ease: "none",
        },
        0
      ).to(
        textRef.current,
        {
          opacity: 0,
          duration: 1,
          ease: "none",
        },
        0
      );

      /* =========================================
         SWORD SCROLL ANIMATION
      ========================================= */

      if (swordWrapperRef.current) {
        tl.to(
          swordWrapperRef.current.rotation,
          {
            x: -0.09,
            y: -0.89,
            z: -1.49,
            duration: 1,
            ease: "power2.inOut",
          },
          1
        );

        tl.to(
          swordWrapperRef.current.scale,
          {
            x: 0.53,
            y: 0.53,
            z: 0.53,
            duration: 1,
            ease: "power2.inOut",
          },
          1
        );
      }

      tl.to({}, { duration: 1.5 });

      const refreshId = requestAnimationFrame(() => {
        ScrollTrigger.refresh();
      });

      return () => cancelAnimationFrame(refreshId);
    },
    {
      dependencies: [isReady],
      scope: containerRef,
    }
  );

  return (
    <section
      id="home"
      ref={containerRef}
      className="
        relative
        z-0
        w-full
        h-[300vh]
      "
    >
      {/* =========================================
          STICKY HERO
      ========================================= */}

      <div
        data-cursor
        className="
          sticky
          top-0
          flex
          w-full
          h-screen
          min-h-[100svh]
          flex-col
          justify-end
          overflow-hidden
        "
      >
        {/* =========================================
            BACKGROUND
        ========================================= */}

        <div
          ref={bgRef}
          className="absolute inset-0 -z-50"
          style={{
            backgroundColor: "#fffbd4",
          }}
        />

        {/* =========================================
            HERO TEXT

            Desktop untouched.
            Mobile spacing only.
        ========================================= */}

        <div
          ref={textRef}
          className="
            relative
            z-10
            pointer-events-none
            w-full

            max-[853px]:pb-2
          "
        >
          <div className="max-[853px]:scale-[0.82] max-[853px]:origin-bottom">
            <AnimatedHeaderSection
              title={"RAJA GURU ~ "}
              text={text}
              textColor={"text-black"}
              titleEffect={true}
            />
          </div>
        </div>

        {/* =========================================
            3D CANVAS
        ========================================= */}

        <figure
          className="
            absolute
            inset-0
            -z-40
            pointer-events-none
          "
          style={{
            width: "100vw",
            height: "100vh",
          }}
        >
          <Canvas
            shadows
            dpr={isMobile ? [1, 1.5] : [1, 2]}
            camera={{
              position: [0, 0, -10],
              fov: isMobile ? 20 : 17.5,
              near: 1,
              far: 20,
            }}
            eventSource={document.getElementById("root")}
            eventPrefix="client"
          >
            <OrbitControls
              makeDefault
              enableZoom={false}
              enablePan={false}
            />

            <Suspense fallback={null}>
              {/* =====================================
                  LIGHTING
              ===================================== */}

              <ambientLight intensity={1.2} />

              <directionalLight
                position={[10, 10, 10]}
                intensity={1.5}
                castShadow
              />

              <directionalLight
                position={[-10, -10, -10]}
                intensity={1}
              />

              <directionalLight
                position={[0, 0, 10]}
                intensity={1.5}
              />

              {/* =====================================
                  SWORD
              ===================================== */}

              <EntranceAnimation>
                <Float
                  speed={2.5}
                  rotationIntensity={0.3}
                  floatIntensity={1.5}
                >
                  <group
                    ref={swordWrapperRef}
                    rotation={[0.9, -0.3, -Math.PI / 11.5]}
                    scale={1}
                  >
                    <BloodRose
                      scale={isMobile ? 1.55 : 1.2}
                      rotation={[0, 0, 0]}
                    />
                  </group>
                </Float>
              </EntranceAnimation>

              <Environment preset="city" />

              <ModelLoadedReporter
                onLoaded={() => setIsReady(true)}
              />
            </Suspense>
          </Canvas>
        </figure>
      </div>
    </section>
  );
};

export default Hero;