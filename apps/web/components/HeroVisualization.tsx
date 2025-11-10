"use client"
import { motion } from "motion/react";

export function HeroVisualization() {
  return (
    <div className="w-full max-w-5xl mx-auto relative">
      {/* 3D Laptop Mockup */}
      <div className="relative h-[400px] sm:h-[500px] md:h-[600px] flex items-center justify-center perspective-1000">
        <motion.div
          className="relative w-full max-w-4xl"
          initial={{ opacity: 0, y: 50, rotateX: 20 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
          style={{ perspective: "1000px" }}
        >
          {/* Laptop Container */}
          <div className="relative" style={{ transformStyle: "preserve-3d" }}>
            {/* Laptop Base/Keyboard */}
            <motion.div
              className="relative mx-auto"
              style={{
                width: "min(90vw, 800px)",
                height: "40px",
                background: "linear-gradient(180deg, rgba(30, 30, 30, 0.8) 0%, rgba(20, 20, 20, 0.9) 100%)",
                borderRadius: "0 0 24px 24px",
                transform: "rotateX(60deg) translateZ(-20px)",
                transformStyle: "preserve-3d",
                boxShadow: "0 20px 60px rgba(0, 0, 0, 0.5)",
              }}
            />

            {/* Laptop Screen */}
            <motion.div
              className="relative mx-auto overflow-hidden"
              style={{
                width: "min(85vw, 750px)",
                height: "min(50vh, 450px)",
                background: "linear-gradient(135deg, rgba(20, 20, 20, 0.95) 0%, rgba(30, 30, 30, 0.95) 100%)",
                borderRadius: "12px",
                border: "8px solid rgba(40, 40, 40, 0.9)",
                boxShadow: "0 0 80px rgba(255, 107, 53, 0.3), inset 0 0 60px rgba(255, 107, 53, 0.1)",
                transformStyle: "preserve-3d",
              }}
              animate={{
                boxShadow: [
                  "0 0 80px rgba(255, 107, 53, 0.3), inset 0 0 60px rgba(255, 107, 53, 0.1)",
                  "0 0 100px rgba(255, 107, 53, 0.4), inset 0 0 80px rgba(255, 107, 53, 0.15)",
                  "0 0 80px rgba(255, 107, 53, 0.3), inset 0 0 60px rgba(255, 107, 53, 0.1)",
                ],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              {/* Screen Content - Abstract Data Visualization */}
              <div className="absolute inset-0 p-8 sm:p-12">
                {/* Large Central Glow */}
                <motion.div
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 1, delay: 0.8 }}
                >
                  <div className="relative w-32 h-32 sm:w-48 sm:h-48 md:w-64 md:h-64">
                    {/* Glowing Core */}
                    <motion.div
                      className="absolute inset-0 rounded-full"
                      style={{
                        background: "radial-gradient(circle, rgba(255, 107, 53, 0.4) 0%, rgba(255, 107, 53, 0.2) 30%, transparent 70%)",
                      }}
                      animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.6, 0.8, 0.6],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    />
                    
                    {/* Inner Circle */}
                    <motion.div
                      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 sm:w-32 sm:h-32 rounded-full border-2 border-accent/50"
                      animate={{
                        rotate: 360,
                        scale: [1, 1.1, 1],
                      }}
                      transition={{
                        rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                        scale: { duration: 2, repeat: Infinity, ease: "easeInOut" },
                      }}
                    />

                    {/* Outer Circle */}
                    <motion.div
                      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 sm:w-44 sm:h-44 md:w-56 md:h-56 rounded-full border border-accent/30"
                      animate={{
                        rotate: -360,
                        scale: [1, 1.05, 1],
                      }}
                      transition={{
                        rotate: { duration: 30, repeat: Infinity, ease: "linear" },
                        scale: { duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.5 },
                      }}
                    />
                  </div>
                </motion.div>

                {/* Orbiting Data Points */}
                {[0, 1, 2, 3, 4, 5].map((index) => {
                  const angle = (index * 60) * (Math.PI / 180);
                  const radius = 80;
                  const x = Math.cos(angle) * radius;
                  const y = Math.sin(angle) * radius;

                  return (
                    <motion.div
                      key={index}
                      className="absolute left-1/2 top-1/2"
                      style={{
                        x: x,
                        y: y,
                      }}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{
                        scale: [1, 1.3, 1],
                        opacity: [0.6, 1, 0.6],
                        x: [x, x * 1.2, x],
                        y: [y, y * 1.2, y],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: index * 0.2 + 1,
                      }}
                    >
                      <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-accent shadow-lg shadow-accent/50" />
                    </motion.div>
                  );
                })}

                {/* Corner Data Clusters */}
                {[
                  { top: "10%", left: "10%", delay: 1.2 },
                  { top: "10%", right: "10%", delay: 1.4 },
                  { bottom: "10%", left: "10%", delay: 1.6 },
                  { bottom: "10%", right: "10%", delay: 1.8 },
                ].map((pos, index) => (
                  <motion.div
                    key={index}
                    className="absolute"
                    style={{ ...pos }}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5, delay: pos.delay }}
                  >
                    <motion.div
                      className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg border border-accent/40 backdrop-blur-sm"
                      style={{
                        background: "radial-gradient(circle, rgba(255, 107, 53, 0.2) 0%, transparent 70%)",
                      }}
                      animate={{
                        borderColor: ["rgba(255, 107, 53, 0.4)", "rgba(255, 107, 53, 0.6)", "rgba(255, 107, 53, 0.4)"],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: index * 0.3,
                      }}
                    />
                  </motion.div>
                ))}

                {/* Floating Particles */}
                {Array.from({ length: 20 }).map((_, index) => (
                  <motion.div
                    key={index}
                    className="absolute w-1 h-1 rounded-full bg-accent/60"
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                    }}
                    animate={{
                      y: [0, -20, 0],
                      opacity: [0, 1, 0],
                    }}
                    transition={{
                      duration: 3 + Math.random() * 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: Math.random() * 2,
                    }}
                  />
                ))}
              </div>

              {/* Screen Reflection Effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent pointer-events-none" />
            </motion.div>
          </div>

          {/* Floating Elements Around Laptop */}
          <motion.div
            className="absolute -top-8 -right-8 sm:-right-12 w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-accent/20 backdrop-blur-sm border border-accent/30 flex items-center justify-center z-20"
            animate={{
              y: [0, -15, 0],
              rotate: [0, 10, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <span className="text-xl sm:text-2xl">🎯</span>
          </motion.div>

          <motion.div
            className="absolute -top-8 -left-8 sm:-left-12 w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-accent/20 backdrop-blur-sm border border-accent/30 flex items-center justify-center z-20"
            animate={{
              y: [0, -12, 0],
              rotate: [0, -10, 0],
            }}
            transition={{
              duration: 3.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5,
            }}
          >
            <span className="text-xl sm:text-2xl">📊</span>
          </motion.div>

          <motion.div
            className="absolute -bottom-8 left-1/4 w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-accent/20 backdrop-blur-sm border border-accent/30 flex items-center justify-center z-20"
            animate={{
              y: [0, 15, 0],
              rotate: [0, 10, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1,
            }}
          >
            <span className="text-xl sm:text-2xl">🤖</span>
          </motion.div>

          <motion.div
            className="absolute -bottom-8 right-1/4 w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-accent/20 backdrop-blur-sm border border-accent/30 flex items-center justify-center z-20"
            animate={{
              y: [0, 18, 0],
              rotate: [0, -10, 0],
            }}
            transition={{
              duration: 3.8,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1.5,
            }}
          >
            <span className="text-xl sm:text-2xl">⚡</span>
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom Gradient Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent pointer-events-none" />
    </div>
  );
}
