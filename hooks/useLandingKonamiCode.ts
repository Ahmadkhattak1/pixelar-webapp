"use client";

import { useEffect, useState, useCallback } from "react";

const KONAMI_CODE = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "KeyB",
  "KeyA",
];

export function useLandingKonamiCode() {
  const [input, setInput] = useState<string[]>([]);
  const [activated, setActivated] = useState(false);

  const showEasterEgg = useCallback(() => {
    if (activated) return;
    setActivated(true);

    // Create overlay
    const overlay = document.createElement("div");
    overlay.style.cssText = `
      position: fixed;
      inset: 0;
      background: #0a0a1a;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      animation: fadeIn 0.3s ease-out;
    `;

    // Add flash effect
    overlay.innerHTML = `
      <style>
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        @keyframes confetti {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }
        .pixel-confetti {
          position: absolute;
          width: 8px;
          height: 8px;
          animation: confetti 3s ease-out forwards;
        }
        .achievement-box {
          background: #1a1a2e;
          border: 4px solid #FFD700;
          padding: 40px 60px;
          text-align: center;
          animation: shake 0.5s ease-out;
          position: relative;
        }
        .achievement-box::before,
        .achievement-box::after {
          content: '';
          position: absolute;
          width: 12px;
          height: 12px;
          background: #FFD700;
        }
        .achievement-box::before {
          top: -6px;
          left: -6px;
        }
        .achievement-box::after {
          bottom: -6px;
          right: -6px;
        }
        .glow-text {
          text-shadow: 0 0 10px #FFD700, 0 0 20px #FFD700, 0 0 30px #FFD700;
        }
      </style>
      <div class="achievement-box">
        <div style="font-family: 'Press Start 2P', monospace; font-size: 12px; color: #FFD700; margin-bottom: 20px;" class="glow-text">
          ★ CHEAT ACTIVATED ★
        </div>
        <div style="font-family: 'Inter', sans-serif; font-size: 24px; color: white; margin-bottom: 16px;">
          You found the secret!
        </div>
        <div style="font-family: 'Press Start 2P', monospace; font-size: 10px; color: #00FF88;">
          +10 FREE CREDITS
        </div>
        <div style="font-family: 'Inter', sans-serif; font-size: 14px; color: #a0a0c0; margin-top: 24px;">
          (Just kidding... but nice job finding this!)
        </div>
      </div>
    `;

    // Add confetti
    const colors = ["#9945FF", "#00FF88", "#FFD700", "#FF6B9D", "#00FFFF"];
    for (let i = 0; i < 50; i++) {
      const confetti = document.createElement("div");
      confetti.className = "pixel-confetti";
      confetti.style.left = `${Math.random() * 100}%`;
      confetti.style.top = "-20px";
      confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      confetti.style.animationDelay = `${Math.random() * 0.5}s`;
      overlay.appendChild(confetti);
    }

    document.body.appendChild(overlay);

    // Play a "success" sound if Web Audio is available
    try {
      const audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime); // C5
      oscillator.frequency.setValueAtTime(659.25, audioContext.currentTime + 0.1); // E5
      oscillator.frequency.setValueAtTime(783.99, audioContext.currentTime + 0.2); // G5
      oscillator.frequency.setValueAtTime(1046.50, audioContext.currentTime + 0.3); // C6

      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);
    } catch {
      // Audio not available, that's fine
    }

    // Remove after 4 seconds
    setTimeout(() => {
      overlay.style.animation = "fadeIn 0.3s ease-out reverse";
      setTimeout(() => {
        document.body.removeChild(overlay);
        setActivated(false);
        setInput([]);
      }, 300);
    }, 4000);
  }, [activated]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const newInput = [...input, e.code];

      // Keep only the last N keys (where N is the length of the Konami code)
      if (newInput.length > KONAMI_CODE.length) {
        newInput.shift();
      }

      setInput(newInput);

      // Check if the code matches
      if (newInput.length === KONAMI_CODE.length) {
        const isMatch = newInput.every(
          (key, index) => key === KONAMI_CODE[index]
        );
        if (isMatch) {
          showEasterEgg();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [input, showEasterEgg]);
}
