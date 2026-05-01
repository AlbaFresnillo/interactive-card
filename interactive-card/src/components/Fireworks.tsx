import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  alpha: number;
  color: string;
  radius: number;
  gravity: number;
}

interface Rocket {
  x: number;
  y: number;
  vy: number;
  targetY: number;
  color: string;
  exploded: boolean;
  trail: { x: number; y: number }[];
}

const COLORS = [
  "#ff6eb4",
  "#ff3d8b",
  "#ff8dc7",
  "#ffd700",
  "#ff4500",
  "#7fff00",
  "#00cfff",
  "#bf00ff",
  "#ff69b4",
];

function randomColor() {
  return COLORS[Math.floor(Math.random() * COLORS.length)];
}

function playBoom(audioCtx: AudioContext, volume = 0.4) {
  const bufferSize = audioCtx.sampleRate * 0.6;
  const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufferSize, 2);
  }

  const source = audioCtx.createBufferSource();
  source.buffer = buffer;

  const gainNode = audioCtx.createGain();
  gainNode.gain.setValueAtTime(volume, audioCtx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.6);

  const filter = audioCtx.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = 800;

  source.connect(filter);
  filter.connect(gainNode);
  gainNode.connect(audioCtx.destination);
  source.start();
}

export default function Fireworks() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const activeRef = useRef(true);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    audioCtxRef.current = new AudioContext();

    const particles: Particle[] = [];
    const rockets: Rocket[] = [];

    function explode(x: number, y: number) {
      const color = randomColor();
      playBoom(audioCtxRef.current!, 0.3 + Math.random() * 0.2);
      const count = 80 + Math.floor(Math.random() * 60);
      for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 * i) / count + Math.random() * 0.3;
        const speed = 2 + Math.random() * 4;
        particles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          alpha: 1,
          color: Math.random() > 0.3 ? color : randomColor(),
          radius: 2 + Math.random() * 2,
          gravity: 0.06 + Math.random() * 0.04,
        });
      }
    }

    function launchRocket() {
      const x = canvas.width * (0.2 + Math.random() * 0.6);
      rockets.push({
        x,
        y: canvas.height,
        vy: -(12 + Math.random() * 6),
        targetY: canvas.height * (0.1 + Math.random() * 0.4),
        color: randomColor(),
        exploded: false,
        trail: [],
      });
    }

    for (let i = 0; i < 4; i++) {
      setTimeout(launchRocket, i * 250);
    }

    const interval = setInterval(() => {
      if (!activeRef.current) return;
      launchRocket();
    }, 600);

    setTimeout(() => {
      activeRef.current = false;
      clearInterval(interval);
    }, 5000);

    let raf: number;

    function animate() {
      ctx.fillStyle = "rgba(0,0,0,0.18)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      for (let i = rockets.length - 1; i >= 0; i--) {
        const r = rockets[i];
        if (r.exploded) {
          rockets.splice(i, 1);
          continue;
        }

        r.trail.push({ x: r.x, y: r.y });
        if (r.trail.length > 8) r.trail.shift();

        r.y += r.vy;
        r.vy += 0.2;

        r.trail.forEach((pt, idx) => {
          const alpha = idx / r.trail.length;
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, 2, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255,220,150,${alpha * 0.7})`;
          ctx.fill();
        });

        ctx.beginPath();
        ctx.arc(r.x, r.y, 3, 0, Math.PI * 2);
        ctx.fillStyle = "#fff";
        ctx.fill();

        if (r.y <= r.targetY || r.vy >= 0) {
          explode(r.x, r.y);
          r.exploded = true;
        }
      }

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += p.gravity;
        p.vx *= 0.98;
        p.alpha -= 0.018;

        if (p.alpha <= 0) {
          particles.splice(i, 1);
          continue;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle =
          p.color +
          Math.floor(p.alpha * 255)
            .toString(16)
            .padStart(2, "0");
        ctx.fill();
      }

      if (
        !activeRef.current &&
        particles.length === 0 &&
        rockets.length === 0
      ) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        return;
      }

      raf = requestAnimationFrame(animate);
    }

    raf = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(raf);
      clearInterval(interval);
      window.removeEventListener("resize", resize);
      audioCtxRef.current?.close();
      activeRef.current = false;
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-50 pointer-events-none"
    />
  );
}
