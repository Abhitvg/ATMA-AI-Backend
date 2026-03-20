import React, { useRef } from "react";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useMotionValue,
  useVelocity,
  useAnimationFrame
} from "framer-motion";
import { wrap } from "@motionone/utils";

interface ParallaxProps {
  children: React.ReactNode;
  baseVelocity: number;
}

function ParallaxText({ children, baseVelocity = 100 }: ParallaxProps) {
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 50,
    stiffness: 400
  });
  const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 5], {
    clamp: false
  });

  const x = useTransform(baseX, (v) => `${wrap(-25, 0, v)}%`);

  const directionFactor = useRef<number>(1);
  useAnimationFrame((t, delta) => {
    let moveBy = directionFactor.current * baseVelocity * (delta / 1000);

    // Add velocity from scroll
    if (velocityFactor.get() < 0) {
      directionFactor.current = -1;
    } else if (velocityFactor.get() > 0) {
      directionFactor.current = 1;
    }

    moveBy += directionFactor.current * moveBy * velocityFactor.get();

    baseX.set(baseX.get() + moveBy);
  });

  return (
    <div className="overflow-hidden m-0 whitespace-nowrap flex flex-nowrap">
      <motion.div className="flex whitespace-nowrap flex-nowrap" style={{ x }}>
        <span className="block">{children}</span>
        <span className="block">{children}</span>
        <span className="block">{children}</span>
        <span className="block">{children}</span>
      </motion.div>
    </div>
  );
}

const VelocityScroll: React.FC = () => {
  return (
    <section className="py-24 border-y border-white/10 bg-black/20 backdrop-blur-sm relative z-20 overflow-hidden">
      <ParallaxText baseVelocity={-2}>
        <span className="text-6xl md:text-8xl font-bold font-mono text-[#CCFF00] tracking-tighter opacity-80 pr-16">
          NO CLOUD • NO LATENCY • NO HALLUCINATIONS • ATMA AI • 
        </span>
      </ParallaxText>
    </section>
  );
};

export default VelocityScroll;