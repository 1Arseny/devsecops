export function initSkillsCanvasAnimation() {
  const section = document.getElementById("skills-results");
  const canvas = document.getElementById("skills-canvas");
  if (!section || !canvas) return;

  const ctx = canvas.getContext("2d");
  let animationFrameId;

  // --- Размер canvas больше секции ---
  function resizeCanvas() {
    // Canvas будет на 30% шире и выше секции
    canvas.width = section.offsetWidth * 1.3;
    canvas.height = section.offsetHeight * 1.3;
    canvas.style.width = '130%';
    canvas.style.height = '130%';
    canvas.style.left = '-15%';
    canvas.style.top = '-15%';
    updateBlocks();
  }

  // --- Карточки для beam-эффекта ---
  let leftCard, rightCard;
  function updateBlocks() {
    // ! Обязательно две карточки в grid!
    leftCard = section.querySelector('div > div:first-child');
    rightCard = section.querySelector('div > div:last-child');
  }

  // --- Glow Gradient ---
  function drawBackgroundGradient() {
    const cx = canvas.width / 2, cy = canvas.height / 2;
    const grad = ctx.createRadialGradient(
      cx, cy, canvas.height/5,
      cx, cy, canvas.height/1.1
    );
    grad.addColorStop(0, "rgba(99,102,241,0.19)");
    grad.addColorStop(0.4, "rgba(31,41,55,0.14)");
    grad.addColorStop(1, "rgba(17,24,39,0.96)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  // --- Анимация лучей ---
  function drawBeams(time) {
    if (!leftCard || !rightCard) return;
    const leftRect = leftCard.getBoundingClientRect();
    const rightRect = rightCard.getBoundingClientRect();
    const sectionRect = section.getBoundingClientRect();

    // координаты центра карточек относительно canvas
    const cx = canvas.width / 2 - section.offsetLeft;
    const cy = canvas.height / 2 - section.offsetTop;
    const lcx = leftRect.left + leftRect.width / 2 - sectionRect.left + (canvas.width - section.offsetWidth) / 2;
    const lcy = leftRect.top + leftRect.height / 2 - sectionRect.top + (canvas.height - section.offsetHeight) / 2;
    const rcx = rightRect.left + rightRect.width / 2 - sectionRect.left + (canvas.width - section.offsetWidth) / 2;
    const rcy = rightRect.top + rightRect.height / 2 - sectionRect.top + (canvas.height - section.offsetHeight) / 2;

    // 6 анимированных лучей
    for (let i = 0; i < 6; i++) {
      const phase = time / 600 + i * 1.1;
      const t = (Math.sin(phase) + 1) / 2;
      // Смещение увеличено: *38 для заметного эффекта
      const mx = lcx * (1 - t) + rcx * t + Math.sin(time / 1000 + i) * 38;
      const my = lcy * (1 - t) + rcy * t + Math.cos(time / 1100 + i) * 38;

      ctx.save();
      ctx.beginPath();
      ctx.moveTo(lcx, lcy);
      ctx.quadraticCurveTo(mx, my, rcx, rcy);
      ctx.strokeStyle = `rgba(${99 + 90 * t},${102 + 60 * (1 - t)},241,${0.16 + 0.12 * Math.abs(Math.cos(phase))})`;
      ctx.lineWidth = 7 - 3 * Math.abs(0.5 - t);
      ctx.shadowColor = "#6366f1";
      ctx.shadowBlur = 22;
      ctx.globalAlpha = 0.93;
      ctx.stroke();
      ctx.restore();
    }
  }

  // --- Анимация фрейма ---
  function animate(time) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBackgroundGradient();
    drawBeams(time);
    animationFrameId = requestAnimationFrame(animate);
  }

  // --- Resize / Init ---
  window.addEventListener("resize", () => {
    resizeCanvas();
    if (!animationFrameId) animate(performance.now());
  });

  setTimeout(() => {
    resizeCanvas();
    animate(performance.now());
  }, 300);

  // --- Анимация появления строк (skills/results) ---
  const lists = [
    ...section.querySelectorAll('.skills-list'),
    ...section.querySelectorAll('.results-list')
  ];

  function showListItems(list) {
    const items = Array.from(list.querySelectorAll('li'));
    items.forEach((li, idx) => {
      setTimeout(() => {
        li.classList.remove('opacity-0', 'translate-y-6');
        li.classList.add('opacity-100', 'translate-y-0');
      }, idx * 180);
    });
  }

  let shown = false;
  const observer = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting && !shown) {
      shown = true;
      lists.forEach(showListItems);
      observer.disconnect();
    }
  }, { threshold: 0.22 });

  observer.observe(section);
}
