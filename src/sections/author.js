export function initAuthorSection(){
    const cards = document.querySelectorAll('.author-card');
  if (!cards.length) return;
  let shown = false;
  const observer = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting && !shown) {
      shown = true;
      cards.forEach((card, idx) => {
        setTimeout(() => {
          card.classList.remove('opacity-0', 'translate-y-10');
          card.classList.add('opacity-100', 'translate-y-0');
        }, idx * 200);
      });
    }
  }, { threshold: 0.23 });
  observer.observe(cards[0]);

  const section = document.getElementById("authors");
  const canvas = document.getElementById("authors-canvas");
  if (!section || !canvas) return;

  const ctx = canvas.getContext("2d");
  let animationFrameId;

  // Для связи — найдём центры карточек авторов
  let authorCards = [];
  function updateAuthorCards() {
    authorCards = Array.from(section.querySelectorAll('.author-card'));
  }

  function resizeCanvas() {
    canvas.width = section.offsetWidth;
    canvas.height = section.offsetHeight;
    updateAuthorCards();
  }

  // Анимация точек (для живости)
  const points = [];
  const POINTS_X = 11, POINTS_Y = 6;
  function initPoints() {
    points.length = 0;
    for (let x = 0; x < POINTS_X; x++) {
      for (let y = 0; y < POINTS_Y; y++) {
        points.push({
          baseX: x/(POINTS_X-1),
          baseY: y/(POINTS_Y-1),
          angle: Math.random()*Math.PI*2,
          speed: 0.6 + Math.random()*0.8,
          radius: 7+Math.random()*7
        });
      }
    }
  }

  function drawGrid(time) {
    // Мягкая сетка (живые точки)
    const w = canvas.width, h = canvas.height;
    for (let p of points) {
      const dx = Math.cos(p.angle + time/2500*p.speed) * p.radius;
      const dy = Math.sin(p.angle + time/2400*p.speed) * p.radius;
      p.x = p.baseX * w + dx;
      p.y = p.baseY * h + dy;
    }
    // Вертикальные линии
    for (let x = 0; x < POINTS_X; x++) {
      ctx.beginPath();
      for (let y = 0; y < POINTS_Y; y++) {
        const i = x*POINTS_Y+y;
        if (y===0) ctx.moveTo(points[i].x, points[i].y);
        else ctx.lineTo(points[i].x, points[i].y);
      }
      ctx.strokeStyle = "rgba(99,102,241,0.11)";
      ctx.lineWidth = 1;
      ctx.stroke();
    }
    // Горизонтальные линии
    for (let y = 0; y < POINTS_Y; y++) {
      ctx.beginPath();
      for (let x = 0; x < POINTS_X; x++) {
        const i = x*POINTS_Y+y;
        if (x===0) ctx.moveTo(points[i].x, points[i].y);
        else ctx.lineTo(points[i].x, points[i].y);
      }
      ctx.strokeStyle = "rgba(99,102,241,0.09)";
      ctx.lineWidth = 1;
      ctx.stroke();
    }
    // Точки
    for (let p of points) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, 2, 0, Math.PI*2);
      ctx.fillStyle = "rgba(99,102,241,0.20)";
      ctx.shadowColor = "#6366f1";
      ctx.shadowBlur = 3;
      ctx.fill();
      ctx.shadowBlur = 0;
    }
  }

  function drawLinks() {
    // Связи между центрами карточек
    if (authorCards.length < 2) return;
    const sectionRect = section.getBoundingClientRect();
    const centers = authorCards.map(card => {
      const r = card.getBoundingClientRect();
      return {
        x: r.left + r.width/2 - sectionRect.left,
        y: r.top + r.height/2 - sectionRect.top
      };
    });
    // Все-всем (треугольник)
    for (let i=0; i<centers.length; ++i)
      for (let j=i+1; j<centers.length; ++j) {
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(centers[i].x, centers[i].y);
        ctx.lineTo(centers[j].x, centers[j].y);
        ctx.strokeStyle = "rgba(99,102,241,0.16)";
        ctx.lineWidth = 2.4;
        ctx.shadowColor = "#6366f1";
        ctx.shadowBlur = 8;
        ctx.globalAlpha = 0.9;
        ctx.stroke();
        ctx.restore();
      }
  }

  function animate(time) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawGrid(time);
    drawLinks();
    animationFrameId = requestAnimationFrame(animate);
  }

  window.addEventListener("resize", () => {
    resizeCanvas();
  });

  // Первичный запуск
  setTimeout(() => {
    resizeCanvas();
    initPoints();
    animate(performance.now());
  }, 250);
}