import { motion } from "motion/react";

export function LayeredCube3D() {
  return (
    <div className="w-full max-w-3xl mx-auto relative h-[500px] sm:h-[600px] flex items-center justify-center">
      <motion.div
        className="relative w-full h-full"
        style={{ perspective: "1200px" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        {/* 3D Container */}
        <motion.div
          className="relative w-full h-full flex items-center justify-center"
          style={{ transformStyle: "preserve-3d" }}
          animate={{
            rotateY: 360,
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          {/* Layer 1 - Outer Layer (Community Network) */}
          <motion.div
            className="absolute w-64 h-64 sm:w-80 sm:h-80"
            style={{
              transformStyle: "preserve-3d",
              transform: "translateZ(80px)",
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {/* Front Face */}
            <div
              className="absolute inset-0 bg-accent/10 border-2 border-accent/40 backdrop-blur-sm"
              style={{ transform: "translateZ(80px)" }}
            >
            </div>
            {/* Back Face */}
            <div
              className="absolute inset-0 bg-accent/5 border-2 border-accent/30"
              style={{ transform: "translateZ(-80px) rotateY(180deg)" }}
            />
            {/* Right Face */}
            <div
              className="absolute inset-0 bg-accent/5 border-2 border-accent/30"
              style={{ transform: "rotateY(90deg) translateZ(80px)" }}
            />
            {/* Left Face */}
            <div
              className="absolute inset-0 bg-accent/5 border-2 border-accent/30"
              style={{ transform: "rotateY(-90deg) translateZ(80px)" }}
            />
            {/* Top Face */}
            <div
              className="absolute inset-0 bg-accent/5 border-2 border-accent/30"
              style={{ transform: "rotateX(90deg) translateZ(80px)" }}
            />
            {/* Bottom Face */}
            <div
              className="absolute inset-0 bg-accent/5 border-2 border-accent/30"
              style={{ transform: "rotateX(-90deg) translateZ(80px)" }}
            />
          </motion.div>

          {/* Layer 2 - Middle Layer (On-Chain Data) */}
          <motion.div
            className="absolute w-48 h-48 sm:w-60 sm:h-60"
            style={{
              transformStyle: "preserve-3d",
              transform: "translateZ(60px)",
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            {/* Front Face */}
            <div
              className="absolute inset-0 bg-accent/15 border-2 border-accent/50 backdrop-blur-sm"
              style={{ transform: "translateZ(60px)" }}
            >
            </div>
            {/* Back Face */}
            <div
              className="absolute inset-0 bg-accent/10 border-2 border-accent/40"
              style={{ transform: "translateZ(-60px) rotateY(180deg)" }}
            />
            {/* Right Face */}
            <div
              className="absolute inset-0 bg-accent/10 border-2 border-accent/40"
              style={{ transform: "rotateY(90deg) translateZ(60px)" }}
            />
            {/* Left Face */}
            <div
              className="absolute inset-0 bg-accent/10 border-2 border-accent/40"
              style={{ transform: "rotateY(-90deg) translateZ(60px)" }}
            />
            {/* Top Face */}
            <div
              className="absolute inset-0 bg-accent/10 border-2 border-accent/40"
              style={{ transform: "rotateX(90deg) translateZ(60px)" }}
            />
            {/* Bottom Face */}
            <div
              className="absolute inset-0 bg-accent/10 border-2 border-accent/40"
              style={{ transform: "rotateX(-90deg) translateZ(60px)" }}
            />
          </motion.div>

          {/* Layer 3 - Inner Layer (AI Processing) */}
          <motion.div
            className="absolute w-32 h-32 sm:w-40 sm:h-40"
            style={{
              transformStyle: "preserve-3d",
              transform: "translateZ(40px)",
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            {/* Front Face */}
            <div
              className="absolute inset-0 bg-accent/20 border-2 border-accent/60 backdrop-blur-sm"
              style={{ transform: "translateZ(40px)" }}
            >
            </div>
            {/* Back Face */}
            <div
              className="absolute inset-0 bg-accent/15 border-2 border-accent/50"
              style={{ transform: "translateZ(-40px) rotateY(180deg)" }}
            />
            {/* Right Face */}
            <div
              className="absolute inset-0 bg-accent/15 border-2 border-accent/50"
              style={{ transform: "rotateY(90deg) translateZ(40px)" }}
            />
            {/* Left Face */}
            <div
              className="absolute inset-0 bg-accent/15 border-2 border-accent/50"
              style={{ transform: "rotateY(-90deg) translateZ(40px)" }}
            />
            {/* Top Face */}
            <div
              className="absolute inset-0 bg-accent/15 border-2 border-accent/50"
              style={{ transform: "rotateX(90deg) translateZ(40px)" }}
            />
            {/* Bottom Face */}
            <div
              className="absolute inset-0 bg-accent/15 border-2 border-accent/50"
              style={{ transform: "rotateX(-90deg) translateZ(40px)" }}
            />
          </motion.div>

          {/* Core - Center Glowing Core (Insights) */}
          <motion.div
            className="absolute w-16 h-16 sm:w-20 sm:h-20"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ 
              scale: 1, 
              opacity: 1,
            }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            {/* Pulsing Glow */}
            <motion.div
              className="absolute inset-0 rounded-lg bg-accent/60 blur-xl"
              animate={{
                scale: [1, 1.3, 1],
                opacity: [0.6, 1, 0.6],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            {/* Solid Core */}
          </motion.div>

          {/* Connecting Data Flow Lines */}
          <motion.div
            className="absolute w-px h-32 sm:h-40 bg-linear-to-b from-transparent via-accent to-transparent"
            style={{ transform: "translateZ(120px)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.3, 0.8, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <motion.div
            className="absolute w-px h-32 sm:h-40 bg-linear-to-b from-transparent via-accent to-transparent"
            style={{ transform: "translateZ(-120px)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.3, 0.8, 0.3] }}
            transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
          />
        </motion.div>

        {/* Floating Info Labels */}
        <motion.div
          className="absolute top-[10%] left-[5%] sm:left-[10%] px-3 py-1.5 rounded-lg bg-card/50 border border-accent/30 backdrop-blur-sm"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 1.2 }}
        >
          <span className="text-xs sm:text-sm text-accent">Multi-Layer Analytics</span>
        </motion.div>

        <motion.div
          className="absolute top-[10%] right-[5%] sm:right-[10%] px-3 py-1.5 rounded-lg bg-card/50 border border-accent/30 backdrop-blur-sm"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 1.4 }}
        >
          <span className="text-xs sm:text-sm text-accent">Deep Insights</span>
        </motion.div>

        <motion.div
          className="absolute bottom-[10%] left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-lg bg-card/50 border border-accent/30 backdrop-blur-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.6 }}
        >
          <span className="text-xs sm:text-sm text-accent">Real-Time Processing</span>
        </motion.div>
      </motion.div>
    </div>
  );
}
