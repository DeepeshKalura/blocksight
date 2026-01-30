"use client"
import { motion } from "motion/react";

interface MacbookMockupProps {
  imageSrc: string;
  imageAlt: string;
}

export function MacbookMockup({ imageSrc, imageAlt }: MacbookMockupProps) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 10,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.3,
        delay: 0.5,
      }}
      className="relative z-10 w-full max-w-5xl rounded-2xl sm:rounded-3xl border border-border bg-muted p-2 sm:p-3 md:p-4 shadow-md"
    >
      <div className="w-full overflow-hidden rounded-lg sm:rounded-xl border border-border/50">
        <img
          src={imageSrc}
          alt={imageAlt}
          className="aspect-[16/9] h-auto w-full object-cover"
          height={1000}
          width={1000}
        />
      </div>
    </motion.div>
  );
}