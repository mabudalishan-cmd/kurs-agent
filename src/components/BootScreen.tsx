"use client";

import { useEffect, useState } from "react";

export default function BootScreen() {
  const [done, setDone] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setDone(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (done) return null;

  return (
    <div className="boot-screen" aria-hidden="true">
      <div className="boot-left" />
      <div className="boot-right" />
      <div className="boot-content">
        <span className="boot-symbol boot-symbol-left">{"<"}</span>
        <span className="boot-text">HelloWorld</span>
        <span className="boot-symbol boot-symbol-right">{">"}</span>
      </div>
    </div>
  );
}