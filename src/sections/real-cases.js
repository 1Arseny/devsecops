export function initRealcasesSection() {
  const section = document.getElementById("real-cases");
  if (!section) return;
  const cards = Array.from(section.querySelectorAll('.case-card'));
  if (!cards.length) return;

  // Для водоворота (по кругу)
  const angles = [-18, 0, 18]; // разные углы
  const delays = [0, 180, 370];

  // Если больше карточек:
  // const angles = [-22, -7, 8, 23, 0];
  // const delays = [0, 140, 280, 410, 560];

  // Сначала все в скрытом состоянии
  cards.forEach((card, idx) => {
    card.classList.remove('vortex-show', 'opacity-100', 'translate-y-0');
    card.classList.add('vortex-hide');
    card.style.transform = `scale(0.8) rotate(${angles[idx] || 0}deg) translateY(40px)`;
  });

  let shown = false;
  const observer = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting && !shown) {
      shown = true;
      cards.forEach((card, idx) => {
        setTimeout(() => {
          card.classList.remove('vortex-hide', 'opacity-0', 'translate-y-10');
          card.classList.add('vortex-show', 'opacity-100', 'translate-y-0');
          card.style.transform = ''; // сброс transform, теперь по классу
        }, delays[idx]);
      });
      observer.disconnect();
    }
  }, { threshold: 0.16 });
  observer.observe(section);
}
