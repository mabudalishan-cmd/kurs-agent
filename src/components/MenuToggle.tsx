"use client";

import { motion } from "framer-motion";

type MenuToggleProps = {
  isOpen: boolean;
  onClick: () => void;
};

export default function MenuToggle({ isOpen, onClick }: MenuToggleProps) {
  return (
    <button
      onClick={onClick}
      className="flex h-11 w-11 items-center justify-center rounded-lg text-[var(--foreground)] transition-colors hover:text-[var(--accent)] md:hidden"
      aria-label="Menyu"
      aria-expanded={isOpen}
    >
      <div className="relative flex h-5 w-6 flex-col items-center justify-center">
        <motion.span
          className="absolute h-0.5 w-6 rounded-full bg-current"
          animate={isOpen ? { rotate: 45, y: 0 } : { rotate: 0, y: -7 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        />
        <motion.span
          className="absolute h-0.5 w-6 rounded-full bg-current"
          animate={isOpen ? { opacity: 0 } : { opacity: 1 }}
          transition={{ duration: 0.2 }}
        />
        <motion.span
          className="absolute h-0.5 w-6 rounded-full bg-current"
          animate={isOpen ? { rotate: -45, y: 0 } : { rotate: 0, y: 7 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        />
      </div>
    </button>
  );
}