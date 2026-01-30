"use client";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import React from "react";

export const BackgroundRipple = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        "relative flex items-center justify-center h-full w-full",
        className
      )}
    >
      <div className="absolute inset-0 bg-background"></div>
      <div className="relative z-10">{children}</div>
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{
          duration: 1,
          ease: "easeInOut",
          delay: 0.5,
        }}
        className="absolute inset-0 flex items-center justify-center"
      >
        <div className="h-full w-full bg-gradient-to-r from-background via-transparent to-background"></div>
      </motion.div>
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: [1, 1.2, 1], opacity: [0, 0.5, 0] }}
        transition={{
          duration: 2,
          ease: "easeInOut",
          repeat: Infinity,
          repeatDelay: 1,
        }}
        className="absolute inset-0 flex items-center justify-center"
      >
        <div className="h-[200px] w-[200px] rounded-full border border-primary/20"></div>
      </motion.div>
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: [1, 1.5, 1], opacity: [0, 0.3, 0] }}
        transition={{
          duration: 2.5,
          ease: "easeInOut",
          repeat: Infinity,
          repeatDelay: 1.5,
        }}
        className="absolute inset-0 flex items-center justify-center"
      >
        <div className="h-[300px] w-[300px] rounded-full border border-primary/10"></div>
      </motion.div>
    </div>
  );
};
