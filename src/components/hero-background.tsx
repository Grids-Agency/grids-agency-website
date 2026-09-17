"use client";

import Cube from "@/components/originkit/ui/cube";

const rotation = { x: 1, y: 2, z: 0.3 };
const transition = { type: "spring" as const, stiffness: 80, damping: 18, mass: 1 };

const HeroBackground = () => {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 invert dark:invert-0">
        <Cube
          color="#ffffff"
          cubeGrid={6}
          dotsPerFace={4}
          dotSize={2}
          sizePercent={104}
          rotation={rotation}
          transition={transition}
        />
      </div>
    </div>
  );
};

export default HeroBackground;
