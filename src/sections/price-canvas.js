export function initPriceSectionCanvas() {
  const section = document.getElementById("price-register");
  const canvas = document.getElementById("price-canvas");
  if (!section || !canvas) return;
  const ctx = canvas.getContext("2d");
  let w = 0, h = 0;

  function resize() {
    w = canvas.width = section.offsetWidth;
    h = canvas.height = section.offsetHeight;
  }

  function draw(time) {
    ctx.clearRect(0, 0, w, h);

    // Генерируем 5-7 светящихся полос на разных высотах
    for (let i = 0; i < 7; i++) {
      let y = (h / 8) * (i + 1) + Math.sin(time / (1100 + i * 220)) * 10;
      let alpha = 0.13 + 0.11 * Math.abs(Math.sin(time / (600 + i * 80) + i));
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.shadowColor = "#15e6cb";
      ctx.shadowBlur = 18 + 6 * Math.sin(time / (900 + i * 50));
      let grad = ctx.createLinearGradient(0, y - 3, w, y + 3);
      grad.addColorStop(0, "#21d4fd44");
      grad.addColorStop(0.5, "#15e6cb");
      grad.addColorStop(1, "#21d4fd44");
      ctx.strokeStyle = grad;
      ctx.lineWidth = 18 + 8 * Math.abs(Math.cos(time / (1200 + i * 40) + i * 1.2));
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
      ctx.restore();
    }

    // Дополнительно можно добавить "глитч" вспышки
    for (let i = 0; i < 3; i++) {
      if (Math.random() > 0.96) {
        let y = Math.random() * h;
        ctx.save();
        ctx.globalAlpha = 0.3 + Math.random() * 0.1;
        ctx.shadowColor = "#21d4fd";
        ctx.shadowBlur = 30;
        ctx.strokeStyle = "#21d4fd";
        ctx.lineWidth = 10 + Math.random() * 10;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
        ctx.restore();
      }
    }

    requestAnimationFrame(draw);
  }

  window.addEventListener("resize", resize);
  setTimeout(resize, 200);
  requestAnimationFrame(draw);
}
