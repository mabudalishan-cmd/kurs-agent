"use client";

import { motion } from "framer-motion";
import {
  Code2,
  Terminal,
  Braces,
  GitBranch,
  Cpu,
  Binary,
  Hash,
  Database,
} from "lucide-react";

const icons = [
  { Icon: Code2, x: "8%", y: "20%", delay: 0, duration: 8 },
  { Icon: Terminal, x: "85%", y: "15%", delay: 1, duration: 7 },
  { Icon: Braces, x: "15%", y: "70%", delay: 2, duration: 9 },
  { Icon: GitBranch, x: "78%", y: "65%", delay: 0.5, duration: 8.5 },
  { Icon: Cpu, x: "45%", y: "12%", delay: 1.5, duration: 7.5 },
  { Icon: Binary, x: "92%", y: "45%", delay: 2.5, duration: 9.5 },
  { Icon: Hash, x: "5%", y: "45%", delay: 3, duration: 8 },
  { Icon: Database, x: "50%", y: "80%", delay: 1.8, duration: 7.8 },
];

export default function FloatingIcons() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {icons.map(({ Icon, x, y, delay, duration }, i) => (
        <motion.div
          key={i}
          className="absolute text-[var(--accent)]/10"
          style={{ left: x, top: y }}
          initial={{ opacity: 0, y: 0 }}
          animate={{
            opacity: [0, 0.6, 0],
            y: [0, -30, 0],
            rotate: [0, 8, -8, 0],
          }}
          transition={{
            duration,
            delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <Icon size={32} strokeWidth={1.5} />
        </motion.div>
      ))}
    </div>
  );
}