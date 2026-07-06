import React, { useState, useEffect, useRef } from "react";
import { Heart, Volume2, VolumeX, Sparkles, AlertCircle, Share2, Smile, ArrowRight, Stars, CheckCircle2, Lock, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

// Generated image paths from AI Studio Image Generator
const SAD_CHIBI_PATH = "/src/assets/images/sad_apology_cat_1783347444076.jpg";
const HAPPY_CHIBI_PATH = "/src/assets/images/cute_cat_love_1783347102970.jpg";

interface BackgroundHeart {
  id: number;
  left: number;
  size: number;
  delay: number;
  duration: number;
  drift: number;
  rotation: number;
}

interface ConfettiHeart {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  rotation: number;
  rotSpeed: number;
  opacity: number;
}

export default function App() {
  const [currentPage, setCurrentPage] = useState<"verify" | "verify2" | "page1" | "page2">("verify");
  const [nameInput, setNameInput] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [shakeTrigger, setShakeTrigger] = useState(false);
  const [showVerificationError, setShowVerificationError] = useState<string | null>(null);
  const [isInputGreen, setIsInputGreen] = useState(false);

  // States for verification page 2 (Date Check)
  const [dateInput, setDateInput] = useState("");
  const [isVerifying2, setIsVerifying2] = useState(false);
  const [isVerified2, setIsVerified2] = useState(false);
  const [shakeTrigger2, setShakeTrigger2] = useState(false);
  const [isInputGreen2, setIsInputGreen2] = useState(false);
  const [isInputRed2, setIsInputRed2] = useState(false);

  const [soundEnabled, setSoundEnabled] = useState(false);

  const handleVerifySubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    const trimmedInput = nameInput.trim();
    if (!trimmedInput) return;
    
    // Check name (case-insensitive)
    if (trimmedInput.toLowerCase() === "zahra tusshita") {
      // Correct name!
      playCuteSound("sparkle");
      setIsVerifying(true);
      setIsInputGreen(true);
      
      // Spawn confetti at the center of the screen
      const startX = window.innerWidth / 2;
      const startY = window.innerHeight / 2;
      const colors = ["#ff7b90", "#ff4b6b", "#38bdf8", "#7dd3fc", "#fda4af", "#ffffff"];
      const newConfetti: ConfettiHeart[] = Array.from({ length: 85 }).map((_, i) => {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 15 + 5;
        return {
          id: Date.now() + i + 2000,
          x: startX,
          y: startY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 6,
          size: Math.random() * 18 + 10,
          color: colors[Math.floor(Math.random() * colors.length)],
          rotation: Math.random() * 360,
          rotSpeed: Math.random() * 10 - 5,
          opacity: 1,
        };
      });
      setConfetti(newConfetti);
      setIsVerified(true);
      
      // Transition after 1.5 seconds so loading, checkmark, and text are visible
      setTimeout(() => {
        setIsVerifying(false);
        setCurrentPage("verify2");
      }, 1800);
      
    } else {
      // Wrong name
      playCuteSound("bounce");
      setShakeTrigger(true);
      setTimeout(() => setShakeTrigger(false), 500);
      
      // Select a cute random Indonesian error message
      const msgs = [
        "Hmm... kayaknya kamu bukan orang yang aku tunggu 🙈",
        "Yahh, coba masukin nama yang benar dulu ya 🤍🥺",
        "Eh? Salah nama tuh, coba dicek lagi yahh manis... 😏😏"
      ];
      const randomMsg = msgs[Math.floor(Math.random() * msgs.length)];
      setShowVerificationError(randomMsg);
    }
  };

  const handleVerify2Submit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    const trimmedInput = dateInput.trim();
    if (!trimmedInput) return;
    
    // Check answer: "31-03-2026"
    if (trimmedInput === "31-03-2026") {
      playCuteSound("sparkle");
      setIsVerifying2(true);
      setIsInputGreen2(true);
      
      // Spawn confetti at the center of the screen
      const startX = window.innerWidth / 2;
      const startY = window.innerHeight / 2;
      const colors = ["#ff7b90", "#ff4b6b", "#38bdf8", "#7dd3fc", "#fda4af", "#ffffff"];
      const newConfetti: ConfettiHeart[] = Array.from({ length: 85 }).map((_, i) => {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 15 + 5;
        return {
          id: Date.now() + i + 3000,
          x: startX,
          y: startY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 6,
          size: Math.random() * 18 + 10,
          color: colors[Math.floor(Math.random() * colors.length)],
          rotation: Math.random() * 360,
          rotSpeed: Math.random() * 10 - 5,
          opacity: 1,
        };
      });
      setConfetti(newConfetti);
      setIsVerified2(true);
      
      // Transition after 1.5 seconds so loading, checkmark, and text are visible
      setTimeout(() => {
        setIsVerifying2(false);
        setCurrentPage("page1");
      }, 1600);
      
    } else {
      // Wrong answer
      playCuteSound("bounce");
      setShakeTrigger2(true);
      setIsInputRed2(true);
      setTimeout(() => {
        setShakeTrigger2(false);
        setIsInputRed2(false);
      }, 800);
      
      const msgs = [
        "yahh masih salah niee 🥺",
        "masa lupa tanggal sepenting itu.. 💔",
        "cobaaa inget inget lagi yaa 🤍😏",
        "Hint: tanggal yang paling spesial buat kita ❤️"
      ];
      const randomMsg = msgs[Math.floor(Math.random() * msgs.length)];
      setShowVerificationError(randomMsg);
    }
  };
  const [currentResponse, setCurrentResponse] = useState("maafinn yaa..😔");
  const [noBtnPos, setNoBtnPos] = useState<{ x: number; y: number } | null>(null);
  const [noBtnAttempts, setNoBtnAttempts] = useState(0);
  
  // Confetti hearts state
  const [confetti, setConfetti] = useState<ConfettiHeart[]>([]);
  
  // Virtual Hug overlay state
  const [showHugOverlay, setShowHugOverlay] = useState(false);
  const [hugHearts, setHugHearts] = useState<{ id: number; scale: number; x: number; y: number; delay: number; rotate: number }[]>([]);

  // Dynamic scale calculation based on evasion attempts
  const maafinScale = Math.min(1 + noBtnAttempts * 0.15, 3.5);
  const tidakScale = Math.max(1 - noBtnAttempts * 0.08, 0.15);

  // State for dynamic Jara Image
  const [jaraImagePath, setJaraImagePath] = useState("/src/assets/images/jara.jpg");
  const [hasImageError, setHasImageError] = useState(false);

  const handleImageError = () => {
    if (jaraImagePath === "/src/assets/images/jara.jpg") {
      setJaraImagePath("/src/assets/images/jara.png");
    } else if (jaraImagePath === "/src/assets/images/jara.png") {
      setJaraImagePath("/src/assets/images/jara.jpeg");
    } else if (jaraImagePath === "/src/assets/images/jara.jpeg") {
      // Finally fallback to generated placeholder
      setJaraImagePath("/src/assets/images/jara_cute_photo_1783346476282.jpg");
      setHasImageError(true);
    }
  };

  // Sound Synth engine using Web Audio API
  const playCuteSound = (type: "pop" | "sparkle" | "hug" | "bounce" | "ambient") => {
    if (!soundEnabled && type !== "ambient") return;
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();
      
      if (type === "bounce") {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(160, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(380, ctx.currentTime + 0.12);
        
        gain.gain.setValueAtTime(0.12, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.12);
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.12);
      } else if (type === "pop") {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(280, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(750, ctx.currentTime + 0.08);
        
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08);
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.08);
      } else if (type === "sparkle") {
        // Cascade of lovely notes
        const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
        notes.forEach((freq, index) => {
          const time = ctx.currentTime + index * 0.07;
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = "triangle";
          osc.frequency.setValueAtTime(freq, time);
          
          gain.gain.setValueAtTime(0.08, time);
          gain.gain.exponentialRampToValueAtTime(0.01, time + 0.18);
          
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(time);
          osc.stop(time + 0.18);
        });
      } else if (type === "hug") {
        // Heartfelt chord swell
        const frequencies = [261.63, 329.63, 392.00, 523.25]; // C major chord
        frequencies.forEach((freq) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = "sine";
          osc.frequency.setValueAtTime(freq, ctx.currentTime);
          osc.frequency.exponentialRampToValueAtTime(freq * 1.5, ctx.currentTime + 1.2);
          
          gain.gain.setValueAtTime(0.01, ctx.currentTime);
          gain.gain.linearRampToValueAtTime(0.06, ctx.currentTime + 0.3);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.5);
          
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start();
          osc.stop(ctx.currentTime + 1.5);
        });
      }
    } catch (err) {
      console.warn("Audio Context fail", err);
    }
  };

  // Background floating hearts data
  const [bgHearts] = useState<BackgroundHeart[]>(() => 
    Array.from({ length: 28 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      size: Math.random() * 18 + 12, // 12px to 30px
      delay: Math.random() * -20, // Negative delay so they start pre-animated
      duration: Math.random() * 14 + 12, // 12s to 26s
      drift: Math.random() * 80 - 40,
      rotation: Math.random() * 45 - 22,
    }))
  );

  // Confetti particles loop
  useEffect(() => {
    if (confetti.length === 0) return;
    let active = true;
    let lastTime = performance.now();

    const updatePhysics = (now: number) => {
      if (!active) return;
      const dt = (now - lastTime) / 1000;
      lastTime = now;

      setConfetti((prev) => {
        const next = prev
          .map((p) => ({
            ...p,
            x: p.x + p.vx * dt * 60,
            y: p.y + p.vy * dt * 60,
            vy: p.vy + 0.3, // Gravity
            rotation: p.rotation + p.rotSpeed * dt * 60,
            opacity: p.opacity - dt * 0.5,
          }))
          .filter((p) => p.opacity > 0 && p.y < window.innerHeight + 50);

        if (next.length === 0) {
          active = false;
        }
        return next;
      });

      if (active) {
        requestAnimationFrame(updatePhysics);
      }
    };

    const frameId = requestAnimationFrame(updatePhysics);
    return () => {
      active = false;
      cancelAnimationFrame(frameId);
    };
  }, [confetti.length]);

  // Handle No button evasion
  const handleNoButtonEvasion = (e: React.MouseEvent | React.TouchEvent) => {
    if (e.type === "touchstart") {
      e.preventDefault();
    }
    
    // Play cute bounce note
    playCuteSound("bounce");

    // Dimensions of the button
    const btnWidth = 120;
    const btnHeight = 48;
    const padding = 24;

    // Generate random position within safe viewport boundaries
    const safeWidth = window.innerWidth - btnWidth - padding * 2;
    const safeHeight = window.innerHeight - btnHeight - padding * 2;

    const randomX = padding + Math.random() * safeWidth;
    const randomY = padding + Math.random() * safeHeight;

    setNoBtnPos({ x: randomX, y: randomY });
    setNoBtnAttempts((prev) => prev + 1);

    // Cute Indonesian response texts when avoiding the apology
    const responseTexts = [
      "yakin..? 🥺",
      "gamau benerann??? :(9",
      "coba pikir pikir lagi dongf💗",
      "maafinn yaa..😔",
      "pliss maafin akuuu jaraaa 🙏🩵",
      "jahat bgt sih gamau maafin 😭",
      "pikir-pikir duluuu beb 🥺👉👈",
      "aku janji ga nakal lagi 😔❤️",
      "nanti aku beliin eskrim deh 🍦✨",
      "gabisa pencet kan? wkwk 😜"
    ];

    let newResponse = responseTexts[Math.floor(Math.random() * responseTexts.length)];
    // Make sure we get a fresh text each time
    while (newResponse === currentResponse) {
      newResponse = responseTexts[Math.floor(Math.random() * responseTexts.length)];
    }
    setCurrentResponse(newResponse);
  };

  // Handle Maafin action
  const handleMaafin = (e: React.MouseEvent) => {
    // Play lovely chime audio cascade
    playCuteSound("sparkle");

    // Spawn heart confetti explosion at button coordinate
    const buttonRect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const startX = buttonRect.left + buttonRect.width / 2;
    const startY = buttonRect.top + buttonRect.height / 2;

    const colors = ["#ff7b90", "#ff4b6b", "#38bdf8", "#7dd3fc", "#fda4af", "#ffffff"];
    const newConfetti: ConfettiHeart[] = Array.from({ length: 65 }).map((_, i) => {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 12 + 6;
      return {
        id: Date.now() + i,
        x: startX,
        y: startY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 5, // initial upward blast
        size: Math.random() * 16 + 10,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        rotSpeed: Math.random() * 10 - 5,
        opacity: 1,
      };
    });

    setConfetti(newConfetti);

    // Smooth page transition to Page 2
    setTimeout(() => {
      setCurrentPage("page2");
    }, 900);
  };

  // Handle Virtual Hug action
  const triggerVirtualHug = () => {
    playCuteSound("hug");
    setShowHugOverlay(true);

    // Generate random positions and scales for hundreds of heart emojis
    const hearts = Array.from({ length: 80 }).map((_, i) => ({
      id: i,
      scale: Math.random() * 2.5 + 0.8,
      x: (Math.random() - 0.5) * window.innerWidth * 1.2,
      y: (Math.random() - 0.5) * window.innerHeight * 1.2,
      delay: Math.random() * 0.4,
      rotate: Math.random() * 180 - 90,
    }));
    setHugHearts(hearts);

    // Fade out overlay after 3 seconds
    setTimeout(() => {
      setShowHugOverlay(false);
    }, 3200);
  };

  // Auto-enable sound on first gesture to bypass browser block
  const enableAudioSilently = () => {
    if (!soundEnabled) {
      setSoundEnabled(true);
      // Play a tiny confirmation chime
      setTimeout(() => {
        playCuteSound("pop");
      }, 50);
    }
  };

  return (
    <div 
      className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-gradient-to-b from-sky-100 via-sky-50 to-pink-50 px-4 py-8 select-none"
      onClick={enableAudioSilently}
    >
      {/* Dynamic Background Glassmorphism Glow Blobs */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Pink Blob */}
        <div className="absolute top-[-10%] left-[-10%] w-[350px] h-[350px] rounded-full bg-gradient-to-tr from-pink-300/40 to-rose-200/40 filter blur-[80px] animate-blob" />
        {/* Sky/Blue Blob */}
        <div className="absolute bottom-[-10%] right-[-10%] w-[450px] h-[450px] rounded-full bg-gradient-to-br from-sky-300/40 to-blue-200/40 filter blur-[100px] animate-blob" style={{ animationDelay: "-4s" }} />
        {/* Peach Blob */}
        <div className="absolute top-[35%] right-[15%] w-[250px] h-[250px] rounded-full bg-gradient-to-l from-amber-200/35 to-rose-100/35 filter blur-[60px] animate-blob" style={{ animationDelay: "-8s" }} />
        {/* Soft Violet Sparkle Blob */}
        <div className="absolute bottom-[20%] left-[10%] w-[300px] h-[300px] rounded-full bg-gradient-to-tr from-indigo-200/30 to-sky-100/35 filter blur-[70px] animate-blob" style={{ animationDelay: "-12s" }} />

        {/* Twinkling mini stars/sparkles in background */}
        <div className="absolute top-[15%] left-[25%] text-pink-300/60 text-xl animate-twinkle">✨</div>
        <div className="absolute top-[45%] right-[20%] text-sky-400/60 text-2xl animate-twinkle" style={{ animationDelay: "1.5s" }}>⭐</div>
        <div className="absolute bottom-[25%] left-[15%] text-pink-400/50 text-lg animate-twinkle" style={{ animationDelay: "3s" }}>✨</div>
        <div className="absolute top-[75%] right-[40%] text-sky-300/60 text-xl animate-twinkle" style={{ animationDelay: "0.8s" }}>✨</div>
        <div className="absolute bottom-[10%] right-[25%] text-pink-300/60 text-2xl animate-twinkle" style={{ animationDelay: "2.3s" }}>💖</div>
      </div>

      {/* Background slowly floating Hearts */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        {bgHearts.map((heart) => (
          <div
            key={heart.id}
            className="bg-heart text-sky-200/50"
            style={{
              left: `${heart.left}%`,
              width: `${heart.size}px`,
              height: `${heart.size}px`,
              animationDelay: `${heart.delay}s`,
              "--duration": `${heart.duration}s`,
              "--drift": `${heart.drift}px`,
              "--rotation": `${heart.rotation}deg`,
            } as any}
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
          </div>
        ))}
      </div>

      {/* Confetti Explosion Hearts */}
      <div className="absolute inset-0 pointer-events-none z-50 overflow-hidden">
        {confetti.map((c) => (
          <div
            key={c.id}
            className="absolute"
            style={{
              left: `${c.x}px`,
              top: `${c.y}px`,
              width: `${c.size}px`,
              height: `${c.size}px`,
              transform: `translate(-50%, -50%) rotate(${c.rotation}deg)`,
              color: c.color,
              opacity: c.opacity,
            }}
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full drop-shadow-sm">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
          </div>
        ))}
      </div>

      {/* Sound Controller Float Toggle */}
      <div className="absolute top-4 right-4 z-40">
        <button
          onClick={(e) => {
            e.stopPropagation();
            setSoundEnabled(!soundEnabled);
            playCuteSound("pop");
          }}
          className={`flex items-center gap-2 px-3 py-2 rounded-full border border-sky-200/50 text-xs font-semibold shadow-sm transition-all duration-300 ${
            soundEnabled 
              ? "bg-white text-sky-500 shadow-md scale-105" 
              : "bg-sky-50/80 text-sky-400 hover:bg-white"
          }`}
          id="sound-toggle-btn"
        >
          {soundEnabled ? (
            <>
              <Volume2 className="w-4 h-4 text-sky-500 animate-bounce" />
              <span>Musik ON 🎵</span>
            </>
          ) : (
            <>
              <VolumeX className="w-4 h-4 text-sky-400" />
              <span>Musik OFF 🔇</span>
            </>
          )}
        </button>
      </div>

      {/* Main Container */}
      <div className="w-full max-w-lg z-10">
        <AnimatePresence mode="wait">
          {currentPage === "verify" ? (
            <motion.div
              key="verify-page"
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.4 } }}
              className="bg-white/85 backdrop-blur-md rounded-3xl border border-sky-100/50 shadow-xl shadow-sky-100/40 p-6 md:p-8 text-center flex flex-col items-center"
              id="card-verify-page"
            >
              {/* Cute Header Lock Tag */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-50 text-pink-500 text-xs font-semibold mb-5 shadow-sm">
                <Lock className="w-3.5 h-3.5 text-pink-400 animate-pulse" />
                <span>Verification Access Gate</span>
              </div>

              {/* Title */}
              <h1 className="font-display text-3xl md:text-4xl font-extrabold text-sky-950 tracking-tight mb-3">
                🔒 Verifikasi Duluuuuuu🤍
              </h1>

              {/* Subtitle description */}
              <p className="text-slate-600 font-medium leading-relaxed text-sm md:text-[15px] mb-8 max-w-sm">
                Website ini khusus untuk seseorang yang spesial. Masukkan nama lengkapnye dulu yee😏😏
              </p>

              {/* Form Input Container */}
              <form onSubmit={handleVerifySubmit} className="w-full max-w-sm flex flex-col gap-4">
                {/* Shake animate wrapper for input */}
                <motion.div
                  animate={shakeTrigger ? { x: [-10, 10, -10, 10, -5, 5, 0] } : {}}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                  className="relative w-full"
                >
                  <input
                    type="text"
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    disabled={isVerifying}
                    placeholder="Masukkan nama lengkap..."
                    className={`w-full px-5 py-3.5 rounded-2xl border-2 text-slate-800 placeholder-slate-400 font-medium text-base transition-all duration-300 outline-none
                      ${
                        isInputGreen
                          ? "border-emerald-400 bg-emerald-50/50 focus:ring-emerald-300/50 text-emerald-900 shadow-[0_0_15px_rgba(52,211,153,0.5)]"
                          : "border-slate-200 bg-slate-50/50 hover:bg-slate-50 focus:border-pink-400 focus:bg-white focus:ring-4 focus:ring-pink-300/40 focus:shadow-[0_0_15px_rgba(244,114,182,0.4)]"
                      }`}
                    id="verify-name-input"
                  />

                  {/* Typing Heart Indicator */}
                  <AnimatePresence>
                    {nameInput.trim().length > 0 && !isVerified && (
                      <motion.div
                        initial={{ scale: 0, opacity: 0, rotate: -20 }}
                        animate={{ scale: 1, opacity: 1, rotate: 0 }}
                        exit={{ scale: 0, opacity: 0, rotate: 20 }}
                        className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none"
                      >
                        <Heart className="w-5 h-5 fill-pink-500 text-pink-500 animate-pulse" />
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Verified check icon */}
                  {isVerified && (
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 animate-bounce" />
                    </div>
                  )}
                </motion.div>

                {/* Submit button with hover / ripple and state animations */}
                <motion.button
                  type="submit"
                  disabled={isVerifying || !nameInput.trim()}
                  whileHover={{ scale: isVerifying ? 1 : 1.03 }}
                  whileTap={{ scale: isVerifying ? 1 : 0.97 }}
                  className={`relative overflow-hidden w-full py-4 rounded-2xl font-display font-bold text-lg shadow-lg transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer
                    ${
                      isVerified
                        ? "bg-emerald-500 text-white shadow-emerald-400/40"
                        : !nameInput.trim()
                        ? "bg-slate-200 text-slate-400 cursor-not-allowed shadow-none"
                        : "bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 hover:from-rose-500 hover:to-pink-600 text-white shadow-pink-400/40 hover:shadow-pink-500/50 hover:scale-[1.02] active:scale-[0.98]"
                    }`}
                  id="btn-verify-submit"
                >
                  {isVerifying ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin text-white" />
                      <span>Memverifikasi... ✨</span>
                    </>
                  ) : isVerified ? (
                    <>
                      <CheckCircle2 className="w-5 h-5 animate-bounce text-white" />
                      <span>Verifikasi berhasil! welkomm manies</span>
                    </>
                  ) : (
                    <>
                      <span>✨ Submit</span>
                    </>
                  )}
                  {/* Glass shimmer ripple highlight overlay */}
                  <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full hover:animate-[shimmer_1.5s_infinite] pointer-events-none" />
                </motion.button>
              </form>
            </motion.div>
          ) : currentPage === "verify2" ? (
            <motion.div
              key="verify-page-2"
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.4 } }}
              className="bg-white/85 backdrop-blur-md rounded-3xl border border-sky-100/50 shadow-xl shadow-sky-100/40 p-6 md:p-8 text-center flex flex-col items-center"
              id="card-verify-page-2"
            >
              {/* Cute Header Lock Tag */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-50 text-pink-500 text-xs font-semibold mb-5 shadow-sm">
                <Lock className="w-3.5 h-3.5 text-pink-400 animate-pulse" />
                <span>Verification Access Gate II</span>
              </div>

              {/* Title */}
              <h1 className="font-display text-2xl md:text-3xl font-extrabold text-sky-950 tracking-tight mb-3 leading-snug">
                🤔 eitss, masih belum yakin aku...
              </h1>

              {/* Subtitle description */}
              <p className="text-slate-500 font-semibold leading-relaxed text-sm md:text-base mb-6 max-w-sm">
                "cobacoba jawab pertanyaan ini doloo"
              </p>

              {/* Question card */}
              <div className="bg-sky-50/70 border border-sky-100/50 rounded-2xl p-4 md:p-5 w-full mb-6 text-center shadow-inner">
                <p className="text-sky-900 font-bold text-lg md:text-xl">
                  "berapa tanggal kita balikan?"
                </p>
              </div>

              {/* Form Input Container */}
              <form onSubmit={handleVerify2Submit} className="w-full max-w-sm flex flex-col gap-4">
                {/* Shake animate wrapper for input */}
                <motion.div
                  animate={shakeTrigger2 ? { x: [-10, 10, -10, 10, -5, 5, 0] } : {}}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                  className="relative w-full"
                >
                  <input
                    type="text"
                    value={dateInput}
                    onChange={(e) => setDateInput(e.target.value)}
                    disabled={isVerifying2}
                    placeholder="Contoh: 22-07-2026"
                    className={`w-full px-5 py-3.5 rounded-2xl border-2 text-slate-800 placeholder-slate-400 font-medium text-base text-center transition-all duration-300 outline-none
                      ${
                        isInputGreen2
                          ? "border-emerald-400 bg-emerald-50/50 focus:ring-emerald-300/50 text-emerald-900 shadow-[0_0_15px_rgba(52,211,153,0.5)]"
                          : isInputRed2
                          ? "border-rose-400 bg-rose-50/50 focus:ring-rose-300/50 text-rose-900 shadow-[0_0_15px_rgba(244,63,94,0.5)]"
                          : "border-slate-200 bg-slate-50/50 hover:bg-slate-50 focus:border-pink-400 focus:bg-white focus:ring-4 focus:ring-pink-300/40 focus:shadow-[0_0_15px_rgba(244,114,182,0.4)]"
                      }`}
                    id="verify-date-input"
                  />

                  {/* Typing Heart Indicator */}
                  <AnimatePresence>
                    {dateInput.trim().length > 0 && !isVerified2 && (
                      <motion.div
                        initial={{ scale: 0, opacity: 0, rotate: -20 }}
                        animate={{ scale: 1, opacity: 1, rotate: 0 }}
                        exit={{ scale: 0, opacity: 0, rotate: 20 }}
                        className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none"
                      >
                        <Heart className="w-5 h-5 fill-pink-500 text-pink-500 animate-pulse" />
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Verified check icon */}
                  {isVerified2 && (
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 animate-bounce" />
                    </div>
                  )}
                </motion.div>

                {/* Submit button with hover / ripple and state animations */}
                <motion.button
                  type="submit"
                  disabled={isVerifying2 || !dateInput.trim()}
                  whileHover={{ scale: isVerifying2 ? 1 : 1.03 }}
                  whileTap={{ scale: isVerifying2 ? 1 : 0.97 }}
                  className={`relative overflow-hidden w-full py-4 rounded-2xl font-display font-bold text-lg shadow-lg transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer
                    ${
                      isVerified2
                        ? "bg-emerald-500 text-white shadow-emerald-400/40"
                        : !dateInput.trim()
                        ? "bg-slate-200 text-slate-400 cursor-not-allowed shadow-none"
                        : "bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 hover:from-rose-500 hover:to-pink-600 text-white shadow-pink-400/40 hover:shadow-pink-500/50 hover:scale-[1.02] active:scale-[0.98] btn-shine"
                    }`}
                  id="btn-verify2-submit"
                >
                  {isVerifying2 ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin text-white" />
                      <span>Memverifikasi... ✨</span>
                    </>
                  ) : isVerified2 ? (
                    <>
                      <CheckCircle2 className="w-5 h-5 animate-bounce text-white" />
                      <span>yeyyyyyy! kamu masi inget 🤍</span>
                    </>
                  ) : (
                    <>
                      <span>💖 Lanjut</span>
                    </>
                  )}
                  {/* Glass shimmer ripple highlight overlay */}
                  <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full hover:animate-[shimmer_1.5s_infinite] pointer-events-none" />
                </motion.button>
              </form>
            </motion.div>
          ) : currentPage === "page1" ? (
            <motion.div
              key="page1"
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.4 } }}
              className="bg-white/80 backdrop-blur-md rounded-3xl border border-sky-100 shadow-xl shadow-sky-100/40 p-6 md:p-8 text-center flex flex-col items-center"
              id="card-page-1"
            >
              {/* Cute Header Tag */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-50 text-sky-500 text-xs font-medium mb-4">
                <Stars className="w-3 h-3 text-sky-400 animate-spin" />
                <span>Kartu Maaf Spesial Untukmu</span>
                <Stars className="w-3 h-3 text-sky-400 animate-spin" />
              </div>

              {/* Title */}
              <h1 className="font-display text-4xl md:text-5xl font-bold text-sky-900 tracking-tight mb-2">
                haiii jaraa
              </h1>

              {/* Speech Bubble for Sad Bunny */}
              <motion.div 
                key={currentResponse}
                initial={{ opacity: 0, y: 10, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className="relative bg-sky-500 text-white font-medium text-sm py-2 px-4 rounded-2xl shadow-md shadow-sky-500/10 mb-5 max-w-[85%] border-2 border-white"
                id="speech-bubble"
              >
                {currentResponse}
                {/* Speech Bubble Arrow */}
                <div className="absolute bottom-[-8px] left-1/2 -translate-x-1/2 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[8px] border-t-sky-500"></div>
              </motion.div>

              {/* Cute Cat Image Panel */}
              <div className="relative w-48 h-48 md:w-56 md:h-56 rounded-2xl overflow-hidden shadow-md shadow-sky-100 bg-white border-4 border-sky-100/50 mb-6 flex items-center justify-center group">
                <img
                  src={SAD_CHIBI_PATH}
                  alt="Kucing sedih meminta maaf"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                  id="sad-chibi-image"
                />
                
                {/* Floating Emojis Overlay */}
                <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm p-1.5 rounded-full text-lg shadow-sm">
                  🥺💗
                </div>
              </div>

              {/* Apology Text Content */}
              <div className="bg-sky-50/50 rounded-2xl p-5 border border-sky-100/30 mb-8 text-left">
                <div className="text-xs font-bold tracking-widest text-sky-600/90 mb-3 uppercase flex items-center gap-1.5 animate-pulse">
                  📢 BACA DULUUU YAAA 🥺👇
                </div>
                <p className="text-sky-950 font-medium leading-relaxed text-[15px] md:text-base tracking-wide">
                  maafff yaa aku sala, aku tau kemaren sala akuu karna gabisa ngertiin kamu, padahal kamu cuma mau disayang ya, cuma mau dibela, <span className="font-bold text-sky-600">AKU MINTA MAAFF YAA</span>, akuu mau ngertiin kamu lebih dalemmm lagiii jaraa, jadi, maafinn aku yaaa, kasi aku kesempatan lagii buat ngertiin kamuu, aku yakin kamu ga akan nyesel uda maafin akuw
                </p>
              </div>

              {/* Interactive Buttons Container */}
              <div className="relative w-full flex flex-col sm:flex-row items-center justify-center gap-6 min-h-[160px] sm:min-h-[80px]">
                {/* Maafin Button */}
                <motion.button
                  animate={{ scale: maafinScale }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  onClick={handleMaafin}
                  className="w-full sm:w-auto px-10 py-4 rounded-full bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 hover:from-rose-500 hover:to-pink-600 text-white font-display font-bold text-xl shadow-xl shadow-pink-400/50 hover:shadow-pink-500/60 ring-4 ring-pink-100/90 hover:ring-pink-200/90 active:scale-95 transition-all duration-200 cursor-pointer flex items-center justify-center gap-2.5 btn-shine animate-pulse"
                  id="btn-maafin"
                  style={{ originX: 0.5, originY: 0.5 }}
                >
                  <Heart className="w-6 h-6 fill-white animate-bounce text-white shrink-0" />
                  <span className="tracking-wide drop-shadow-sm">dimaapin.. ❤️</span>
                </motion.button>

                {/* "Tidak" Button with Evasion Code */}
                <motion.button
                  animate={{ scale: tidakScale }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  onMouseEnter={handleNoButtonEvasion}
                  onTouchStart={handleNoButtonEvasion}
                  style={{
                    ...(noBtnPos 
                      ? { position: "fixed", left: `${noBtnPos.x}px`, top: `${noBtnPos.y}px`, zIndex: 100 } 
                      : {}),
                    originX: 0.5,
                    originY: 0.5
                  }}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-white hover:bg-slate-100 text-slate-700 font-display font-semibold text-lg border-2 border-slate-300 hover:border-slate-400 shadow-md transition-all duration-150 flex items-center justify-center gap-2 select-none cursor-pointer"
                  id="btn-tidak"
                >
                  <span>nggaa ahhh 😤</span>
                </motion.button>
              </div>

              {/* Interactive Hint Indicator */}
              {noBtnAttempts > 0 && (
                <p className="text-sky-400/80 text-[11px] font-medium mt-4 animate-pulse">
                  Telah dicoba {noBtnAttempts} kali, ayo klik "dimaapin.." ya jaraaa!
                </p>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="page2"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 120 }}
              className="bg-white/95 backdrop-blur-md rounded-3xl border border-sky-100 shadow-2xl shadow-sky-200/50 p-6 md:p-8 text-center flex flex-col items-center"
              id="card-page-2"
            >
              {/* Celebration Confetti Hearts Icon */}
              <div className="w-16 h-16 rounded-full bg-sky-50 flex items-center justify-center mb-4 text-sky-500 shadow-inner">
                <Sparkles className="w-8 h-8 animate-pulse text-sky-500" />
              </div>

              {/* Title */}
              <h1 className="font-display text-3xl md:text-4xl font-extrabold text-sky-900 tracking-tight leading-tight mb-4">
                YEY MAKASII JARAA🤍
              </h1>

              {/* Adorable Cat Image */}
              <div className="relative w-48 h-48 md:w-56 md:h-56 rounded-2xl overflow-hidden shadow-lg shadow-sky-200/50 bg-white border-4 border-sky-200/30 mb-6 flex items-center justify-center group">
                <img
                  src={HAPPY_CHIBI_PATH}
                  alt="Kucing menggemaskan memeluk hati"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                  id="happy-chibi-image"
                />
                
                {/* Heart Burst indicator decoration */}
                <span className="absolute -bottom-2 -left-2 bg-sky-400 text-white rounded-full p-1 shadow-sm text-xs animate-bounce">
                  💖
                </span>
                <span className="absolute -top-2 -right-2 bg-sky-300 text-white rounded-full p-1 shadow-sm text-xs animate-ping">
                  ✨
                </span>
              </div>

              {/* Response Text Panel */}
              <div className="bg-sky-50/60 rounded-2xl p-5 border border-sky-100/50 mb-8">
                <p className="text-sky-950 font-medium text-[15px] md:text-base leading-relaxed tracking-wide text-left">
                  MAKASIII YAAA UDA MAAFIN AKUU, semogaaa iklass yaa, masa iyaa ga iklas, jara kan baik cantik imut lucu gemesin, hehe, tenangg ajaaa aku bertanggung jawabb sama apa yang aku ketikk diawall koo, akuu mauu berubaaa terus terusan buat kamu, <span className="font-bold text-sky-600">AKU SAYANG KAMU JARA🩵🩵</span>
                </p>
              </div>

              {/* Virtual Hug Button */}
              <div className="w-full flex flex-col gap-4">
                <button
                  onClick={triggerVirtualHug}
                  className="w-full px-8 py-4 rounded-full bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500 hover:from-pink-600 hover:to-rose-600 text-white font-display font-bold text-xl shadow-xl shadow-rose-400/40 hover:shadow-rose-500/50 ring-4 ring-pink-100/90 hover:ring-pink-200/90 active:scale-95 transition-all duration-200 flex items-center justify-center gap-2.5 cursor-pointer btn-shine animate-pulse"
                  id="btn-virtual-hug"
                >
                  <span className="drop-shadow-sm">muah dari aku 💋😘</span>
                </button>

                <button
                  onClick={() => {
                    playCuteSound("pop");
                    setCurrentPage("verify");
                    setNameInput("");
                    setIsVerified(false);
                    setIsVerifying(false);
                    setIsInputGreen(false);
                    setDateInput("");
                    setIsVerified2(false);
                    setIsVerifying2(false);
                    setIsInputGreen2(false);
                    setIsInputRed2(false);
                    setNoBtnPos(null);
                    setNoBtnAttempts(0);
                    setCurrentResponse("maafinn yaa..😔");
                  }}
                  className="w-full px-8 py-3.5 rounded-full bg-white hover:bg-slate-50 text-slate-600 font-display font-semibold text-[15px] border-2 border-slate-200 hover:border-slate-300 shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
                  id="btn-back"
                >
                  <span>Kembali ke Halaman Verifikasi 🌸</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Hug Overlay Animate */}
      <AnimatePresence>
        {showHugOverlay && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-sky-950/40 backdrop-blur-sm z-50 flex flex-col items-center justify-center"
            id="hug-overlay"
          >
            {/* Pop-up Card */}
            <motion.div
              initial={{ scale: 0.8, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.8, y: -20, opacity: 0 }}
              className="bg-white rounded-2xl p-6 shadow-2xl border border-sky-100 max-w-sm text-center mx-4 z-10"
            >
              <span className="text-4xl block mb-2 animate-bounce">😘💋❤️</span>
              <h2 className="font-display font-bold text-xl text-sky-900">
                Muahhh buat Jaraaa! 💋
              </h2>
              <p className="text-pink-500 text-sm mt-1 font-semibold">
                Kecup manis penuh cinta dan sayang!
              </p>
            </motion.div>

            {/* Flying Hearts & Kisses Burst */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              {hugHearts.map((h) => (
                <motion.div
                  key={h.id}
                  initial={{ scale: 0, x: 0, y: 0, opacity: 1 }}
                  animate={{
                    scale: h.scale,
                    x: h.x,
                    y: h.y,
                    opacity: [1, 1, 0],
                  }}
                  transition={{
                    duration: 2.8,
                    delay: h.delay,
                    ease: "easeOut",
                  }}
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 filter drop-shadow-md text-3xl"
                >
                  {["❤️", "💋", "😘", "💖", "💕"][h.id % 5]}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Verification Error Modal Pop-up */}
      <AnimatePresence>
        {showVerificationError && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowVerificationError(null)}
              className="absolute inset-0 bg-sky-950/40 backdrop-blur-sm"
            />
            
            {/* Modal Dialog */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 15 }}
              className="relative bg-white/95 backdrop-blur-md rounded-3xl p-6 shadow-2xl border border-rose-100 max-w-sm w-full text-center z-10"
            >
              <div className="text-5xl block mb-3 animate-bounce">🙈❤️</div>
              <h3 className="font-display font-bold text-xl text-slate-800 mb-2">Aduhhhh!</h3>
              <p className="text-slate-600 font-medium text-[15px] leading-relaxed mb-5">
                {showVerificationError}
              </p>
              <button
                onClick={() => setShowVerificationError(null)}
                className="w-full py-3.5 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-bold text-base shadow-lg shadow-pink-300/40 transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
              >
                Coba Lagi ✨
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
