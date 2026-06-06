// src/components/dinamic.jsx
import React, { useEffect, useMemo, useState } from "react";
import { ImagenesAPI } from "../../services/PresentacionService.js";

/* ========= Helper URLs Google Drive ========= */
function getOptimizedUrl(originalUrl) {
  if (!originalUrl) return "";
  const driveMatch = originalUrl.match(
    /\/d\/([a-zA-Z0-9_-]+)|\?id=([a-zA-Z0-9_-]+)/
  );
  if (
    driveMatch &&
    (originalUrl.includes("drive.google.com") ||
      originalUrl.includes("docs.google.com"))
  ) {
    const fileId = driveMatch[1] || driveMatch[2];
    return `https://drive.google.com/thumbnail?id=${fileId}&sz=w1000`;
  }
  return originalUrl;
}

/* ========= Utilidad ========= */
function uniq(arr) {
  return [...new Set(arr.filter(Boolean))];
}

/* ========= Componente Principal SOLO VISUAL ========= */
export default function DynamicSlider({
  fullBleed = false,
  titleText = "Plan Risk 3D: Generación Automática de Modelos",
  height = "clamp(300px, 40vh, 550px)",
}) {
  const [presentaciones, setPresentaciones] = useState([]);

  const fetchPresentaciones = async () => {
    try {
      const data = await ImagenesAPI.list();
      if (Array.isArray(data) && data.length > 0) {
        setPresentaciones(data);
      } else {
        setPresentaciones([
          { url: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=1000&q=80", estado: true },
          { url: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1000&q=80", estado: true },
          { url: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1000&q=80", estado: true }
        ]);
      }
    } catch (e) {
      console.error(e);
      setPresentaciones([
        { url: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=1000&q=80", estado: true },
        { url: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1000&q=80", estado: true },
        { url: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1000&q=80", estado: true }
      ]);
    }
  };

  useEffect(() => {
    fetchPresentaciones();
  }, []);

  function isActive(val) {
    return val === true || val === "true" || val === 1;
  }

  const sources = useMemo(
    () =>
      uniq(
        presentaciones
          .filter((it) => isActive(it.estado))
          .map((img) => getOptimizedUrl(img.url || ""))
      ),
    [presentaciones]
  );

  const css = `
    .fs-wrap { 
      width: 100%; 
      position: relative; 
      background: radial-gradient(circle at top left, #1e293b 0, #020617 52%, #020617 100%);
      border-radius: 0;
      border: 1px solid rgba(15, 23, 42, 0.9);
      box-shadow: 0 22px 55px rgba(0,0,0,0.85); 
      padding: 12px 0; 
      overflow: hidden; 
      min-height: var(--fs-height, 350px);
      display: flex;
      flex-direction: column;
      justify-content: center;
    }
    .fs-wrap.full-bleed { 
      width: 100vw; 
      left: 50%; 
      right: 50%; 
      margin-left: -50vw; 
      margin-right: -50vw; 
      border-radius: 0; 
    }
    
    .hero-center { 
      position: absolute; 
      inset: 0; 
      z-index: 10; 
      display: grid; 
      place-items: center; 
      pointer-events: none; 
      padding: 1.5rem; 
    }

    .hero-title { 
      color: #f9fafb; 
      font-weight: 800; 
      text-transform: uppercase; 
      text-align: center; 
      /* Tamaño base para escritorio */
      font-size: clamp(2.5rem, 6vw, 5rem); 
      line-height: 1.1; 
      letter-spacing: 1px;
      text-shadow: 0 4px 20px rgba(0, 0, 0, 0.9);
      overflow-wrap: break-word;
      word-wrap: break-word;
      max-width: 95%; 
    }

    /* ===== AJUSTES PARA MÓVILES ===== */
    @media (max-width: 768px) {
      .fs-wrap {
        min-height: 220px !important; /* Un poco más de altura en móvil para el texto grande */
        padding: 4px 0;
      }
      .hero-title {
        /* CAMBIO CLAVE: Tamaño mucho más grande en móvil */
        /* Mínimo 2rem, crece rápido con 11vw, hasta un máximo de 3.8rem */
        font-size: clamp(2rem, 11vw, 3.8rem);
        letter-spacing: 0.5px;
        line-height: 1.05; /* Interlineado más ajustado para que no ocupe tanto verticalmente */
      }
    }
    
    @media (max-width: 480px) {
      .fs-wrap {
        min-height: 180px !important;
      }
      /* Ajuste fino para pantallas muy pequeñas */
      .hero-title {
         font-size: clamp(1.8rem, 10vw, 3rem);
      }
    }
  `;

  return (
    <>
      <style>{css}</style>
      <section
        className={`fs-wrap ${fullBleed ? "full-bleed" : ""}`}
        style={{ "--fs-height": height }}
      >
        <div className="hero-center">
          <h1 className="hero-title">{titleText}</h1>
        </div>

        {sources.length > 0 && (
          <FilmstripOneRow sources={sources} />
        )}
      </section>
    </>
  );
}

/* ========= Carrusel de Rueda Infinita ========= */
function FilmstripOneRow({ sources }) {
  const [shouldAnimate, setShouldAnimate] = useState(false);
  const containerRef = React.useRef(null);
  const trackRef = React.useRef(null);

  const displayItems = [...sources, ...sources];
  const animationDuration = Math.max(sources.length * 10, 60);

  useEffect(() => {
    const checkShouldAnimate = () => {
      if (!containerRef.current || !trackRef.current) return;
      const isMobile = window.innerWidth < 768;
      if (isMobile) {
        setShouldAnimate(sources.length > 2);
      } else {
        const containerWidth = containerRef.current.offsetWidth;
        const trackWidth = trackRef.current.scrollWidth;
        setShouldAnimate(trackWidth > containerWidth);
      }
    };

    const initialCheck = setTimeout(() => {
      checkShouldAnimate();
    }, 100);

    const resizeObserver = new ResizeObserver(checkShouldAnimate);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }
    window.addEventListener('resize', checkShouldAnimate);

    return () => {
      clearTimeout(initialCheck);
      resizeObserver.disconnect();
      window.removeEventListener('resize', checkShouldAnimate);
    };
  }, [sources.length]);

  const cssAnim = `
    @keyframes marquee {
      0% { transform: translateX(0%); }
      100% { transform: translateX(-50%); }
    }
    @keyframes film-img-breath {
      0% { filter: saturate(1) brightness(1); opacity: 0.5; }
      50% { filter: saturate(1.08) brightness(1.05); opacity: 0.75; }
      100% { filter: saturate(1.03) brightness(1.02); opacity: 0.5; }
    }
    @keyframes film-sheen {
      0% { transform: translateX(-30%); opacity: 0; }
      20% { opacity: 0.25; }
      50% { opacity: 0.12; }
      100% { transform: translateX(130%); opacity: 0; }
    }

    .filmstrip-container {
      position: relative;
      display: flex; 
      overflow: hidden; 
      user-select: none; 
      width: 100%;
      height: 100%;
      align-items: center; 
      padding: 0 16px 12px;
      box-sizing: border-box;
      mask-image: linear-gradient(to right, transparent, black 15%, black 85%, transparent);
      -webkit-mask-image: linear-gradient(to right, transparent, black 15%, black 85%, transparent);
    }

    .filmstrip-container::before {
      content: "";
      position: absolute;
      inset: 0;
      background: linear-gradient(120deg, transparent 0%, rgba(248, 250, 252, 0.7) 40%, rgba(148, 163, 184, 0.25) 60%, transparent 100%);
      pointer-events: none;
      mix-blend-mode: screen;
      opacity: 0;
      animation: film-sheen 11s linear infinite;
    }

    .filmstrip-container.static {
      justify-content: center;
    }

    .marquee-track {
      display: flex; 
      gap: 16px; 
      width: max-content;
      ${shouldAnimate ? `animation: marquee ${animationDuration}s linear infinite;` : ''}
      ${shouldAnimate ? 'will-change: transform;' : ''}
    }

    .film-img {
      height: calc(var(--fs-height, 350px) - 60px);
      width: auto;
      min-width: 300px;
      max-width: 500px;
      border-radius: 14px;
      object-fit: cover;
      box-shadow: 0 10px 24px rgba(15, 23, 42, 0.5);
      opacity: 0.5; 
      transition: opacity 0.3s, transform 0.3s, box-shadow 0.3s, filter 0.3s;
      border: 1px solid rgba(148, 163, 184, 0.3);
      background: #020617;
      animation: film-img-breath 9s ease-in-out infinite;
      flex-shrink: 0;
    }

    .film-img:hover {
        opacity: 0.9;
        transform: scale(1.02);
        z-index: 15;
    }

    @media (max-width: 768px) {
      .film-img {
        height: calc(var(--fs-height, 220px) - 20px); /* Ajustado a la nueva altura mínima */
        min-width: auto;
        border-radius: 6px;
      }
      .filmstrip-container {
        padding: 0 4px 4px;
      }
      .marquee-track {
        gap: 6px;
      }
    }
  `;

  return (
    <div ref={containerRef} className={`filmstrip-container ${!shouldAnimate ? 'static' : ''}`}>
      <style>{cssAnim}</style>
      <div ref={trackRef} className="marquee-track">
        {displayItems.map((src, i) => (
          <img
            key={`${src}-${i}`}
            src={src}
            className="film-img"
            alt={`slide-${i}`}
            onError={(e) => (e.target.style.display = "none")}
          />
        ))}
      </div>
    </div>
  );
}