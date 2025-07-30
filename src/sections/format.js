export function initLearningFormatSection() {
  // ---- Терминальный вывод ----
  const section = document.getElementById("learning-format");
  if (!section) return;

  const output = section.querySelector('#terminal-lines');
  if (!output) return;

  const steps = [
    '[+] Доступ к видео, практике и материалам',
    '[+] Автоматическая проверка заданий',
    '[+] Финальный экзамен в стиле OSCP',
    '[+] Поддержка от экспертов и выпускников',
    '$ _'
  ];

  let shown = false;
  const observer = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting && !shown) {
      shown = true;
      printLines();
      observer.disconnect();
    }
  }, { threshold: 0.15 });
  observer.observe(section);

  function printLines(idx = 0) {
    if (idx >= steps.length) return;
    const span = document.createElement('span');
    span.style.opacity = '0';
    span.style.display = 'block';
    span.textContent = steps[idx];
    output.appendChild(span);
    setTimeout(() => {
      span.style.transition = 'opacity 0.4s';
      span.style.opacity = '1';
      setTimeout(() => printLines(idx + 1), 420);
    }, 120);
  }

  const canvas = document.getElementById('learning-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let w = 0, h = 0;

  function resize() {
    w = canvas.width = section.offsetWidth;
    h = canvas.height = section.offsetHeight;
  }

  function draw(time) {
    ctx.clearRect(0, 0, w, h);
    for(let i=0;i<3;i++) {
      ctx.save();
      let y = (h/4) + (i*h/5) + Math.sin(time/900+i)*18;
      ctx.globalAlpha = 0.08 + 0.05*Math.sin(time/600+i*2.2);
      ctx.fillStyle = '#21f1cf';
      ctx.shadowColor = '#23f9e7';
      ctx.shadowBlur = 20;
      ctx.fillRect(0, y, w, 9 + Math.sin(time/1200+i)*5);
      ctx.restore();
    }
    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', resize);
  setTimeout(resize, 80);
  requestAnimationFrame(draw);
}
