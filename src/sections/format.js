export function initLearningFormatSection() {
  // ---- Терминальный вывод ----
  const section = document.getElementById("learning-format");
  if (!section) return;

  const output = section.querySelector('#terminal-lines');
  if (!output) return;

  // Тексты из раздела «Формат и организация»
  const steps = [
    '[✓] Онлайн-формат, материалы доступны 24/7',
    '[✓] Живые сессии + видео в записи',
    '[✓] Практика в каждом модуле',
    '[✓] Финальный экзамен: автоматизированное тестирование в духе OSCP',
    '[✓] Поддержка преподавателей и закрытое сообщество выпускников',
    '$ _'
  ];

  let shown = false;
  const observer = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting && !shown) {
      shown = true;
      printNextLine();
      observer.disconnect();
    }
  }, { threshold: 0.15 });
  observer.observe(section);

  // Печатаем строку посимвольно, затем переходим к следующей
  function typeLine(text, span, i = 0) {
    if (i > text.length) return Promise.resolve();
    span.textContent = text.slice(0, i);
    return new Promise(res => setTimeout(res, 14)).then(() => typeLine(text, span, i + 1));
  }

  async function printNextLine(idx = 0) {
    if (idx >= steps.length) return;
    const span = document.createElement('span');
    span.style.display = 'block';
    span.style.opacity = '0';
    output.appendChild(span);

    // плавное появление строки
    requestAnimationFrame(() => {
      span.style.transition = 'opacity .35s ease';
      span.style.opacity = '1';
    });

    await typeLine(steps[idx], span);
    setTimeout(() => printNextLine(idx + 1), 180);
  }

  // ---- Анимированный фон (канвас) ----
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
    for (let i = 0; i < 3; i++) {
      ctx.save();
      const y = (h / 4) + (i * h / 5) + Math.sin(time / 900 + i) * 18;
      ctx.globalAlpha = 0.08 + 0.05 * Math.sin(time / 600 + i * 2.2);
      ctx.fillStyle = '#21f1cf';
      ctx.shadowColor = '#23f9e7';
      ctx.shadowBlur = 20;
      ctx.fillRect(0, y, w, 9 + Math.sin(time / 1200 + i) * 5);
      ctx.restore();
    }
    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', resize);
  setTimeout(resize, 80);
  requestAnimationFrame(draw);
}
