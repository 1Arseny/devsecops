export function initSkillsCanvasAnimation() {
  const section = document.getElementById("skills-results");
  const canvas = document.getElementById("skills-canvas");
  if (!section || !canvas) return;

  const ctx = canvas.getContext("2d");
  let animationFrameId;
  let cssW = 0, cssH = 0, dpr = Math.max(1, window.devicePixelRatio || 1);

  // --- Размер canvas больше секции (ретина) ---
  function resizeCanvas() {
    cssW = section.offsetWidth * 1.3;
    cssH = section.offsetHeight * 1.3;

    canvas.width = Math.floor(cssW * dpr);
    canvas.height = Math.floor(cssH * dpr);

    // Рисуем в "CSS пикселях"
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // CSS-размер и позиция, чтобы центр совпадал
    canvas.style.width = '130%';
    canvas.style.height = '130%';
    canvas.style.left = '-15%';
    canvas.style.top = '-15%';

    updateBlocks();
  }

  // --- Карточки для beam-эффекта ---
  let leftCard, rightCard, singleCard;
  function updateBlocks() {
    // экранированные селекторы: .bg-\[\#1e293b\], .bg-\[\#0f172a\]
    const cards = section.querySelectorAll('.bg-\\[\\#1e293b\\], .bg-\\[\\#0f172a\\]');
    if (cards.length >= 2) {
      leftCard = cards[0];
      rightCard = cards[1];
      singleCard = null;
    } else {
      leftCard = rightCard = null;
      singleCard = cards[0] || null;
    }
  }

  // --- Градиент фона ---
  function drawBackgroundGradient() {
    const cx = cssW / 2, cy = cssH / 2;
    const grad = ctx.createRadialGradient(cx, cy, cssH / 6, cx, cy, cssH / 1.05);
    grad.addColorStop(0, "rgba(99,102,241,0.18)");
    grad.addColorStop(0.45, "rgba(31,41,55,0.14)");
    grad.addColorStop(1, "rgba(17,24,39,0.96)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, cssW, cssH);
  }

  // --- Вспомогательное: центр блока в координатах canvas ---
  function getCenter(el) {
    const rect = el.getBoundingClientRect();
    const srect = section.getBoundingClientRect();
    // Смещение canvas относительно секции: по 15% по обеим осям
    const offsetX = (cssW - section.offsetWidth) / 2;
    const offsetY = (cssH - section.offsetHeight) / 2;
    const x = (rect.left - srect.left) + rect.width / 2 + offsetX;
    const y = (rect.top - srect.top) + rect.height / 2 + offsetY;
    return { x, y, rect };
  }

  // --- Анимация лучей: 2 карточки ---
  function drawBeamsBetween(time) {
    const { x: lcx, y: lcy } = getCenter(leftCard);
    const { x: rcx, y: rcy } = getCenter(rightCard);

    for (let i = 0; i < 6; i++) {
      const phase = time / 600 + i * 1.1;
      const t = (Math.sin(phase) + 1) / 2;
      const mx = lcx * (1 - t) + rcx * t + Math.sin(time / 1000 + i) * 38;
      const my = lcy * (1 - t) + rcy * t + Math.cos(time / 1100 + i) * 38;

      ctx.save();
      ctx.beginPath();
      ctx.moveTo(lcx, lcy);
      ctx.quadraticCurveTo(mx, my, rcx, rcy);
      ctx.strokeStyle = `rgba(${Math.floor(99 + 90 * t)},${Math.floor(102 + 60 * (1 - t))},241,${0.16 + 0.12 * Math.abs(Math.cos(phase))})`;
      ctx.lineWidth = 7 - 3 * Math.abs(0.5 - t);
      ctx.shadowColor = "#6366f1";
      ctx.shadowBlur = 22;
      ctx.globalAlpha = 0.93;
      ctx.stroke();
      ctx.restore();
    }
  }

  // --- Анимация лучей: 1 карточка ---
  function drawBeamsAround(time) {
    if (!singleCard) return;
    const { x: cx, y: cy, rect } = getCenter(singleCard);

    // Пульсирующее сияние
    const pulse = 0.55 + 0.1 * Math.sin(time / 900);
    const rad = Math.max(rect.width, rect.height) * 0.7;

    const g = ctx.createRadialGradient(cx, cy, rad * 0.2, cx, cy, rad * 1.6);
    g.addColorStop(0, `rgba(99,102,241,${0.22 * pulse})`);
    g.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(cx, cy, rad * 1.6, 0, Math.PI * 2);
    ctx.fill();

    // Вихревые кривые, исходящие от окружности карточки
    const beams = 7;
    for (let i = 0; i < beams; i++) {
      const a0 = (i / beams) * Math.PI * 2 + time / 1800;
      const a1 = a0 + Math.sin(time / 1200 + i) * 0.7;

      const r0 = rad * (0.9 + 0.08 * Math.sin(time / 700 + i));
      const r1 = rad * (1.4 + 0.12 * Math.cos(time / 1000 + i));

      const x0 = cx + Math.cos(a0) * r0;
      const y0 = cy + Math.sin(a0) * r0;

      const mx = cx + Math.cos((a0 + a1) / 2) * (r0 + r1) * 0.45 + Math.sin(time / 800 + i) * 14;
      const my = cy + Math.sin((a0 + a1) / 2) * (r0 + r1) * 0.45 + Math.cos(time / 900 + i) * 14;

      const x1 = cx + Math.cos(a1) * r1;
      const y1 = cy + Math.sin(a1) * r1;

      ctx.save();
      ctx.beginPath();
      ctx.moveTo(x0, y0);
      ctx.quadraticCurveTo(mx, my, x1, y1);
      const t = (Math.sin(time / 600 + i) + 1) / 2;
      ctx.strokeStyle = `rgba(${Math.floor(120 + 60 * t)},${Math.floor(130 + 40 * (1 - t))},255,${0.14 + 0.12 * t})`;
      ctx.lineWidth = 3.5 + 1.8 * Math.abs(Math.sin(time / 900 + i));
      ctx.shadowColor = "#6366f1";
      ctx.shadowBlur = 18;
      ctx.globalAlpha = 0.95;
      ctx.stroke();
      ctx.restore();
    }
  }

  // --- Анимационный цикл ---
  function animate(time) {
    ctx.clearRect(0, 0, cssW, cssH);
    drawBackgroundGradient();
    if (leftCard && rightCard) {
      drawBeamsBetween(time);
    } else {
      drawBeamsAround(time);
    }
    animationFrameId = requestAnimationFrame(animate);
  }

  // --- Resize / Init ---
  function start() {
    if (!animationFrameId) {
      animate(performance.now());
    }
  }
  function stop() {
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = null;
    }
  }

  window.addEventListener("resize", () => {
    resizeCanvas();
    start();
  }, { passive: true });

  // Старт с небольшой задержкой, чтобы layout устаканился
  setTimeout(() => {
    resizeCanvas();
    start();
  }, 200);

  // Остановка, если секция скрыта
  const visHandler = () => (document.hidden ? stop() : start());
  document.addEventListener('visibilitychange', visHandler);

  // --- Появление пунктов списка (только skills) ---
  const skillsList = section.querySelector('.skills-list');
  function showListItems(list) {
    if (!list) return;
    const items = Array.from(list.querySelectorAll('li'));
    items.forEach((li, idx) => {
      setTimeout(() => {
        li.classList.remove('opacity-0', 'translate-y-6');
        li.classList.add('opacity-100', 'translate-y-0');
      }, idx * 160);
    });
  }

  let shown = false;
  const observer = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting && !shown) {
      shown = true;
      showListItems(skillsList);
      observer.disconnect();
    }
  }, { threshold: 0.22 });

  observer.observe(section);

  // Очистка (если понадобится вызывать повторно)
  return () => {
    stop();
    document.removeEventListener('visibilitychange', visHandler);
    observer.disconnect();
  };
}
