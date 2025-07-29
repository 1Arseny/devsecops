export function initrofileresultSection(){
     // Анимация поочерёдного появления строк (оставь, если нужно)
  const section = document.getElementById("profile-result");
  if (!section) return;
  const list = section.querySelector('.output-list');
  if (list) {
    const items = Array.from(list.querySelectorAll('li'));
    let shown = false;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !shown) {
        shown = true;
        items.forEach((li, idx) => {
          setTimeout(() => {
            li.classList.remove('opacity-0', 'translate-y-6');
            li.classList.add('opacity-100', 'translate-y-0');
          }, idx * 160);
        });
        observer.disconnect();
      }
    }, { threshold: 0.16 });
    observer.observe(section);
  }

  // Живой фон, следящий за мышкой
  const glow = document.getElementById('profile-glow-bg');
  if (!glow) return;
  section.addEventListener('mousemove', (e) => {
    const rect = section.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    glow.style.background = `radial-gradient(ellipse 42% 30% at ${x}% ${y}%, rgba(34,197,94,0.22) 0%, transparent 78%)`;
  });
  section.addEventListener('mouseleave', () => {
    // возвращаем градиент в центр секции
    glow.style.background = `radial-gradient(ellipse 40% 28% at 50% 55%, rgba(34,197,94,0.22) 0%, transparent 80%)`;
  });
}