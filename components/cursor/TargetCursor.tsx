"use client";

import { useEffect, useState } from "react";

export function TargetCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isActive, setIsActive] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Make cursor visible after mount
    setIsVisible(true);
    console.log('TargetCursor mounted');

    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });

      // Check if hovering over a targetable element
      const target = e.target as HTMLElement;
      const isTargetable = target.closest('[data-target-cursor]');

      if (isTargetable && !isActive) {
        console.log('Target cursor activated');
      }
      setIsActive(!!isTargetable);
    };

    document.addEventListener("mousemove", handleMouseMove);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
    };
  }, [isActive]);

  if (!isVisible) return null;

  return (
    <div
      className="target-cursor-container"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
    >
      {/* Outer ring */}
      <div className={`target-cursor-ring ${isActive ? 'active' : ''}`}>
        {/* Crosshair lines */}
        <div className="target-cursor-line target-cursor-line-h" />
        <div className="target-cursor-line target-cursor-line-v" />
      </div>

      {/* Center dot */}
      <div className={`target-cursor-dot ${isActive ? 'active' : ''}`} />

      {/* Corner brackets */}
      <div className={`target-cursor-brackets ${isActive ? 'active' : ''}`}>
        <div className="target-cursor-bracket tl" />
        <div className="target-cursor-bracket tr" />
        <div className="target-cursor-bracket bl" />
        <div className="target-cursor-bracket br" />
      </div>
    </div>
  );
}
