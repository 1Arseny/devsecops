export function initwhycourseAnimation() {
  const section = document.getElementById("why-course");
  const canvas = document.getElementById("whycourse-canvas");
  if (!section || !canvas) return;
  const ctx = canvas.getContext("2d");

  let animationFrameId;
  let active = false;

  // Grid parameters
  const GRID_SIZE = 60;
  let cols, rows, gridPoints = [];

  // Animated points
  const FLOATERS_NUM = 18;
  let floaters = [];

  // Mouse
  let mouse = { x: 0, y: 0, active: false };

  function resizeCanvas() {
    canvas.width = section.offsetWidth;
    canvas.height = section.offsetHeight;

    // Пересчитываем сетку
    cols = Math.floor(canvas.width / GRID_SIZE) + 1;
    rows = Math.floor(canvas.height / GRID_SIZE) + 1;
    gridPoints = [];
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        gridPoints.push({
          x: x * GRID_SIZE,
          y: y * GRID_SIZE
        });
      }
    }
  }

  function initFloaters() {
    floaters = [];
    for (let i = 0; i < FLOATERS_NUM; i++) {
      // Случайная пара соседних узлов сетки
      let p1 = gridPoints[Math.floor(Math.random() * gridPoints.length)];
      let neighbors = gridPoints.filter(
        pt => Math.abs(pt.x - p1.x) + Math.abs(pt.y - p1.y) === GRID_SIZE
      );
      let p2 = neighbors[Math.floor(Math.random() * neighbors.length)];
      floaters.push({
        t: Math.random(),
        speed: 0.005 + Math.random() * 0.002,
        p1,
        p2,
        radius: 5 + Math.random() * 3,
      });
    }
  }

  function drawGrid() {
    ctx.save();
    ctx.globalAlpha = 0.18;
    ctx.strokeStyle = '#6c7fc3';
    for (let y = 0; y < rows; y++) {
      ctx.beginPath();
      ctx.moveTo(0, y * GRID_SIZE);
      ctx.lineTo(canvas.width, y * GRID_SIZE);
      ctx.stroke();
    }
    for (let x = 0; x < cols; x++) {
      ctx.beginPath();
      ctx.moveTo(x * GRID_SIZE, 0);
      ctx.lineTo(x * GRID_SIZE, canvas.height);
      ctx.stroke();
    }
    ctx.restore();
  }

  function drawSquares() {
    ctx.save();
    for (const pt of gridPoints) {
      ctx.beginPath();
      ctx.rect(pt.x - 4, pt.y - 4, 8, 8);
      ctx.fillStyle = "#334155";
      ctx.globalAlpha = 0.8;
      ctx.shadowColor = "#6366f1";
      ctx.shadowBlur = 4;
      ctx.fill();
    }
    ctx.shadowBlur = 0;
    ctx.globalAlpha = 1;
    ctx.restore();
  }

  function drawFloaters() {
    for (const floater of floaters) {
      // Интерполяция между p1 и p2 по параметру t
      let x = floater.p1.x * (1 - floater.t) + floater.p2.x * floater.t;
      let y = floater.p1.y * (1 - floater.t) + floater.p2.y * floater.t;

      // Реакция на курсор: если мышка рядом, floater "смотрит" в её сторону
      if (mouse.active) {
        const dx = mouse.x - x;
        const dy = mouse.y - y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if (dist < 120) {
          x += dx * 0.10 * (1 - dist/120);
          y += dy * 0.10 * (1 - dist/120);
        }
      }

      // Отрисовка точки
      ctx.beginPath();
      ctx.arc(x, y, floater.radius, 0, 2 * Math.PI);
      ctx.fillStyle = "#6366f1";
      ctx.globalAlpha = 0.85;
      ctx.shadowColor = "#6366f1";
      ctx.shadowBlur = 18;
      ctx.fill();
      ctx.shadowBlur = 0;
      ctx.globalAlpha = 1;
    }
  }

  function updateFloaters() {
    for (const floater of floaters) {
      floater.t += floater.speed;
      if (floater.t > 1) {
        floater.t = 0;

        // Перевыбираем новую пару соседей
        let p1 = gridPoints[Math.floor(Math.random() * gridPoints.length)];
        let neighbors = gridPoints.filter(
          pt => Math.abs(pt.x - p1.x) + Math.abs(pt.y - p1.y) === GRID_SIZE
        );
        floater.p1 = p1;
        floater.p2 = neighbors[Math.floor(Math.random() * neighbors.length)];
      }
    }
  }

  function animate() {
    if (!active) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawGrid();
    drawSquares();
    drawFloaters();
    updateFloaters();

    animationFrameId = requestAnimationFrame(animate);
  }

  // Intersection Observer — запускать анимацию только если секция на экране
  const observer = new window.IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        active = true;
        resizeCanvas();
        initFloaters();
        animate();
      } else {
        active = false;
        cancelAnimationFrame(animationFrameId);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    },
    { threshold: 0.25 }
  );
  observer.observe(section);

  window.addEventListener("resize", () => {
    resizeCanvas();
    if (active) {
      initFloaters();
      animate();
    }
  });

  canvas.addEventListener("mousemove", (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
    mouse.active = true;
  });
  canvas.addEventListener("mouseleave", () => {
    mouse.active = false;
  });

  // инициализация при старте
  resizeCanvas();
  initFloaters();
}
