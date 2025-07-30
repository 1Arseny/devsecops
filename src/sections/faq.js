export function initFaqSectionCanvas() {
  // ---- Анимированный фон: сетка + круги ----
  const section = document.getElementById("faq");
  const canvas = document.getElementById("faq-canvas");
  if (!section || !canvas) return;
  const ctx = canvas.getContext("2d");
  let w = 0, h = 0;
  let circles = [];

  function resize() {
    w = canvas.width = section.offsetWidth;
    h = canvas.height = section.offsetHeight;
    circles = [
      { x: w*0.25, y: h*0.45, r: 120, color: "#21d4fd", alpha: 0.12, speed: 14500, phase: 0 },
      { x: w*0.8, y: h*0.3, r: 160, color: "#15e6cb", alpha: 0.09, speed: 17000, phase: 1.3 },
      { x: w*0.6, y: h*0.9, r: 180, color: "#ffe566", alpha: 0.08, speed: 22000, phase: 2.4 },
    ];
  }

  function draw(time) {
    ctx.clearRect(0,0,w,h);

    // сетка
    ctx.save();
    ctx.globalAlpha = 0.13;
    ctx.lineWidth = 1;
    ctx.strokeStyle = "#21d4fd";
    const step = 56;
    for(let y=0;y<h;y+=step){
      ctx.beginPath();
      ctx.moveTo(0,y+Math.sin(time/3000+y)*2);
      ctx.lineTo(w,y+Math.sin(time/3000+y)*2);
      ctx.stroke();
    }
    for(let x=0;x<w;x+=step){
      ctx.beginPath();
      ctx.moveTo(x+Math.cos(time/3500+x)*2,0);
      ctx.lineTo(x+Math.cos(time/3500+x)*2,h);
      ctx.stroke();
    }
    ctx.restore();

    // светящиеся круги
    circles.forEach(c => {
      let dynamicAlpha = c.alpha + 0.05 * Math.sin(time / c.speed + c.phase);
      let grad = ctx.createRadialGradient(c.x, c.y, 0, c.x, c.y, c.r);
      grad.addColorStop(0, c.color+"cc");
      grad.addColorStop(0.8, c.color+"00");
      ctx.save();
      ctx.globalAlpha = dynamicAlpha;
      ctx.beginPath();
      ctx.arc(c.x, c.y, c.r, 0, Math.PI*2);
      ctx.closePath();
      ctx.fillStyle = grad;
      ctx.shadowColor = c.color;
      ctx.shadowBlur = 54;
      ctx.fill();
      ctx.restore();
    });

    requestAnimationFrame(draw);
  }

  window.addEventListener("resize", resize);
  setTimeout(resize, 180);
  requestAnimationFrame(draw);

  // ---- Плавное появление карточек FAQ ----
  const cards = Array.from(section.querySelectorAll('.faq-card'));
  let shown = false;
  const observer = new window.IntersectionObserver(([entry]) => {
    if (entry.isIntersecting && !shown) {
      shown = true;
      cards.forEach((card, idx) => {
        setTimeout(() => {
          card.classList.remove('opacity-0', 'translate-y-8');
          card.classList.add('opacity-100', 'translate-y-0');
        }, idx * 220);
      });
      observer.disconnect();
    }
  }, { threshold: 0.14 });
  observer.observe(section);
}
