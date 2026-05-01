import { useState } from "react";
import "./App.css";
import Fireworks from "./components/Fireworks";

function App() {
  const [opened, setOpened] = useState(false);
  const [contentVisible, setContentVisible] = useState(false);
  const [closed, setClosed] = useState(false);
  const [showFireworks, setShowFireworks] = useState(false);

  const handleOpen = () => {
    if (opened) return;
    setOpened(true);
    setTimeout(() => {
      setContentVisible(true);
      setShowFireworks(true);
      setTimeout(() => setShowFireworks(false), 5500);
    }, 1400);
  };

  const handleClose = () => {
    if (closed) return;
    setContentVisible(false);
    setTimeout(() => {
      setOpened(false);
      setClosed(true);
    }, 1400);
  };

  return (
    <div className="h-svh overflow-hidden flex items-center justify-center perspective-distant bg-[linear-gradient(135deg,#fff0f5_0%,#ffe4f0_40%,#ffd6e7_100%)] p-4">
      {showFireworks && <Fireworks />}
      <div className="w-150 h-150 relative transform-3d">
        <div
          onClick={handleOpen}
          className={[
            "absolute inset-0 backface-hidden",
            "rounded-[4px_12px_12px_4px] bg-[linear-gradient(145deg,#ff6eb4,#ff3d8b,#ff8dc7)]",
            "flex flex-col items-center justify-center gap-2 sm:gap-3 p-5 sm:p-8 box-border z-10",
            "origin-[left_center] transition-transform duration-1400 ease-in-out",
            opened
              ? "transform-[rotateY(-180deg)] cursor-default"
              : "transform-[rotateY(0deg)] cursor-pointer",
          ].join(" ")}
        >
          <div className="flex gap-1.5 sm:gap-2.5 text-[2.5rem] sm:text-[3.5rem] animate-[floatFlowers_2s_ease-in-out_infinite_alternate]">
            <span>🌸</span>
            <span>🌺</span>
            <span>🌼</span>
            <span>🌻</span>
            <span>🌷</span>
          </div>
          <h1 className="m-0 text-5xl sm:text-5xl font-extrabold text-white text-center leading-tight tracking-[-0.5px] [text-shadow:2px_3px_8px_rgba(180,0,80,0.4)]">
            ¡Feliz Día
            <br />
            de la Madre!
          </h1>
          <p className="m-0 text-2xl sm:text-3xl text-white/90 italic">
            Con todo mi amor 💖
          </p>
          {!opened && (
            <p className="m-0 mt-1 text-xl sm:text-2xl text-white/80 animate-pulse">
              Toca para abrir 🎁
            </p>
          )}
        </div>

        <div className="absolute inset-0 flex rounded-[4px_12px_12px_4px] overflow-hidden bg-[#fff9fb] shadow-[0_20px_40px_rgba(255,100,150,0.3)]">
          <div className="w-1/2 flex items-center justify-center border-r-2 border-dashed border-pink-200 bg-[linear-gradient(160deg,#ffe0ef,#ffc2dc)]">
            <div
              onClick={handleClose}
              className={[
                "flex flex-col text-center gap-2 sm:gap-3.5 text-3xl sm:text-5xl transition-[opacity,transform] duration-600 ease-out",
                contentVisible
                  ? "opacity-100 scale-100 cursor-pointer"
                  : "opacity-0 scale-75",
              ].join(" ")}
            >
              <span>🌸</span>
              <span>🌺</span>
              <span>🌼</span>
              {contentVisible && (
                <p className="m-0 text-xl sm:text-2xl text-pink-400 italic animate-pulse">
                  Toca para cerrar 🎁
                </p>
              )}
            </div>
          </div>

          <div className="w-1/2 p-4 sm:p-6 flex flex-col justify-center gap-3 sm:gap-5">
            <p
              className={[
                "m-0 text-xl sm:text-2xl leading-[1.6] text-[#5a3550] font-serif",
                "transition-[opacity,transform] duration-700 ease-out",
                contentVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-3",
              ].join(" ")}
            >
              ¡Feliz día de la madre! Espero que disfrutes tu regalo en Oropesa
              con la paz, tranquilidad y felicidad que da el mar.
            </p>
            <span
              className={[
                "text-xl sm:text-2xl text-[#ff3d8b] italic font-semibold",
                "transition-[opacity,transform] duration-700 delay-300 ease-out",
                contentVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-3",
              ].join(" ")}
            >
              Con cariño 💕
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
