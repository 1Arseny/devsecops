export function animateHeroSection() {
  const canvas = document.getElementById('devsecops-canvas');
  const ctx = canvas?.getContext('2d');

  if (!canvas || !ctx) return;

  // 📐 Setup
  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const pointCount = 60;
  const points = Array.from({ length: pointCount }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    dx: (Math.random() - 0.5) * 0.3,
    dy: (Math.random() - 0.5) * 0.3,
    baseRadius: 2 + Math.random() * 1.5,
    pulseOffset: Math.random() * 100,
  }));

  let mouse = { x: -1000, y: -1000 };
  let scrollSpeedBoost = 0;

  // 🖱 Наведение мыши
  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  // 📜 Scroll boost
  window.addEventListener('scroll', () => {
    scrollSpeedBoost = 2;
  });
  
  function animate(t = 0) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < pointCount; i++) {
      const p = points[i];
      const distToMouse = Math.hypot(p.x - mouse.x, p.y - mouse.y);
      const nearMouse = distToMouse < 100;

      // 💓 Плавная синусоидальная пульсация
      const pulse = Math.sin((t + p.pulseOffset) / 150) * 1.5;

      const radius = p.baseRadius + (nearMouse ? 2 : 0) + pulse;

      // 🌟 Точка
      ctx.beginPath();
      ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
      ctx.fillStyle = nearMouse ? 'rgba(255,255,255,0.95)' : 'rgba(170,200,230,0.9)';
      ctx.shadowColor = 'rgba(199,210,254,0.5)';
      ctx.shadowBlur = 5;
      ctx.fill();
      ctx.shadowBlur = 0;

      // 🔗 Линии
      for (let j = i + 1; j < pointCount; j++) {
        const q = points[j];
        const dist = Math.hypot(p.x - q.x, p.y - q.y);
        if (dist < 140) {
          ctx.strokeStyle = `rgba(255, 255, 255, ${1 - dist / 140})`;
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.stroke();
        }
      }

      // ⚙️ Движение + scroll-ускорение
      const speedFactor = 1 + scrollSpeedBoost;
      p.x += p.dx * speedFactor;
      p.y += p.dy * speedFactor;

      // отскок от границ
      if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
    }

    // ⏬ Плавно убавляем scroll boost
    scrollSpeedBoost *= 0.95;

    requestAnimationFrame(animate);
  }

  animate();
}
